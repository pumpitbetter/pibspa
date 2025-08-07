# Build & Deployment Guide

This document outlines all build processes and deployment workflows for the PumpItBetter app.

## 🏗️ Development Builds

### Frontend Development
```bash
npm run dev
```
- Starts React Router development server
- Hot reload enabled
- Accessible at `http://localhost:5173`
- Use for frontend-only development

### Desktop Development (Tauri)
```bash
npm run tauri:dev
```
- Builds frontend and starts Tauri desktop app
- Hot reload for both frontend and Rust backend
- Opens native desktop window
- Use for desktop app development and testing

### iOS Development (Tauri + iOS Simulator)
```bash
npm run ios:dev
```
- Builds frontend and starts iOS app in simulator
- Requires Xcode and iOS simulator
- Hot reload enabled
- Use for iOS-specific development and testing

## 📦 Production Builds

### Desktop App Build
```bash
npm run tauri:build
```
- Builds optimized frontend bundle
- Compiles Rust backend for current platform
- Generates platform-specific installers (.dmg, .exe, .deb)
- Output: `src-tauri/target/release/bundle/`

### iOS App Build (Local)
```bash
npm run ios:build
```
- Builds optimized frontend bundle
- Compiles iOS app with Tauri
- Generates Xcode project
- Creates unsigned .app bundle
- Use for local testing only

### iOS Archive (App Store Ready)
```bash
npm run ios:archive
```
- Builds optimized frontend bundle
- Compiles and archives iOS app
- Code signs with Apple Developer certificate
- Creates .ipa file ready for distribution
- Output: `build/ios/`

## 🚀 Deployment

### TestFlight Deployment (Beta Testing)
```bash
npm run ios:beta
```
- **Fully automated end-to-end workflow**
- Builds optimized React Router frontend (SPA mode)
- Compiles and code signs iOS app with Tauri
- Creates .ipa file using zip-based packaging (bypasses Xcode export issues)
- Automatically uploads to TestFlight with version management
- Uses automatic .env file loading for authentication
- **Zero manual intervention required**
- Beta testers receive notification
- Total process time: ~3 minutes

**Authentication:** Automatically loads credentials from `.env` file using dotenv gem integration.

### App Store Deployment
Currently manual process:
1. Run `npm run ios:archive`  
2. Open Xcode Organizer
3. Distribute app to App Store
4. Submit for review in App Store Connect

> **Note:** Future enhancement planned to automate App Store deployment using `upload_to_app_store` action.

## 🔧 Build Requirements

### All Builds
- Node.js 18+
- npm or yarn
- All dependencies installed (`npm install`)

### Desktop Builds
- Rust toolchain
- Tauri CLI (`@tauri-apps/cli`)
- Platform-specific build tools

### iOS Builds
- macOS only
- Xcode 14+
- iOS SDK
- Apple Developer account (for signing/deployment)
- Fastlane (for automation)

## 📋 Environment Setup

> **📖 New Developer Setup**  
> If you're setting up your development environment for the first time, see **[SETUP.md](./SETUP.md)** for complete installation instructions.

### Quick Setup (Existing Environment)
```bash
# Install dependencies
npm install

# Verify Tauri CLI is installed
npx tauri --version

# Verify Fastlane is available
fastlane --version
```

### Production Environment (iOS)
- Apple Developer credentials configured in `.env` (automatically loaded)
- Valid Apple Distribution certificate and App Store provisioning profile
- App identifier registered in Apple Developer Portal
- Dotenv gem installed for automatic environment loading
- FastLane configured with automatic authentication detection

## 🐛 Troubleshooting

### Common Issues

**Build fails with "command not found: tauri"**
```bash
npm install -g @tauri-apps/cli
```

**iOS code signing issues**
- Verify Apple Developer credentials in `.env`
- Check certificate validity: `security find-identity -v -p codesigning`
- Ensure bundle ID matches registered app identifier
- FastLane will automatically manage certificates and provisioning profiles

**Fastlane authentication issues**
- ✅ **No manual exports required** - Authentication now automatic via .env file
- Generate app-specific password in Apple ID settings
- Update `.env` file variables:
  - `APPLE_ID="your-apple-developer-email@example.com"`
  - `APP_SPECIFIC_PASSWORD="your-generated-password"`
  - `TEAM_ID="YOUR_10_CHAR_TEAM_ID"`
- Dotenv gem automatically maps credentials to FastLane expectations
- Clear Fastlane session if needed: `fastlane fastlane-credentials remove`

**Tauri export issues (known limitation)**
- Tauri iOS export has known provisioning profile issues
- Workflow automatically falls back to manual .ipa creation using zip method
- This is expected behavior and doesn't affect final .ipa quality

**Frontend build errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear React Router cache: `npm run build -- --reset`

### Build Verification

**Test desktop build:**
```bash
npm run tauri:build
# Check output in src-tauri/target/release/bundle/
```

**Test iOS build:**
```bash
npm run ios:build
# Verify app opens in iOS Simulator
```

**Verify TestFlight upload:**
```bash
npm run ios:beta
# Complete automated workflow:
# ✅ Frontend build → iOS build → .ipa creation → TestFlight upload
# Check App Store Connect for new build (processing takes 2-3 minutes)
# Look for "Upload to TestFlight complete! 🎉" success message
```

## 📊 Build Outputs

| Command | Output Location | Purpose |
|---------|----------------|---------|
| `npm run build` | `build/` | Frontend bundle |
| `npm run tauri:build` | `src-tauri/target/release/bundle/` | Desktop installers |
| `npm run ios:build` | Xcode project | iOS development |
| `npm run ios:archive` | `build/ios/` | Signed iOS .ipa |
| `npm run ios:beta` | TestFlight | Beta distribution |

## 🔄 CI/CD Integration

For automated builds, set environment variables (these match your `.env` file variables):
```bash
APPLE_ID=your-apple-id@example.com          # Same as APPLE_ID in .env
APP_SPECIFIC_PASSWORD=your-app-password     # Same as APP_SPECIFIC_PASSWORD in .env  
TEAM_ID=YOUR_TEAM_ID                        # Same as TEAM_ID in .env
BUNDLE_ID=com.pumpitbetter.app              # Same as BUNDLE_ID in .env
APP_NAME="Pump It Better"                   # Same as APP_NAME in .env
```

Example GitHub Actions workflow:
```yaml
- name: Build and Deploy iOS
  run: |
    npm install
    npm run ios:beta
  env:
    APPLE_ID: ${{ secrets.APPLE_ID }}
    APP_SPECIFIC_PASSWORD: ${{ secrets.APP_SPECIFIC_PASSWORD }}
    TEAM_ID: ${{ secrets.TEAM_ID }}
```

## 📞 Support

For build issues:
1. Check this documentation
2. Check **[SETUP.md](./SETUP.md)** for environment setup issues
3. Review error logs carefully
4. Verify all requirements are met
5. Check Apple Developer Portal for account issues
6. Consult Tauri documentation for platform-specific issues

---

**Last Updated:** August 2025  
**Tauri Version:** 2.0  
**React Router Version:** 7.x  
**FastLane Version:** 2.x with dotenv integration  
**iOS Deployment:** Fully automated via npm run ios:beta
