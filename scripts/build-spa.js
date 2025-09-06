#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  Building SPA for mobile apps...');

// Backup original configs
const viteConfigPath = 'vite.config.ts';
const reactRouterConfigPath = 'react-router.config.ts';
const viteConfigBackup = 'vite.config.ssr.ts';
const reactRouterConfigBackup = 'react-router.config.backup.ts';

// Create temp directory for excluded routes
const tempDir = 'temp-excluded';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Move problematic routes out temporarily
const routesToExclude = [
  'app/routes/marketing._index.tsx',
  'app/routes/marketing.pricing.tsx',
  'app/routes/api.auth.tsx',
  'app/routes/api.sync.tsx'
];

const movedRoutes = [];
routesToExclude.forEach(route => {
  if (fs.existsSync(route)) {
    const fileName = path.basename(route);
    const tempPath = path.join(tempDir, fileName);
    fs.renameSync(route, tempPath);
    movedRoutes.push({ original: route, temp: tempPath });
    console.log(`📦 Temporarily excluded: ${route}`);
  }
});

try {
  // Replace configs with SPA versions
  console.log('🔧 Configuring for SPA build...');
  
  // Replace vite config
  fs.copyFileSync('vite.spa.config.ts', viteConfigPath);
  
  // Replace react-router config with SPA version
  const spaConfig = `import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode for mobile apps
  ssr: false,
  basename: "/",
  buildDirectory: "build/spa",
  appDirectory: "app",
} satisfies Config;
`;
  fs.writeFileSync(reactRouterConfigPath, spaConfig);
  
  console.log('⚡ Running React Router build...');
  execSync('npx react-router build', { stdio: 'inherit' });
  
  console.log('📱 Injecting mobile redirect...');
  execSync('node scripts/mobile-redirect-inject.js', { stdio: 'inherit' });
  
  console.log('✅ SPA build completed successfully!');
  console.log('📁 Output: build/spa/client/');
  
} catch (error) {
  console.error('❌ SPA build failed:', error.message);
  process.exit(1);
} finally {
  // Restore original configs
  console.log('🔄 Restoring original configs...');
  try {
    fs.copyFileSync(viteConfigBackup, viteConfigPath);
    fs.copyFileSync(reactRouterConfigBackup, reactRouterConfigPath);
    
    // Restore excluded routes
    movedRoutes.forEach(({ original, temp }) => {
      if (fs.existsSync(temp)) {
        fs.renameSync(temp, original);
        console.log(`🔄 Restored: ${original}`);
      }
    });
    
    // Remove temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
    
    console.log('✅ Cleanup completed');
  } catch (cleanupError) {
    console.error('⚠️  Warning: Cleanup failed:', cleanupError.message);
    console.error('You may need to manually restore configs');
  }
}