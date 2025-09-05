import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { watch } from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

// Only run SSR Vite dev server for hot reloading
const SSR_PORT = 5174;

const app = express();

console.log('🚀 Starting SSR Vite dev server...');

// Start SSR Vite dev server with explicit port
const ssrServer = spawn('npx', ['vite', 'dev', '--config', 'vite.ssr.config.ts', '--port', SSR_PORT, '--host'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true,
  cwd: __dirname,
  env: { 
    ...process.env, 
    VITE_PORT: SSR_PORT,
    NODE_ENV: 'development'
  }
});

// Handle server output
let ssrReady = false;

ssrServer.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[SSR] ${output.trim()}`);
  if (output.includes('Local:') || output.includes('ready')) {
    ssrReady = true;
    checkServersReady();
  }
});

ssrServer.stderr.on('data', (data) => {
  console.error(`[SSR Error] ${data.toString().trim()}`);
});

// Watch SPA files and rebuild on changes
let isRebuilding = false;
const spaWatcher = watch(['app/routes-spa/**/*.tsx', 'app/components/**/*.tsx', 'app/lib/**/*.ts', 'app/db/**/*.ts'], {
  ignored: /node_modules/,
  persistent: true
});

spaWatcher.on('change', (path) => {
  if (!isRebuilding) {
    isRebuilding = true;
    console.log(`[SPA] File changed: ${path}`);
    console.log(`[SPA] Rebuilding...`);
    
    const rebuildProcess = spawn('npm', ['run', 'build:spa'], {
      stdio: 'pipe',
      shell: true,
      cwd: __dirname
    });
    
    rebuildProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`[SPA] ✅ Rebuild complete`);
      } else {
        console.log(`[SPA] ❌ Rebuild failed with code ${code}`);
      }
      isRebuilding = false;
    });
  }
});

let proxySetup = false;

function checkServersReady() {
  if (ssrReady && !proxySetup) {
    proxySetup = true;
    setupProxy();
  }
}

function setupProxy() {
  console.log('📡 Setting up proxy routing...');
  
  // Serve static SPA files for /app routes
  app.use('/app', express.static(join(__dirname, 'build/spa/client'), {
    fallthrough: true
  }));
  
  // Middleware to determine which app to serve based on subdomain OR path
  app.use(async (req, res, next) => {
    const hostname = req.get('host')?.split(':')[0] || '';
    const pathname = req.path;

    console.log(`${new Date().toISOString()} - ${req.method} ${hostname}${pathname}`);

    // Health check endpoint
    if (pathname === '/health') {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        hostname: hostname,
        mode: 'development',
        spa_mode: 'static_with_rebuild',
        ssr_port: SSR_PORT
      });
      return;
    }

    // Determine which app to serve based on subdomain OR path
    const isAppSubdomain = hostname.startsWith('app.') || hostname.includes('app-');
    const isAppPath = pathname.startsWith('/app');
    
    if (isAppSubdomain || isAppPath) {
      // For SPA routes, serve the index.html from the built SPA
      console.log(`Serving SPA (static):`, isAppSubdomain ? `subdomain: ${hostname}` : `path: ${pathname}`);
      
      // For subdomain access, rewrite to /app path
      if (isAppSubdomain) {
        req.url = '/app' + (req.url === '/' ? '' : req.url);
      }
      
      // Let the static middleware handle it first, if it fails, serve index.html for client-side routing
      const staticPath = join(__dirname, 'build/spa/client');
      
      // If the file doesn't exist, serve index.html for client-side routing
      if (pathname === '/app' || pathname === '/app/') {
        res.sendFile(join(staticPath, 'index.html'));
        return;
      }
      
      // Let static middleware try first, fallback to index.html
      next();
      
    } else {
      // Proxy to SSR Vite dev server
      console.log(`Proxying to SSR (port ${SSR_PORT}): ${pathname}`);
      
      const proxy = createProxyMiddleware({
        target: `http://localhost:${SSR_PORT}`,
        changeOrigin: true,
        ws: true, // Enable WebSocket proxying for HMR
        onError: (err, req, res) => {
          console.error(`SSR Proxy error: ${err.message}`);
          res.status(500).send(`SSR dev server not available (port ${SSR_PORT})`);
        },
        onProxyReq: (proxyReq, req, res) => {
          console.log(`[SSR Proxy] ${req.method} ${req.url} -> http://localhost:${SSR_PORT}${req.url}`);
        }
      });
      
      proxy(req, res, next);
    }
  });
  
  // Fallback for SPA client-side routing - serve index.html for any /app/* routes that didn't match static files
  app.get('/app/*', (req, res) => {
    res.sendFile(join(__dirname, 'build/spa/client/index.html'));
  });

  // Start the combined proxy server
  app.listen(PORT, HOST, () => {
    console.log('🎉 Development servers ready!');
    console.log(`🚀 Combined dev server running on http://${HOST}:${PORT}`);
    console.log(`📱 SPA App (subdomain): http://app.${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`📱 SPA App (path): http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/app`);
    console.log(`🌐 SSR Marketing: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`🏥 Health check: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/health`);
    console.log('');
    console.log('💡 Features:');
    console.log('  ⚡ Hot module reloading for SSR');
    console.log('  🔄 Auto-rebuild for SPA on file changes');
    console.log('  🎯 Same routing logic as production');
    console.log('');
    console.log('🔍 Development info:');
    console.log(`  SSR (hot reload): http://localhost:${SSR_PORT}`);
    console.log(`  SPA (static + rebuild): build/spa/client/`);
  });
}

// Wait for both servers to be ready before setting up proxy
setTimeout(() => {
  if (!proxySetup) {
    console.log('⚠️  Servers taking longer than expected, setting up proxy anyway...');
    setupProxy();
  }
}, 10000); // 10 second timeout

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  ssrServer.kill();
  spaWatcher.close();
  process.exit(0);
});