# PumpItBetter - Comprehensive Fitness Tracking App

A modern, cross-platform fitness tracking application built with React Router and Tauri, supporting iOS, Android, Desktop, and Web platforms.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-0.1.5-blue.svg)]()
[![Platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android%20%7C%20Web%20%7C%20Desktop-lightgrey.svg)]()

## 🏋️ Features

- 🚀 **Cross-Platform:** Single codebase for iOS, Android, Web, and Desktop
- ⚡️ **Real-time Sync:** Workout data synced across all devices
- � **Progress Tracking:** Comprehensive analytics and progress charts
- 🔄 **Offline Support:** Full functionality without internet connection
- � **Native Performance:** Native iOS/Android apps using Tauri
- 🎨 **Modern UI:** Responsive design with TailwindCSS
- 🔒 **TypeScript:** Type-safe development experience

## 🚀 Quick Start

### Development Setup

```bash
# Install dependencies
npm install

# Start web development server
npm run dev

# Start iOS development (requires Xcode)
npm run ios:dev

# Start Android development (requires Android Studio)
npm run android:dev
```

### Production Deployment

```bash
# Deploy to iOS TestFlight (fully automated)
npm run ios:beta

# Deploy to Android Play Store Beta (fully automated)  
npm run android:beta

# Build for web production
npm run build
```

## 📋 Documentation

### 📖 Essential Guides
- **[SETUP.md](./SETUP.md)** - Complete development environment setup
- **[BUILD.md](./BUILD.md)** - Build processes and deployment workflows
- **[VERSION_MANAGEMENT.md](./VERSION_MANAGEMENT.md)** - Version strategy and automation tools

### 🏗️ Architecture & Implementation
- **[docs/ssr-setup-and-database-integration.md](./docs/ssr-setup-and-database-integration.md)** - SSR/SPA dual build system and database patterns

### 🤖 Automation & Smart Features
- **[docs/GIT_CONVENTIONS.md](./docs/GIT_CONVENTIONS.md)** - Git conventions and smart automation
- **Changelog Automation:** Auto-generate release notes from commit history
- **Version Sync:** Unified versioning across all platforms
- **Smart Documentation:** AI-assisted release note generation

## 🛠️ Available Scripts

### Development
```bash
npm run dev              # Web development server (SSR + marketing)
npm run dev:spa          # SPA development server (app-only)
npm run ios:dev          # iOS simulator development  
npm run android:dev      # Android emulator development
npm run tauri:dev        # Desktop app development
```

### Building
```bash
npm run build            # Production web build (SSR)
npm run build:spa        # Production SPA build (for mobile)
npm run tauri:build      # Desktop app build
npm run ios:build        # iOS app build (local)
npm run ios:build:sim    # iOS production build for simulator testing
npm run android:build    # Android app build (local)
```

### Deployment (Fully Automated)
```bash
npm run ios:beta         # Deploy to TestFlight
npm run android:beta     # Deploy to Play Store Beta
npm run android:alpha    # Deploy to Play Store Alpha
npm run android:internal # Deploy to Play Store Internal Testing
```

### Testing & Development Automation
```bash
npm run ios:run          # Build + install + launch production iOS app in simulator
npm run android:run      # Build + install + launch production Android app in emulator
```

### Version Management
```bash
npm run check-versions           # Check version sync across platforms
npm run bump patch              # Bump patch version (0.1.1 → 0.1.2) + sync all
npm run bump minor              # Bump minor version (0.1.1 → 0.2.0) + sync all
npm run bump major              # Bump major version (0.1.1 → 1.0.0) + sync all
npm run sync                    # Sync configs after manual package.json edit
```

### 🤖 Smart Documentation Tools
```bash
npm run generate-changelog           # Preview auto-generated release notes
npm run update-version-status        # Update docs with manual release notes
npm run update-version-status-auto   # Update docs with AI-assisted release notes
```

## 🎯 Platform Support

| Platform | Status | Deployment | Store |
|----------|--------|------------|-------|
| **iOS** | ✅ Production Ready | Automated via `npm run ios:beta` | App Store Connect |
| **Android** | ✅ Production Ready | Automated via `npm run android:beta` | Google Play Console |
| **Web** | ✅ Production Ready | Standard web deployment | Self-hosted |
| **Desktop** | ✅ Production Ready | Manual distribution | Direct download |

## 🔧 Technology Stack

- **Frontend:** React Router 7.x with TypeScript
- **UI Framework:** TailwindCSS + Radix UI components
- **Mobile/Desktop:** Tauri 2.0 (Rust backend)
- **Charts:** Chart.js for progress visualization
- **Build Tools:** Vite for fast development and builds
- **Deployment:** Fastlane for iOS/Android automation
- **State Management:** React hooks and context
- **Data Storage:** Local storage with cloud sync

## 📊 Smart Automation Features

### 🤖 Automated Changelog Generation
The project includes intelligent tools that analyze your git commits and auto-generate professional release notes:

```bash
# Preview what changed since last release
npm run generate-changelog

# Update documentation with AI assistance
npm run update-version-status-auto
```

**Uses conventional commit patterns:**
- `feat:` → **New Features**
- `fix:` → **Bug Fixes**  
- `perf:` → **Performance Improvements**
- `docs:` → **Documentation**

### 🔄 Unified Version Management
Single source of truth versioning across all platforms:
- **package.json** drives all platform versions
- **Automatic sync** to iOS, Android, and Desktop configs
- **No manual version editing** required
- **Safe deployment** with automated version bumping

### 📱 One-Command Deployment
Fully automated deployment workflows:
```bash
npm run ios:beta      # Build → Sign → Upload to TestFlight
npm run android:beta  # Build → Sign → Upload to Play Store
```
- **Zero manual steps** from code to app store
- **Automatic authentication** via environment files
- **Error handling** and recovery workflows
- **Version conflict prevention**

## 🏗️ Architecture

### Cross-Platform Strategy
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Router  │    │       Tauri      │    │   Native APIs   │
│   (Frontend)    │◄──►│   (Rust Core)    │◄──►│ (iOS/Android)   │
│                 │    │                  │    │                 │
│ • UI Components │    │ • File System    │    │ • Push Notifs   │
│ • State Mgmt    │    │ • Database       │    │ • Camera        │
│ • Routing       │    │ • Networking     │    │ • Sensors       │
│ • Charts        │    │ • Background     │    │ • Biometrics    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow
```
User Input → React Components → Tauri Commands → Rust Backend → Native APIs
                    ↓
              Real-time Updates ← WebSocket/Events ← Background Processing
```

## 🚀 Getting Started for New Developers

1. **Environment Setup:** Follow [SETUP.md](./SETUP.md) for complete instructions
2. **Learn the Conventions:** Read [docs/GIT_CONVENTIONS.md](./docs/GIT_CONVENTIONS.md)
3. **Understand Deployment:** Review [BUILD.md](./BUILD.md) deployment workflows
4. **Version Management:** Check [VERSION_MANAGEMENT.md](./VERSION_MANAGEMENT.md)

## 🤝 Contributing

### Development Workflow
1. **Create feature branch:** `git checkout -b feature/exercise-tracking`
2. **Use conventional commits:** `git commit -m "feat: add exercise search"`
3. **Test on platforms:** `npm run ios:dev` and `npm run android:dev`
4. **Generate changelog:** `npm run generate-changelog`
5. **Create pull request** with auto-generated release notes

### Code Standards
- **TypeScript** for type safety
- **ESLint + Prettier** for code formatting
- **Conventional commits** for smart automation
- **Component documentation** with examples
- **Unit tests** for critical functionality

## 📞 Support & Resources

### Documentation
- 📚 **[React Router Docs](https://reactrouter.com/)** - Frontend framework
- 🦀 **[Tauri Docs](https://tauri.app/)** - Cross-platform toolkit
- 🎨 **[TailwindCSS Docs](https://tailwindcss.com/)** - Styling framework
- 🚀 **[Fastlane Docs](https://fastlane.tools/)** - Deployment automation

### Troubleshooting
- Check **[BUILD.md](./BUILD.md)** troubleshooting section
- Review **[SETUP.md](./SETUP.md)** for environment issues
- Validate versions with `npm run check-versions`
- Test automation with `npm run generate-changelog`

### Build Issues
```bash
# Reset everything
rm -rf node_modules package-lock.json
npm install

# Check version sync
npm run check-versions --sync

# Verify build tools
npx tauri --version
fastlane --version
```

---

## 📈 Project Status

**Current Version:** v0.1.5  
**Platforms:** iOS (TestFlight), Android (Play Store Beta), Web (Production)  
**Deployment:** Fully automated via npm scripts  
**Documentation:** Complete with automation guides  
**Team Ready:** Onboarding documentation and conventions established

**Built with ❤️ for fitness enthusiasts who want to track their progress across all devices.**
