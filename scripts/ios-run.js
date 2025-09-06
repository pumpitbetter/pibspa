#!/usr/bin/env node

/**
 * Build iOS app and run it in simulator
 * 
 * This script:
 * 1. Builds the iOS app in release mode for simulator
 * 2. Starts a simulator if none is running
 * 3. Installs and launches the app in the simulator
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const APP_PATH = 'src-tauri/gen/apple/build/arm64-sim/Pump It Better.app';
const BUNDLE_ID = 'com.pumpitbetter.app';
const DEFAULT_SIMULATOR = 'iPhone 16'; // Fallback simulator name

// Helper function for async sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('📱 Building and running iOS app in simulator...\n');

  // Step 1: Build the iOS app for simulator
  console.log('📦 Building iOS app for simulator...');
  try {
    execSync('npm run ios:build:sim', { stdio: 'inherit' });
    console.log('✅ iOS build completed!\n');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }

  // Step 2: Check if app bundle exists
  if (!fs.existsSync(APP_PATH)) {
    console.error(`❌ App bundle not found at: ${APP_PATH}`);
    process.exit(1);
  }

  console.log(`📱 App bundle found: ${APP_PATH}`);

  // Step 3: Check for running simulators
  let runningSimulators;
  try {
    const deviceList = execSync('xcrun simctl list devices --json', { encoding: 'utf8' });
    const devices = JSON.parse(deviceList);
    
    runningSimulators = [];
    Object.keys(devices.devices).forEach(runtime => {
      devices.devices[runtime].forEach(device => {
        if (device.state === 'Booted') {
          runningSimulators.push(device);
        }
      });
    });
  } catch (error) {
    console.error('❌ Failed to check simulator status:', error.message);
    process.exit(1);
  }

  let targetSimulator;

  if (runningSimulators.length === 0) {
    console.log('🚀 No simulator running. Starting simulator...');
    
    // Get available iOS simulators
    let availableSimulators;
    try {
      const deviceList = execSync('xcrun simctl list devices --json', { encoding: 'utf8' });
      const devices = JSON.parse(deviceList);
      
      availableSimulators = [];
      Object.keys(devices.devices).forEach(runtime => {
        if (runtime.includes('iOS')) {
          devices.devices[runtime].forEach(device => {
            if (device.isAvailable) {
              availableSimulators.push(device);
            }
          });
        }
      });
    } catch (error) {
      console.error('❌ Could not list simulators:', error.message);
      process.exit(1);
    }

    if (availableSimulators.length === 0) {
      console.error('❌ No iOS simulators found.');
      console.log('Install Xcode and iOS simulators first.');
      process.exit(1);
    }

    // Find preferred simulator or use first available
    targetSimulator = availableSimulators.find(sim => sim.name === DEFAULT_SIMULATOR) || availableSimulators[0];
    
    console.log(`📱 Starting simulator: ${targetSimulator.name} (${targetSimulator.udid})`);

    // Boot the simulator
    try {
      execSync(`xcrun simctl boot ${targetSimulator.udid}`, { stdio: 'pipe' });
      
      // Open Simulator app
      execSync('open -a Simulator', { stdio: 'pipe' });
      
      console.log('⏳ Waiting for simulator to boot...');
      
      // Wait for simulator to be fully booted
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (attempts < maxAttempts) {
        try {
          const deviceList = execSync('xcrun simctl list devices --json', { encoding: 'utf8' });
          const devices = JSON.parse(deviceList);
          
          let isBooted = false;
          Object.keys(devices.devices).forEach(runtime => {
            devices.devices[runtime].forEach(device => {
              if (device.udid === targetSimulator.udid && device.state === 'Booted') {
                isBooted = true;
              }
            });
          });
          
          if (isBooted) {
            console.log('✅ Simulator booted!\n');
            break;
          }
        } catch (error) {
          // Continue waiting
        }
        
        await sleep(1000);
        attempts++;
        
        if (attempts >= maxAttempts) {
          console.error('❌ Simulator failed to boot within 30 seconds');
          process.exit(1);
        }
      }
    } catch (error) {
      console.error('❌ Failed to start simulator:', error.message);
      process.exit(1);
    }
  } else {
    targetSimulator = runningSimulators[0];
    console.log(`✅ Using running simulator: ${targetSimulator.name} (${targetSimulator.udid})\n`);
  }

  // Step 4: Install app
  console.log('📲 Installing app...');
  try {
    // First try to uninstall any existing version
    console.log('🧹 Removing any existing app version...');
    try {
      execSync(`xcrun simctl uninstall ${targetSimulator.udid} ${BUNDLE_ID}`, { stdio: 'pipe' });
      console.log('✅ Previous version removed');
    } catch (error) {
      // App wasn't installed, that's fine
      console.log('ℹ️  No previous version found');
    }
    
    execSync(`xcrun simctl install ${targetSimulator.udid} "${APP_PATH}"`, { stdio: 'inherit' });
    console.log('✅ App installed!\n');
  } catch (error) {
    console.error('❌ App installation failed:', error.message);
    process.exit(1);
  }

  // Step 5: Launch app
  console.log('🚀 Launching app...');
  try {
    const result = execSync(`xcrun simctl launch ${targetSimulator.udid} ${BUNDLE_ID}`, { encoding: 'utf8' });
    const processId = result.trim().split(': ')[1];
    console.log(`✅ App launched successfully! 🎉 (Process ID: ${processId})\n`);
    console.log('📱 Check your simulator - the app should be running!');
  } catch (error) {
    console.error('❌ App launch failed:', error.message);
    console.log('💡 You can manually launch the app from the simulator home screen.');
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});