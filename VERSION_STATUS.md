# Version Deployment Status

## Current Versions

| Platform   | Version | Status             | Released    | Notes                 |
|------------|---------|--------------------|-------------|-----------------------|
| SPA Web    | 0.1.5   | � Development     | 2025-09-05  | Ready for deployment  |
| iOS        | 0.1.5   | 🟡 Development     | 2025-09-05  | Ready for TestFlight  |
| Android    | 0.1.5   | 🟡 Development     | 2025-09-05  | Ready for Play Store  |

## Version History

### v0.1.5 (2025-09-05)
**SSR Setup & Database Integration Complete**

#### 🏗️ New Architecture Features
- **Dual Build System**: Implemented SSR/SPA build configurations for web and mobile
- **Database Initialization Fix**: Resolved infinite loading with useEffect-based RxDB initialization
- **Smart Routing**: Web users see marketing → app, mobile apps go directly to `/app/queue`
- **Mobile App Optimization**: SPA builds for faster mobile app performance

#### 🛠️ Technical Improvements  
- **Route Cleanup**: Removed server loaders from all app routes, centralized database readiness
- **TypeScript Compliance**: All routes pass type checking with proper database assertions
- **Build Separation**: SSR output (`build/ssr/`) for web, SPA output (`build/spa/`) for mobile
- **Development Workflow**: `npm run dev` for web development, `npm run dev:spa` for mobile

#### 📱 Mobile Integration
- **Tauri Configuration**: Mobile apps configured to start at `/app/queue` automatically  
- **Build Commands**: `npm run build:spa` for mobile app builds
- **Performance**: Optimized SPA bundles for mobile deployment

#### 📚 Documentation
- **Comprehensive Guides**: Created `docs/ssr-setup-and-database-integration.md`
- **Updated Build Docs**: Enhanced `BUILD.md` with SSR/SPA workflows
- **README Updates**: Added new development and build commands

**Status**: ✅ Complete - Ready for deployment to all platforms  
**Platforms**: Ready for iOS Beta, Android Beta, Web Production

### v0.1.4 (2025-08-21)
- Testing auto deployment of Android internal and iOS beta builds and tooling around it.- **Platforms:** iOS Beta, Android Beta, Web Production
- **Platforms:** iOS Beta, Android Internal, Web Production

### v0.1.0 (2025-08-15)
- Initial release
- Core workout features
- **Platforms:** iOS Beta, Android Beta, Web Production

