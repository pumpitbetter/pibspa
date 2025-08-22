# PumpItBetter - Comprehensive Fitness Tracking Platform

A modern, multi-target fitness tracking platform built with React Router and Tauri, supporting iOS, Android, Desktop, and Web platforms with a unified codebase and dual-build architecture.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-0.1.4-blue.svg)]()
[![Platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android%20%7C%20Web%20%7C%20Desktop-lightgrey.svg)]()

## 🏗️ Dual-Build Architecture

PumpItBetter uses an innovative **dual-build system** that enables multiple deployment targets from a single codebase:

### 📱 SPA Build → Native Mobile Apps
- **Target:** iOS App Store, Google Play Store, Desktop
- **Technology:** React Router in SPA mode + Tauri
- **Features:** Native performance, offline-first, cross-platform sync
- **Routes:** Core fitness tracking functionality

### 🌐 SSR Build → Marketing Website
- **Target:** Web hosting platforms (Vercel, Netlify, etc.)
- **Technology:** React Router in SSR mode with server functions
- **Features:** SEO-optimized, database integration, form handling
- **Routes:** Marketing pages with `loader()` and `action()` capabilities

### 🔄 Shared Benefits
- **Component Reuse:** UI components shared across all platforms
- **Design Consistency:** Same styling system (TailwindCSS) everywhere
- **Development Efficiency:** Single codebase, multiple targets
- **Unified Tooling:** Same development and deployment workflows

## 🏋️ Features

- 🚀 **Multi-Platform:** Single codebase for iOS, Android, Web, Desktop, and Marketing
- ⚡️ **Real-time Sync:** Workout data synced across all devices
- 📊 **Progress Tracking:** Comprehensive analytics and progress charts
- 🔄 **Offline Support:** Full functionality without internet connection
- 📱 **Native Performance:** Native iOS/Android apps using Tauri
- 🌐 **Marketing Integration:** SEO-optimized website with database connectivity
- 🎨 **Modern UI:** Responsive design with TailwindCSS
- 🔒 **TypeScript:** Type-safe development experienceComprehensive Fitness Tracking App

A modern, cross-platform fitness tracking application built with React Router and Tauri, supporting iOS, Android, Desktop, and Web platforms.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-0.1.2-blue.svg)]()
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

# Start SPA development server (mobile app preview)
npm run dev

# Start SSR development server (marketing website)
npm run dev:ssr

# Start iOS development (requires Xcode)
npm run ios:dev

# Start Android development (requires Android Studio)
npm run android:dev
```

### Production Deployment

```bash
# Deploy mobile apps to stores (fully automated)
npm run ios:beta      # iOS TestFlight
npm run android:beta  # Android Play Store Beta

# Build marketing website for web hosting
npm run build:ssr

# Build native apps for distribution
npm run build:spa     # Mobile/desktop app build
```

## 📋 Documentation

### 📖 Essential Guides
- **[SETUP.md](./SETUP.md)** - Complete development environment setup
- **[BUILD.md](./BUILD.md)** - Build processes and deployment workflows
- **[VERSION_MANAGEMENT.md](./VERSION_MANAGEMENT.md)** - Version strategy and automation tools

### 🤖 Automation & Smart Features
- **[docs/GIT_CONVENTIONS.md](./docs/GIT_CONVENTIONS.md)** - Git conventions and smart automation
- **Changelog Automation:** Auto-generate release notes from commit history
- **Version Sync:** Unified versioning across all platforms
- **Smart Documentation:** AI-assisted release note generation

## 🛠️ Available Scripts

### Development
```bash
npm run dev              # SPA development server (mobile preview)
npm run dev:spa          # SPA development server (automatically cleans up SSR mode)
npm run dev:ssr          # SSR development server (marketing website)
npm run ios:dev          # iOS simulator development  
npm run android:dev      # Android emulator development
npm run tauri:dev        # Desktop app development
```

### Building
```bash
npm run build            # Default build (SPA mode)
npm run build:spa        # SPA build for mobile/desktop apps
npm run build:ssr        # SSR build for marketing website
npm run build:all        # Build both SPA and SSR targets
npm run tauri:build      # Desktop app build
npm run ios:build        # iOS app build (local)
npm run android:build    # Android app build (local)
```

### Deployment (Fully Automated)
```bash
npm run ios:beta         # Deploy to TestFlight
npm run android:beta     # Deploy to Play Store Beta
npm run android:alpha    # Deploy to Play Store Alpha
npm run android:internal # Deploy to Play Store Internal Testing
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

| Platform | Status | Build Mode | Deployment | Store |
|----------|--------|------------|------------|-------|
| **iOS App** | ✅ Production Ready | SPA | Automated via `npm run ios:beta` | App Store Connect |
| **Android App** | ✅ Production Ready | SPA | Automated via `npm run android:beta` | Google Play Console |
| **Desktop App** | ✅ Production Ready | SPA | Manual distribution | Direct download |
| **Marketing Website** | ✅ Ready for Deployment | SSR | `npm run build:ssr` | Web hosting platforms |
| **Web App** | ✅ Production Ready | SPA | Standard web deployment | Self-hosted |

### 🔍 Build Target Details

**SPA Builds** (Mobile, Desktop, Web App):
- React Router in SPA mode (`ssr: false`)
- Client-side routing only
- Optimized for Tauri consumption
- Offline-capable with data sync

**SSR Builds** (Marketing Website):
- React Router in SSR mode (`ssr: true`)
- Server-side rendering for SEO
- Database integration via `loader()` functions
- Form handling via `action()` functions
- Shared UI components with mobile apps

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

### Dual-Build Strategy
```
┌────────────────────────────────────────────────────────────────┐
│                    Shared Codebase                            │
│  ┌───────────────────┐    ┌─────────────────────────────────┐  │
│  │  UI Components    │    │         Routes                  │  │
│  │  (app/components) │    │  • app/* (both builds)         │  │
│  │                   │    │  • routes-ssr/* (SSR only)     │  │
│  └───────────────────┘    └─────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
        ┌───────────▼────────────┐    ┌────▼─────────────────┐
        │     SPA Build          │    │     SSR Build        │
        │  (build:spa)           │    │  (build:ssr)         │
        │                        │    │                      │
        │  • ssr: false          │    │  • ssr: true         │
        │  • Client routing      │    │  • Server rendering  │
        │  • Mobile optimized    │    │  • SEO optimized     │
        │  • Tauri compatible    │    │  • Database ready    │
        └───────────┬────────────┘    └────┬─────────────────┘
                    │                      │
    ┌───────────────▼───────────────┐     │
    │        Native Apps            │     │
    │                               │     │
    │  ┌─────────┐  ┌─────────────┐ │     │
    │  │   iOS   │  │   Android   │ │     │
    │  │ Tauri   │  │   Tauri     │ │     │
    │  └─────────┘  └─────────────┘ │     │
    │  ┌─────────────────────────────┤     │
    │  │        Desktop              │     │
    │  │        Tauri                │     │
    │  └─────────────────────────────┘     │
    └───────────────────────────────────────┘     │
                                                  │
                                    ┌─────────────▼─────────────┐
                                    │   Marketing Website       │
                                    │                           │
                                    │  • SEO-optimized pages    │
                                    │  • Database integration   │
                                    │  • Form handling          │
                                    │  • Shared UI components   │
                                    │  • Web hosting ready      │
                                    └───────────────────────────┘
```

### Cross-Platform Integration
```
User Input → React Components → Build System → Platform-Specific Output
                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Shared State & Logic                       │
│  • TypeScript interfaces  • Reusable hooks  • UI components    │
└─────────────────────────────────────────────────────────────────┘
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

**Current Version:** v0.1.4  
**Platforms:** iOS (TestFlight), Android (Play Store Beta), Marketing Website (Ready), Desktop (Production)  
**Deployment:** Fully automated mobile deployment, marketing website ready for hosting  
**Architecture:** Dual-build system (SPA + SSR) from single codebase  
**Documentation:** Complete with dual-build architecture guides  
**Team Ready:** Onboarding documentation and conventions established

**Built with ❤️ for fitness enthusiasts who want comprehensive tracking across all devices and platforms.**
