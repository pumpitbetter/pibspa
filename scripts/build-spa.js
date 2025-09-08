#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  Building SPA for mobile apps...');

// Check for existing temp directory and clean it up first
if (fs.existsSync('temp-excluded')) {
  console.log('⚠️  Found existing temp directory, cleaning up first...');
  try {
    execSync('node scripts/cleanup-spa.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Pre-build cleanup failed:', error.message);
    process.exit(1);
  }
}

// Backup original configs
const viteConfigPath = 'vite.config.ts';
const reactRouterConfigPath = 'react-router.config.ts';
const viteConfigBackup = 'vite.config.ssr.ts';
const reactRouterConfigBackup = 'react-router.ssr.config.ts';

// Create temp directory for excluded routes
const tempDir = 'temp-excluded';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Move problematic routes out temporarily
const routesToExclude = [
  // Marketing routes (not needed in mobile app)
  'app/routes/marketing._index.tsx',
  'app/routes/marketing.pricing.tsx',
  
  // Server-side API routes (require Node.js runtime)
  'app/routes/api.auth.tsx',
  'app/routes/api.sync.tsx',
  'app/routes/api.health.ts',
  
  // Database-dependent SSR routes (require PostgreSQL)
  'app/routes/exercises._index.tsx',
  
  // Any other SSR-only routes that use Prisma/database
  // Add more routes here as needed when they use database
];

const movedRoutes = [];
let buildError = null;

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
  
} catch (err) {
  buildError = err;
  console.error('❌ SPA build failed:', err.message);
  // Don't exit here - let finally block run cleanup first
} finally {
  // Restore original configs
  console.log('🔄 Restoring original configs...');
  let cleanupFailed = false;
  
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
    cleanupFailed = true;
    console.error('⚠️  Warning: Cleanup failed:', cleanupError.message);
    console.error('Run: npm run cleanup-spa to manually restore files');
  }
  
  // Exit with error only after cleanup attempt
  if (buildError || cleanupFailed) {
    process.exit(1);
  }
}