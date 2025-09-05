#!/usr/bin/env bash
# Android build and deploy script for PumpItBetter app
# This script can be used both for local builds and CI/CD pipelines

# Stop on first error
set -e

echo "🚀 Starting Android build process..."
echo "======================================"

# Check if .env file exists
if [ -f ".env" ]; then
  echo "✅ .env file found, will be used for credentials"
else
  echo "⚠️ No .env file found, using environment variables directly"
  
  # Check for required environment variables
  if [ -z "$ANDROID_KEYSTORE_PATH" ] || [ -z "$ANDROID_KEYSTORE_PASSWORD" ] || [ -z "$ANDROID_KEY_ALIAS" ] || [ -z "$ANDROID_KEY_PASSWORD" ]; then
    echo "❌ ERROR: Android signing credentials not found. Please create a .env file or set environment variables."
    echo "Required variables:"
    echo "  - ANDROID_KEYSTORE_PATH"
    echo "  - ANDROID_KEYSTORE_PASSWORD" 
    echo "  - ANDROID_KEY_ALIAS"
    echo "  - ANDROID_KEY_PASSWORD"
    exit 1
  fi
fi

# Step 1: Build frontend
echo ""
echo "📦 Building frontend..."
echo "----------------------"
npm run build

# Step 2: Set up signing
echo ""
echo "🔐 Setting up Android signing..."
echo "-----------------------------"
npm run android:sign

# Step 3: Build APK
echo ""
echo "🔨 Building Android APK..."
echo "----------------------"
npx tauri android build --release

# Find APK file
APK_PATH=$(find ./src-tauri/gen/android/app/build/outputs/apk/release -name "*.apk" | head -n 1)

if [ -z "$APK_PATH" ]; then
  echo "❌ ERROR: Could not find APK file after build."
  exit 1
else
  echo "✅ APK built successfully at: $APK_PATH"
fi

# Step 4: Build AAB for Play Store
echo ""
echo "📦 Building Android App Bundle (AAB)..."
echo "-----------------------------------"
cd ./src-tauri/gen/android && ./gradlew bundleRelease
cd ../../..

# Find AAB file
AAB_PATH=$(find ./src-tauri/gen/android/app/build/outputs/bundle/release -name "*.aab" | head -n 1)

if [ -z "$AAB_PATH" ]; then
  echo "⚠️ WARNING: Could not find AAB file after build. Play Store submission will not be possible."
else
  echo "✅ AAB built successfully at: $AAB_PATH"
fi

# Step 5: Upload to Play Store (if credentials available)
if [ -f "$PLAY_STORE_JSON_KEY_PATH" ]; then
  echo ""
  echo "🚀 Uploading to Google Play Store beta track..."
  echo "-------------------------------------------"
  echo "Using service account credentials from: $PLAY_STORE_JSON_KEY_PATH"
  
  if [ ! -z "$AAB_PATH" ]; then
    npx fastlane android beta
    echo "✅ Upload to Play Store beta track complete!"
  else
    echo "❌ ERROR: AAB file required for Play Store upload."
    echo "  Run './src-tauri/gen/android/gradlew bundleRelease' to generate AAB"
    exit 1
  fi
else
  echo ""
  echo "⚠️ Play Store JSON key not found, skipping upload."
  echo "  To upload to Play Store, set PLAY_STORE_JSON_KEY_PATH in .env file."
  echo "  Your APK is ready for manual distribution at: $APK_PATH"
  if [ ! -z "$AAB_PATH" ]; then
    echo "  Your AAB is ready for manual upload at: $AAB_PATH"
  fi
fi

echo ""
echo "🎉 Android build process complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "  1. Test the app on your device: adb install \"$APK_PATH\""
echo "  2. Upload to Play Store (if not done automatically)"
echo "  3. Share the APK with your beta testers"
echo ""
