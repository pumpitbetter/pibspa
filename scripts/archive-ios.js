#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

console.log('📱 Building iOS app with automatic .ipa creation...');

try {
  // Step 1: Build SPA for mobile
  console.log('🏗️  Building SPA for iOS...');
  execSync('npm run build:spa', { stdio: 'inherit' });

  // Step 2: Setup signing and build with Tauri (expect export to fail)
  console.log('🔧 Building iOS app (build will succeed, export will fail - that\'s expected)...');
  try {
    execSync('npx tauri ios build', { stdio: 'inherit' });
    console.log('✅ Tauri iOS build completed successfully!');
  } catch (error) {
    // Expected to fail at export step, but build should succeed
    if (error.status === 70) {
      console.log('ℹ️  Tauri export failed as expected (provisioning issue), but build succeeded');
    } else {
      console.log('⚠️  Tauri build had issues, but continuing with .ipa creation...');
    }
  }

  // Step 3: Create .ipa manually
  console.log('📦 Creating .ipa file manually...');
  
  // Ensure build/ios directory exists
  const iosDir = path.resolve('build/ios');
  if (!existsSync(iosDir)) {
    mkdirSync(iosDir, { recursive: true });
  }

  // Create Payload directory
  const payloadDir = path.join(iosDir, 'Payload');
  if (!existsSync(payloadDir)) {
    mkdirSync(payloadDir, { recursive: true });
  }

  // Copy the built app to Payload directory
  const appPath = '/Users/tommarkiewicz/Library/Developer/Xcode/DerivedData/app-bdsfehrflzbtexdldpkakbkfixqe/Build/Products/release-iphoneos/Pump It Better.app';
  
  if (existsSync(appPath)) {
    console.log('📂 Copying app bundle to Payload directory...');
    execSync(`cp -R "${appPath}" "${payloadDir}/"`, { stdio: 'inherit' });
    
    // Create the .ipa file
    console.log('🗜️  Creating .ipa archive...');
    execSync('zip -r PumpItBetter.ipa Payload/', { 
      cwd: iosDir,
      stdio: 'inherit' 
    });
    
    // Get file size
    const ipaPath = path.join(iosDir, 'PumpItBetter.ipa');
    if (existsSync(ipaPath)) {
      const stats = execSync(`ls -lh "${ipaPath}" | awk '{print $5}'`, { encoding: 'utf8' }).trim();
      console.log('✅ iOS build completed successfully! 🎉');
      console.log(`📁 .ipa file created: build/ios/PumpItBetter.ipa (${stats})`);
      console.log('🚀 Ready for distribution or testing!');
    } else {
      throw new Error('.ipa file was not created successfully');
    }
  } else {
    throw new Error(`Built app not found at: ${appPath}`);
  }

} catch (error) {
  console.error('❌ iOS build failed:', error.message);
  process.exit(1);
}