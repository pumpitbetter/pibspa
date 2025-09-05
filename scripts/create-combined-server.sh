#!/bin/bash
# Combined server that handles both SSR marketing site and SPA fitness app
# Routes based on subdomain: www.pumpitbetter.com -> SSR, app.pumpitbetter.com -> SPA

# This script creates a server entry point for production deployment
mkdir -p scripts

cat > scripts/combined-server.js << 'EOF'
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

// Helper function to serve static files
function serveStatic(filePath, res, contentType = 'text/html') {
  try {
    if (existsSync(filePath)) {
      const content = readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
      return true;
    }
  } catch (error) {
    console.error('Error serving static file:', error);
  }
  return false;
}

// Main server handler
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const hostname = req.headers.host?.split(':')[0] || '';
  const pathname = url.pathname;

  console.log(`${new Date().toISOString()} - ${req.method} ${hostname}${pathname}`);

  // Health check endpoint
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      hostname: hostname 
    }));
    return;
  }

  // Determine which app to serve based on subdomain
  const isAppSubdomain = hostname.startsWith('app.') || hostname.includes('app-');
  const isWwwSubdomain = hostname.startsWith('www.') || hostname.includes('www-');
  
  try {
    if (isAppSubdomain) {
      // Serve SPA fitness app for app.pumpitbetter.com
      console.log('Serving SPA for:', hostname);
      
      // Check if requesting a static asset
      if (pathname.startsWith('/assets/') || pathname.includes('.')) {
        const assetPath = join(__dirname, '../spa', pathname);
        const ext = pathname.split('.').pop();
        const contentTypes = {
          'js': 'application/javascript',
          'css': 'text/css',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'svg': 'image/svg+xml',
          'ico': 'image/x-icon'
        };
        
        if (serveStatic(assetPath, res, contentTypes[ext] || 'text/plain')) {
          return;
        }
      }
      
      // Serve SPA index.html for all other routes (client-side routing)
      const spaIndexPath = join(__dirname, '../spa/index.html');
      if (!serveStatic(spaIndexPath, res)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('SPA Not Found');
      }
      
    } else {
      // Serve SSR marketing site for www.pumpitbetter.com or main domain
      console.log('Serving SSR for:', hostname);
      
      // Check if requesting a static asset from public
      if (pathname.startsWith('/assets/') || pathname.includes('.')) {
        const publicAssetPath = join(__dirname, '../public', pathname);
        const ext = pathname.split('.').pop();
        const contentTypes = {
          'js': 'application/javascript',
          'css': 'text/css',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'svg': 'image/svg+xml',
          'ico': 'image/x-icon'
        };
        
        if (serveStatic(publicAssetPath, res, contentTypes[ext] || 'text/plain')) {
          return;
        }
      }
      
      // Try to load and use the SSR server
      try {
        const ssrServerPath = join(__dirname, '../ssr/server/index.js');
        if (existsSync(ssrServerPath)) {
          // Import and use the SSR server
          const { default: ssrServer } = await import(ssrServerPath);
          if (typeof ssrServer === 'function') {
            ssrServer(req, res);
            return;
          }
        }
      } catch (ssrError) {
        console.error('SSR server error:', ssrError);
      }
      
      // Fallback: serve a simple marketing page
      const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PumpItBetter - Your Fitness Journey Starts Here</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 40px; text-align: center; }
        .hero { max-width: 800px; margin: 0 auto; }
        h1 { color: #1a202c; font-size: 3rem; margin-bottom: 1rem; }
        p { color: #4a5568; font-size: 1.2rem; line-height: 1.6; }
        .cta { margin-top: 2rem; }
        .btn { display: inline-block; padding: 12px 24px; background: #3182ce; color: white; text-decoration: none; border-radius: 8px; margin: 8px; }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Pump It Better</h1>
        <p>Transform your fitness journey with intelligent tracking, powerful analytics, and seamless cross-platform sync.</p>
        <div class="cta">
            <a href="https://app.${req.headers.host}" class="btn">Launch Fitness App</a>
            <a href="#features" class="btn">Learn More</a>
        </div>
        <p><small>Server: SSR Marketing (${hostname})</small></p>
    </div>
</body>
</html>
      `;
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fallbackHtml);
    }
    
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Combined server running on http://${HOST}:${PORT}`);
  console.log(`📱 SPA App: http://app.${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`🌐 SSR Marketing: http://www.${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`🏥 Health check: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/health`);
});
EOF

echo "✅ Combined server script created at scripts/combined-server.js"