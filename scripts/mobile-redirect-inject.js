import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the built index.html file
const indexPath = join(__dirname, '..', 'build', 'spa', 'client', 'index.html');

try {
  console.log('📱 Injecting mobile redirect into index.html...');
  
  // Read the current index.html
  let htmlContent = readFileSync(indexPath, 'utf8');
  
  // Create mobile redirect script
  const mobileRedirectScript = `
<script>
  // Mobile app redirect - runs immediately before React Router loads
  (function() {
    console.log('🔍 Mobile redirect script running...');
    console.log('📍 Current location:', window.location.href);
    console.log('🌐 Protocol:', window.location.protocol);
    console.log('🖥️ User agent:', navigator.userAgent);
    console.log('📱 Inner width:', window.innerWidth);
    console.log('🔧 __TAURI__:', typeof window.__TAURI__);
    
    // For mobile apps, always redirect to /app/queue from root
    const isRootPage = window.location.pathname === '/' || window.location.pathname === '/index.html';
    
    if (isRootPage) {
      console.log('🎯 On root page, redirecting to /app/queue');
      // Force redirect immediately
      window.location.replace('/app/queue');
      return;
    }
    
    console.log('ℹ️ Not on root page, no redirect needed');
  })();
</script>`;
  
  // Inject the script right after the <body> tag but before React Router stuff
  htmlContent = htmlContent.replace(
    /<body>/,
    `<body>${mobileRedirectScript}`
  );
  
  // Write back to file
  writeFileSync(indexPath, htmlContent, 'utf8');
  
  console.log('✅ Mobile redirect injected successfully!');
  console.log('📝 Mobile apps will now redirect to /app/queue automatically');
  
} catch (error) {
  console.error('❌ Failed to inject mobile redirect:', error);
  process.exit(1);
}