#!/usr/bin/env node

/**
 * Build Android app and run it in emulator
 * 
 * This script:
 * 1. Builds the Android app in release mode
 * 2. Starts an emulator if none is running
 * 3. Installs and launches the APK in the emulator
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const APK_PATH = 'src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk';
const PACKAGE_NAME = 'com.pumpitbetter.app';
const DEFAULT_AVD = 'Medium_Phone_API_35'; // Fallback AVD name

// Helper function for async sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
console.log('🤖 Building and running Android app in emulator...\n');

// Step 1: Build the Android app
console.log('📦 Building Android app...');
try {
  execSync('npm run android:build', { stdio: 'inherit' });
  console.log('✅ Android build completed!\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Check if APK exists
if (!fs.existsSync(APK_PATH)) {
  console.error(`❌ APK not found at: ${APK_PATH}`);
  process.exit(1);
}

console.log(`📱 APK found: ${APK_PATH}`);

// Step 3: Check for running emulators
let devices;
try {
  devices = execSync('adb devices', { encoding: 'utf8' });
} catch (error) {
  console.error('❌ ADB not available. Make sure Android SDK is installed.');
  process.exit(1);
}

const runningDevices = devices.split('\n')
  .filter(line => line.includes('\tdevice'))
  .map(line => line.split('\t')[0]);

if (runningDevices.length === 0) {
  console.log('🚀 No emulator running. Starting emulator...');
  
  // Get available AVDs
  let avds;
  try {
    avds = execSync('emulator -list-avds', { encoding: 'utf8' }).trim().split('\n');
  } catch (error) {
    console.error('❌ Could not list AVDs. Make sure Android emulator is installed.');
    process.exit(1);
  }

  if (avds.length === 0 || avds[0] === '') {
    console.error('❌ No Android Virtual Devices (AVDs) found.');
    console.log('Create an AVD in Android Studio first.');
    process.exit(1);
  }

  // Use first available AVD or default
  const avdToUse = avds.includes(DEFAULT_AVD) ? DEFAULT_AVD : avds[0];
  console.log(`📱 Starting emulator: ${avdToUse}`);

  // Start emulator in background
  const emulatorProcess = spawn('emulator', ['-avd', avdToUse], {
    detached: true,
    stdio: 'ignore'
  });
  emulatorProcess.unref();

  // Wait for emulator to start
  console.log('⏳ Waiting for emulator to start...');
  let attempts = 0;
  const maxAttempts = 60; // 60 seconds timeout

  while (attempts < maxAttempts) {
    try {
      const currentDevices = execSync('adb devices', { encoding: 'utf8' });
      const currentRunning = currentDevices.split('\n')
        .filter(line => line.includes('\tdevice'));
      
      if (currentRunning.length > 0) {
        console.log('✅ Emulator started!\n');
        break;
      }
    } catch (error) {
      // Continue waiting
    }
    
    await sleep(1000);
    attempts++;
    
    if (attempts >= maxAttempts) {
      console.error('❌ Emulator failed to start within 60 seconds');
      process.exit(1);
    }
  }
} else {
  console.log(`✅ Using running device: ${runningDevices[0]}\n`);
}

// Step 4: Install APK
console.log('📲 Installing APK...');
try {
  // First try to uninstall any existing version to avoid signing conflicts
  console.log('🧹 Removing any existing app version...');
  try {
    execSync(`adb uninstall ${PACKAGE_NAME}`, { stdio: 'pipe' });
    console.log('✅ Previous version removed');
  } catch (error) {
    // App wasn't installed, that's fine
    console.log('ℹ️  No previous version found');
  }
  
  execSync(`adb install "${APK_PATH}"`, { stdio: 'inherit' });
  console.log('✅ APK installed!\n');
} catch (error) {
  console.error('❌ APK installation failed:', error.message);
  process.exit(1);
}

// Step 5: Launch app
console.log('🚀 Launching app...');
try {
  execSync(`adb shell am start -n ${PACKAGE_NAME}/.MainActivity`, { stdio: 'inherit' });
  console.log('✅ App launched successfully! 🎉\n');
  console.log('📱 Check your emulator - the app should be running!');
} catch (error) {
  console.error('❌ App launch failed:', error.message);
  console.log('💡 You can manually launch the app from the emulator home screen.');
}
}

// Run the main function
main().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});