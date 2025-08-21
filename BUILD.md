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

### Android App Build (Local)
```bash
npm run android:build
```
- Builds optimized frontend bundle
- Compiles Android app with Tauri
- Generates signed APK with release configuration
- Output: `src-tauri/gen/android/app/build/outputs/apk/release/`
- Use for local testing or direct installation

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

### iOS TestFlight Deployment (Beta Testing)
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

### Android Play Store Deployment (Beta Testing)
```bash
npm run android:beta
```
- **Fully automated end-to-end workflow**
- Builds optimized React Router frontend (SPA mode)
- Configures Android signing with keystore from .env
- Compiles and signs Android app with Tauri
- Creates both APK and AAB (Android App Bundle) files
- Automatically uploads to Play Store beta track
- Uses automatic .env file loading for authentication
- **Zero manual intervention required**
- Beta testers receive notification
- Total process time: ~5 minutes

**Authentication:** Requires Play Store service account JSON key path in `.env` file.

## 🚀 Complete Android Automation Commands

| Command | Track | Auto-Publish | Purpose | Audience |
|---------|-------|--------------|---------|----------|
| `npm run android:internal` | Internal Testing | ✅ Yes | Development team testing | Up to 100 team members |
| `npm run android:alpha` | Alpha (Closed Testing) | ✅ Yes | Early adopter testing | Up to 20,000 selected testers |
| `npm run android:beta` | Beta (Closed Testing) | ✅ Yes | Release candidate testing | Up to 20,000 selected testers |
| `npm run android:build` | None | ❌ Local only | Development builds | Direct APK installation |
| `npm run android:sign` | None | ❌ Local only | Setup keystore | Keystore creation/validation |

### Google Play Testing Track Hierarchy
1. **Internal Testing** → Your development team (instant access)
2. **Alpha (Closed Testing)** → Trusted early testers  
3. **Beta (Closed Testing)** → Broader testing audience
4. **Production** → Public release

**Note:** Both Alpha and Beta are "Closed Testing" tracks that require you to invite testers via email or opt-in links in Google Play Console.

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

### Android Builds
- Android SDK installed
- Android Studio (recommended for SDK management)
- JDK 17 or newer
- Gradle 7+
- Android keystore for signing
- Fastlane (for automation)
- Google Play Console account (for deployment)

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

### Production Environment (Android)
- Android keystore file (JKS format)
- Keystore credentials in `.env` file (automatically loaded)
- Google Play Store service account JSON key
- App registered in Google Play Console
- Play Store package name matching app bundle ID

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

**Android signing issues**
- Ensure keystore file exists at path specified in `.env`
- Verify keystore credentials are correct in `.env`:
  - `ANDROID_KEYSTORE_PATH="./keystore.jks"`
  - `ANDROID_KEYSTORE_PASSWORD="your_keystore_password"`
  - `ANDROID_KEY_ALIAS="your_key_alias"`
  - `ANDROID_KEY_PASSWORD="your_key_password"`
- Run `npm run android:sign` to create a new keystore if needed
- Google Play uploads require service account JSON key in `.env`:
  - `PLAY_STORE_JSON_KEY_PATH="./play-store-key.json"`

**Tauri export issues (known limitation)**
- Tauri iOS export has known provisioning profile issues
- Workflow automatically falls back to manual .ipa creation using zip method
- This is expected behavior and doesn't affect final .ipa quality

**Frontend build errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear React Router cache: `npm run build -- --reset`

**Version sync issues**
- Check version synchronization: `npm run check-versions`
- Auto-sync after manual changes: `npm run sync`
- Verify all platforms match: package.json, src-tauri/tauri.conf.json, src-tauri/Cargo.toml
- Use `npm run bump patch` for automated updates to all files

**Build number conflicts (iOS/Android)**
- Always bump patch version before deployment: `npm run bump patch`
- Each upload requires unique build numbers across platforms
- Avoid reusing version numbers even after failed uploads

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

## � Version Management

### Version Strategy
- **Always bump patch version** for beta deployments to avoid build number conflicts
- iOS TestFlight and Android Play Store require unique build numbers for each upload
- Use semantic versioning with `package.json` as the source of truth
- **Automatic platform sync** with enhanced `bump` command

### Version Commands
```bash
# Check version status
npm run check-versions

# Bump version across all platforms (recommended)
npm run bump patch      # 0.1.1 → 0.1.2 (syncs all configs automatically)
npm run bump minor      # 0.1.2 → 0.2.0 (syncs all configs automatically)  
npm run bump major      # 0.2.0 → 1.0.0 (syncs all configs automatically)

# Manual version management
# Edit package.json: "version": "0.1.3"
npm run sync           # Syncs all other configs to match

# Deploy with new version
npm run android:beta   # or ios:beta
```

### Version Build Number Mapping
```
iOS: Marketing Version and Build Number both sync to package.json
Version: 0.1.1 → Marketing: 0.1.1, Build: 0.1.1
Version: 0.1.2 → Marketing: 0.1.2, Build: 0.1.2  
Version: 0.2.0 → Marketing: 0.2.0, Build: 0.2.0

Android: Version Name and Version Code calculated from package.json
Version: 0.1.1 → Version Name: 0.1.1, Version Code: 1001
Version: 0.1.2 → Version Name: 0.1.2, Version Code: 1002  
Version: 0.2.0 → Version Name: 0.2.0, Version Code: 2000
```

**⚠️ Important:** Each deployment requires a unique build number. Always increment patch version for beta testing to avoid upload conflicts.

## �📊 Build Outputs

| Command | Output Location | Purpose |
|---------|----------------|---------|
| `npm run build` | `build/` | Frontend bundle |
| `npm run tauri:build` | `src-tauri/target/release/bundle/` | Desktop installers |
| `npm run ios:build` | Xcode project | iOS development |
| `npm run ios:archive` | `build/ios/` | Signed iOS .ipa |
| `npm run ios:beta` | TestFlight | Beta distribution |
| `npm run android:build` | `src-tauri/gen/android/app/build/outputs/apk/release/` | Signed APK |
| `npm run android:internal` | Play Store internal track | Team testing distribution |
| `npm run android:alpha` | Play Store alpha track | Early tester distribution |
| `npm run android:beta` | Play Store beta track | Beta distribution |

## 🔄 CI/CD Integration

For automated builds, set environment variables (these match your `.env` file variables):

### iOS Variables
```bash
APPLE_ID=your-apple-id@example.com          # Same as APPLE_ID in .env
APP_SPECIFIC_PASSWORD=your-app-password     # Same as APP_SPECIFIC_PASSWORD in .env  
TEAM_ID=YOUR_TEAM_ID                        # Same as TEAM_ID in .env
BUNDLE_ID=com.pumpitbetter.app              # Same as BUNDLE_ID in .env
APP_NAME="Pump It Better"                   # Same as APP_NAME in .env
```

### Android Variables
```bash
ANDROID_KEYSTORE_PATH="./keystore.jks"      # Same as ANDROID_KEYSTORE_PATH in .env
ANDROID_KEYSTORE_PASSWORD="your_password"   # Same as ANDROID_KEYSTORE_PASSWORD in .env  
ANDROID_KEY_ALIAS="your_key_alias"          # Same as ANDROID_KEY_ALIAS in .env
ANDROID_KEY_PASSWORD="your_key_password"    # Same as ANDROID_KEY_PASSWORD in .env
PLAY_STORE_JSON_KEY_PATH="./key.json"       # Same as PLAY_STORE_JSON_KEY_PATH in .env
GOOGLE_PLAY_PACKAGE_NAME="com.pumpitbetter.app" # Same as in .env
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

- name: Build and Deploy Android
  run: |
    echo "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 --decode > keystore.jks
    echo "${{ secrets.GOOGLE_PLAY_KEY_JSON }}" > play-store-key.json
    npm run android:beta
  env:
    ANDROID_KEYSTORE_PATH: "./keystore.jks"
    ANDROID_KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
    ANDROID_KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
    ANDROID_KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
    PLAY_STORE_JSON_KEY_PATH: "./play-store-key.json"
```

## 📝 Automated Documentation & Release Notes

### 🤖 Smart Changelog Generation

Automatically generate professional release notes from your git commit history using conventional commit patterns.

#### Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| **Generate Changelog** | `npm run generate-changelog` | Preview auto-generated release notes |
| **Auto Version Status** | `npm run update-version-status-auto` | Update docs with AI-assisted release notes |
| **Manual Version Status** | `npm run update-version-status` | Update docs with manual release notes |

#### Workflow Integration

**Complete Release Workflow with Automation:**
```bash
# 1. Develop with conventional commits
git commit -m "feat: add workout progress tracking"
git commit -m "fix: resolve timer synchronization issue"
git commit -m "perf: optimize chart rendering performance"

# 2. Bump version for release
npm version minor  # 0.1.1 → 0.2.0

# 3. Preview what changed
npm run generate-changelog

# 4. Deploy with auto-generated release notes
npm run update-version-status-auto
npm run ios:beta && npm run android:beta

# 5. Commit documentation updates
git add VERSION_STATUS.md
git commit -m "docs: update version status to v0.2.0"
git push
```

#### Conventional Commit Patterns

For best results with automatic changelog generation, use these commit message patterns:

| Pattern | Example | Generated Section |
|---------|---------|-------------------|
| `feat:` | `feat: add exercise search` | **New Features** |
| `fix:` | `fix: resolve crash on workout save` | **Bug Fixes** |
| `perf:` | `perf: optimize app startup time` | **Performance Improvements** |
| `docs:` | `docs: update deployment guide` | **Documentation** |
| `style:` | `style: fix code formatting` | **Style Changes** |
| `refactor:` | `refactor: simplify workout logic` | **Code Refactoring** |
| `test:` | `test: add unit tests for auth` | **Testing** |
| `build:` | `build: update dependencies` | **Build & CI** |
| `chore:` | `chore: update version` | **Maintenance** |

**Breaking Changes:**
```bash
git commit -m "feat!: redesign workout data structure

BREAKING CHANGE: Previous workout data needs migration.
Run 'npm run migrate-workouts' after updating."
```

#### App Store & Play Store Ready

The generated release notes are formatted appropriately for:
- **App Store Connect** (iOS) - Release notes field
- **Google Play Console** (Android) - What's new section  
- **Internal documentation** - VERSION_STATUS.md file
- **GitHub releases** - Release description
- **Team communication** - Slack/email updates

**Example auto-generated output:**
```markdown
## New Features
- Add workout progress tracking with visual charts
- Implement exercise search and filtering system

## Bug Fixes  
- Resolve timer synchronization issue during workouts
- Fix crash when saving workout with custom exercises

## Performance Improvements
- Optimize chart rendering performance by 60%
- Reduce app startup time from 3s to 1.2s

## Documentation
- Update deployment troubleshooting guide
- Add API documentation for workout endpoints
```

#### Smart Features

**Automatic Detection:**
- Categorizes commits by conventional commit type
- Identifies breaking changes from commit messages
- Filters out version bumps and merge commits
- Groups related changes together
- Prioritizes user-facing changes

**Multiple Output Formats:**
- Markdown for documentation
- Plain text for app stores
- Structured data for API integration
- Release notes ready for copy/paste

**Git Integration:**
- Analyzes commits since last git tag or version
- Handles complex git histories with merges
- Respects `.gitignore` patterns
- Works with any git workflow (GitFlow, GitHub Flow, etc.)

#### Best Practices

**For Development:**
- Use conventional commit messages consistently
- Write descriptive commit messages beyond just the type
- Group related changes in logical commits
- Include issue references when applicable

**For Releases:**
- Run `npm run generate-changelog` before version bumps to preview changes
- Use `npm run update-version-status-auto` for quick, professional release notes
- Review auto-generated content before deploying
- Edit generated notes when needed for marketing copy

**For Team Workflow:**
- Train team members on conventional commit patterns
- Use commit templates to standardize format
- Include changelog generation in CI/CD pipelines
- Regular review of generated content quality

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
**Android Deployment:** Fully automated via npm run android:beta
