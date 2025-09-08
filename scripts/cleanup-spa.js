#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🧹 Cleaning up SPA build artifacts...');

const tempDir = 'temp-excluded';
const viteConfigPath = 'vite.config.ts';
const reactRouterConfigPath = 'react-router.config.ts';
const viteConfigBackup = 'vite.config.ssr.ts';
const reactRouterConfigBackup = 'react-router.config.backup.ts';

// Routes that might be excluded during SPA builds
const routesToRestore = [
  'app/routes/marketing._index.tsx',
  'app/routes/marketing.pricing.tsx',
  'app/routes/api.auth.tsx',
  'app/routes/api.sync.tsx',
  'app/routes/api.health.ts',
  'app/routes/exercises._index.tsx',
];

let restored = 0;
let errors = 0;

// Restore configs if they exist
try {
  if (fs.existsSync(viteConfigBackup)) {
    fs.copyFileSync(viteConfigBackup, viteConfigPath);
    console.log('✅ Restored vite.config.ts');
  }
  
  if (fs.existsSync(reactRouterConfigBackup)) {
    fs.copyFileSync(reactRouterConfigBackup, reactRouterConfigPath);
    console.log('✅ Restored react-router.config.ts');
  }
} catch (error) {
  console.error('❌ Error restoring configs:', error.message);
  errors++;
}

// Restore routes from temp directory
if (fs.existsSync(tempDir)) {
  console.log(`📁 Found temp directory: ${tempDir}`);
  
  const tempFiles = fs.readdirSync(tempDir);
  tempFiles.forEach(file => {
    const tempPath = path.join(tempDir, file);
    
    // Find the original route path for this file
    const originalRoute = routesToRestore.find(route => 
      path.basename(route) === file
    );
    
    if (originalRoute) {
      try {
        // Ensure the destination directory exists
        const destDir = path.dirname(originalRoute);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        // Move the file back
        fs.renameSync(tempPath, originalRoute);
        console.log(`✅ Restored: ${originalRoute}`);
        restored++;
      } catch (error) {
        console.error(`❌ Error restoring ${originalRoute}:`, error.message);
        errors++;
      }
    } else {
      console.warn(`⚠️  Unknown temp file: ${file} (manual cleanup needed)`);
    }
  });
  
  // Remove temp directory if empty
  try {
    if (fs.readdirSync(tempDir).length === 0) {
      fs.rmSync(tempDir, { recursive: true });
      console.log('✅ Removed empty temp directory');
    } else {
      console.warn('⚠️  Temp directory not empty after cleanup');
    }
  } catch (error) {
    console.error('❌ Error removing temp directory:', error.message);
    errors++;
  }
} else {
  console.log('✅ No temp directory found - nothing to clean');
}

// Summary
console.log('\n📊 Cleanup Summary:');
console.log(`   Restored files: ${restored}`);
console.log(`   Errors: ${errors}`);

if (errors === 0) {
  console.log('✅ Cleanup completed successfully!');
  process.exit(0);
} else {
  console.log('⚠️  Cleanup completed with errors');
  process.exit(1);
}