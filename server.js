import express from 'express';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

// Helper function to serve static files for SPA
function serveSpaStatic(filePath, res, contentType = 'text/html') {
  try {
    if (existsSync(filePath)) {
      const content = readFileSync(filePath);
      res.setHeader('Content-Type', contentType);
      res.send(content);
      return true;
    }
  } catch (error) {
    console.error('Error serving static file:', error);
  }
  return false;
}

// Middleware to determine which app to serve based on subdomain
app.use(async (req, res, next) => {
  const hostname = req.get('host')?.split(':')[0] || '';
  const pathname = req.path;

  console.log(`${new Date().toISOString()} - ${req.method} ${hostname}${pathname}`);

  // Health check endpoint
  if (pathname === '/health') {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      hostname: hostname 
    });
    return;
  }

  // Determine which app to serve based on subdomain OR path
  const isAppSubdomain = hostname.startsWith('app.') || hostname.includes('app-');
  const isAppPath = pathname.startsWith('/app');
  const isWwwSubdomain = hostname.startsWith('www.') || hostname.includes('www-');
  
  // Serve static assets for SSR (non-app subdomains and non-app paths)
  if (!isAppSubdomain && !isAppPath && (pathname.startsWith('/assets/') || pathname.includes('.'))) {
    // First try SSR client build assets
    if (pathname.startsWith('/assets/')) {
      // Check if we're in Docker (production) or local development
      const ssrAssetPath = existsSync(join(__dirname, './build/ssr/client'))
        ? join(__dirname, './build/ssr/client', pathname)
        : join(__dirname, './ssr/client', pathname);
      
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
      
      if (serveSpaStatic(ssrAssetPath, res, contentTypes[ext] || 'text/plain')) {
        return;
      }
    }
    
    // Then try public assets
    const publicAssetPath = join(__dirname, './public', pathname);
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
    
    if (serveSpaStatic(publicAssetPath, res, contentTypes[ext] || 'text/plain')) {
      return;
    }
  }
  
  try {
    if (isAppSubdomain || isAppPath) {
      // Serve SPA fitness app for app.* subdomains OR /app path
      console.log('Serving SPA for:', isAppSubdomain ? `subdomain: ${hostname}` : `path: ${pathname}`);
      
      // For path-based routing, adjust the asset and route paths
      const adjustedPathname = isAppPath ? pathname.replace('/app', '') || '/' : pathname;
      
      // Check if requesting a static asset
      if (adjustedPathname.startsWith('/assets/') || (adjustedPathname !== '/' && adjustedPathname.includes('.'))) {
        // Check if we're in Docker (production) or local development
        const assetPath = existsSync(join(__dirname, './build/spa/client'))
          ? join(__dirname, './build/spa/client', adjustedPathname)
          : join(__dirname, './spa/client', adjustedPathname);
        
        const ext = adjustedPathname.split('.').pop();
        const contentTypes = {
          'js': 'application/javascript',
          'css': 'text/css',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'svg': 'image/svg+xml',
          'ico': 'image/x-icon'
        };
        
        if (serveSpaStatic(assetPath, res, contentTypes[ext] || 'text/plain')) {
          return;
        }
      }
      
      // Serve SPA index.html for all other routes (client-side routing)
      const spaIndexPath = existsSync(join(__dirname, './build/spa/client'))
        ? join(__dirname, './build/spa/client/index.html')
        : join(__dirname, './spa/client/index.html');
      if (!serveSpaStatic(spaIndexPath, res)) {
        res.status(404).send('SPA Not Found');
      }
      
    } else {
      // Serve SSR marketing site for www.pumpitbetter.com or main domain
      console.log('Serving SSR for:', hostname);
      
      // Try to load and use the SSR server with Express
      try {
        // Check if we're in Docker (production) or local development
        const ssrServerPath = existsSync(join(__dirname, './build/ssr/server'))
          ? join(__dirname, './build/ssr/server/index.js')
          : join(__dirname, './ssr/server/index.js');
        
        console.log('Looking for SSR server at:', ssrServerPath);
        if (existsSync(ssrServerPath)) {
          // Import React Router server build and create Express handler
          const serverBuild = await import(ssrServerPath);
          console.log('SSR server loaded with exports:', Object.keys(serverBuild));
          
          // Create React Router request handler for Express
          const { createRequestHandler } = await import('@react-router/express');
          const handler = createRequestHandler({
            build: serverBuild
          });
          
          console.log('React Router Express handler created, processing request');
          // Call the Express handler
          handler(req, res, next);
          return;
        } else {
          console.log('SSR server file not found');
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
            <a href="https://app.${req.get('host')}" class="btn">Launch Fitness App</a>
            <a href="#features" class="btn">Learn More</a>
        </div>
        <p><small>Server: SSR Marketing (${hostname})</small></p>
    </div>
</body>
</html>
      `;
      
      res.send(fallbackHtml);
    }
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 Combined server running on http://${HOST}:${PORT}`);
  console.log(`📱 SPA App (subdomain): http://app.${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`📱 SPA App (path): http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/app`);
  console.log(`🌐 SSR Marketing: http://www.${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`🏥 Health check: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/health`);
});
