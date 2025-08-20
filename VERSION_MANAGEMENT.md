# Version Management Strategy

This document outlines how we manage versions across all PumpItBetter platforms.

## 🎯 Versioning Strategy: Unified Semantic Versioning

### Single Source of Truth
**All platforms use the same version number**, sourced from `package.json`:

```json
{
  "version": "0.1.1"  // ← Master version for all platforms
}
```

### Platform Version Sync

| Platform | Version Source | Auto-Sync | Location |
|----------|---------------|-----------|----------|
| **SPA Web App** | `package.json` | ✅ Native | `package.json` |
| **iOS App** | `package.json` | ✅ Tauri | `src-tauri/tauri.conf.json` |
| **Android App** | `package.json` | ✅ Tauri | `src-tauri/tauri.conf.json` |
| **Desktop App** | `package.json` | ✅ Tauri | `src-tauri/tauri.conf.json` |

Tauri automatically syncs `package.json` version to `tauri.conf.json` during builds.

## 📋 Version Update Process

### 1. Update Master Version
```bash
# Update version in package.json (this updates all platforms, no git tags created)
npm version patch   # 0.1.1 → 0.1.2 (bug fixes)
npm version minor   # 0.1.1 → 0.2.0 (new features)
npm version major   # 0.1.1 → 1.0.0 (breaking changes)
```

**Note:** Git tagging is disabled by default (.npmrc) for safer manual control.

### 2. Verify Version Sync
```bash
# Check all platforms have same version (automated script)
npm run check-versions

# Manual version sync (if needed after manual edits)
npm run check-versions --sync

# Or verify manually:
echo "Package.json: $(node -p "require('./package.json').version")"
echo "Tauri Config: $(node -p "require('./src-tauri/tauri.conf.json').version")"

# They should match!
```

### 2b. Manual Version Updates (If Needed)
If you manually edit `package.json` version:

```bash
# Option 1: Auto-sync with enhanced script
npm run check-versions --sync

# Option 2: Use npm to update both files
npm version 0.1.3

# Option 3: Manual verification
npm run check-versions  # Will show mismatch and guide you
```

### 3. Build and Deploy
```bash
# All platforms will use the updated version
npm run ios:beta      # iOS v0.1.2
npm run android:beta  # Android v0.1.2
npm run build         # SPA v0.1.2
```

## 🚀 Release Workflow

### Feature Release Example

1. **Develop features** in `main` branch
2. **Update version** when ready to release (no git tag created automatically):
   ```bash
   npm version minor  # 0.1.1 → 0.2.0
   git push          # Push version commit (no tags pushed)
   ```
3. **Deploy to all platforms**:
   ```bash
   npm run ios:beta      # iOS v0.2.0 to TestFlight
   npm run android:beta  # Android v0.2.0 to Play Store Beta
   npm run build         # SPA v0.2.0 ready for web deployment
   ```
4. **Test across platforms** with same version number
5. **Promote manually** when ready:
   - iOS: TestFlight → App Store (manual in App Store Connect)
   - Android: Beta → Production (manual in Play Console)
   - Web: Deploy SPA build to production

**Note:** Git tagging is optional and can be done manually when releasing to production if desired.

## 📊 Version Tracking

### Current Version Status

Create a simple status file to track deployment status:

```bash
# Create version status file
cat > VERSION_STATUS.md << 'EOF'
# Version Deployment Status

## Current Versions

| Platform | Version | Status | Released | Notes |
|----------|---------|--------|----------|-------|
| **SPA Web** | 0.1.1 | 🟢 Production | 2025-08-20 | Current live version |
| **iOS** | 0.1.1 | 🟡 TestFlight | 2025-08-20 | In beta testing |
| **Android** | 0.1.1 | 🟡 Play Store Beta | 2025-08-20 | In beta testing |

## Version History

### v0.1.1 (2025-08-20)
- Fixed authentication bug
- Improved workout tracking
- **Platforms:** iOS Beta, Android Beta, Web Production

### v0.1.0 (2025-08-15)
- Initial release
- Core workout features
- **Platforms:** iOS Beta, Android Beta, Web Production

EOF
```

### Automated Version Tracking Script

**Enhanced script with sync capability:**

```bash
#!/bin/bash
# scripts/check-versions.sh

echo "🔍 PumpItBetter Version Status"
echo "================================"

# Get package.json version
PACKAGE_VERSION=$(node -p "require('./package.json').version" 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Could not read package.json"
    exit 1
fi
echo "📦 Package.json: v$PACKAGE_VERSION"

# Get Tauri version
TAURI_VERSION=$(node -p "require('./src-tauri/tauri.conf.json').version" 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Could not read src-tauri/tauri.conf.json"
    exit 1
fi
echo "🔧 Tauri Config: v$TAURI_VERSION"

# Check if they match
if [ "$PACKAGE_VERSION" = "$TAURI_VERSION" ]; then
    echo "✅ Versions are synchronized"
else
    echo "❌ Version mismatch detected!"
    echo "   Package.json: v$PACKAGE_VERSION"
    echo "   Tauri Config: v$TAURI_VERSION"
    echo ""
    
    # Ask if user wants to sync
    if [ "$1" = "--sync" ] || [ "$1" = "-s" ]; then
        echo "🔧 Syncing Tauri config to match package.json..."
        # Update Tauri config version to match package.json
        node -e "
        const fs = require('fs');
        const config = JSON.parse(fs.readFileSync('./src-tauri/tauri.conf.json', 'utf8'));
        config.version = '$PACKAGE_VERSION';
        fs.writeFileSync('./src-tauri/tauri.conf.json', JSON.stringify(config, null, 2) + '\n');
        console.log('✅ Tauri config updated to v$PACKAGE_VERSION');
        "
    else
        echo "🔧 To sync: npm run check-versions --sync"
        echo "🔧 Or use: npm version patch|minor|major (no git tags created)"
        exit 1
    fi
fi

# Check build outputs if they exist
if [ -d "src-tauri/gen/android" ]; then
    echo "🤖 Android project exists"
fi

if [ -d "src-tauri/gen/ios" ]; then
    echo "📱 iOS project exists"
fi

echo ""
echo "🚀 Ready to deploy v$PACKAGE_VERSION to all platforms!"
echo ""
echo "Commands:"
echo "  iOS Beta:     npm run ios:beta"
echo "  Android Beta: npm run android:beta"
echo "  Web Build:    npm run build"
```

**Usage:**
```bash
# Check version status
npm run check-versions

# Auto-sync versions after manual edit
npm run check-versions --sync

# Update version status documentation
npm run update-version-status
```

## 📋 Version Status Documentation

### Update VERSION_STATUS.md Script

The `update-version-status.sh` script automatically updates the `VERSION_STATUS.md` file with the current version and deployment information.

**What it does:**
- Reads current version from `package.json`
- Prompts for release notes
- Updates the version status table with current date
- Adds new version to history section
- Creates a backup of the previous file
- Preserves existing version history

**Usage:**
```bash
npm run update-version-status
```

**Interactive prompts:**
1. Enter release notes (one per line)
2. Press Enter twice when finished
3. Script automatically formats and updates VERSION_STATUS.md

**Example output:**
- Updates version table to show current version across all platforms
- Adds version history entry with your release notes
- Creates backup file: `VERSION_STATUS.md.backup`
- Provides git commit commands for next steps

**Best practices:**
- Run after successful deployments to all platforms
- Include meaningful release notes describing changes
- Review the updated file before committing
- Use after bumping versions and deploying to beta tracks

## 🏷️ Git Tagging Strategy (Optional)

Git tagging is now optional and disabled by default for safer manual control.

### Tag Format
Use semver tags: `v0.1.1`, `v0.2.0`, `v1.0.0`

### Manual Tagging Workflow (Optional)
```bash
# After version bump and testing
npm version minor                    # Updates package.json to 0.2.0 (no git tag)
git add .                           # Stage tauri.conf.json update  
git commit -m "chore: bump to v0.2.0"

# Create tag manually only if desired (e.g., for production releases)
git tag -a v0.2.0 -m "Release v0.2.0: New workout features"
git push origin main --tags         # Push commits and tags
```

### Tag Annotations
Include release notes in tag annotations:
```bash
git tag -a v0.2.0 -m "Release v0.2.0

New Features:
- Advanced workout tracking
- Exercise progress charts
- Social sharing

Platforms:
- iOS: TestFlight ready
- Android: Play Store Beta ready  
- Web: Production ready

Breaking Changes: None
Migration Required: None"
```

## 📝 Release Notes Management

### Format for All Platforms

Use consistent release notes across platforms:

```markdown
## v0.2.0 - Enhanced Workout Tracking

### 🆕 New Features
- Advanced progress charts
- Exercise history export
- Social workout sharing

### 🐛 Bug Fixes  
- Fixed sync issues with cloud backup
- Improved app startup performance

### 🔧 Technical
- Updated React Router to v7.3
- Enhanced offline mode support
- iOS/Android build optimizations

### ⬆️ Upgrade Notes
No migration required. All data preserved.
```

## 🔄 Platform-Specific Considerations

### iOS (App Store Connect)
- Uses `CFBundleShortVersionString` (marketing version) from package.json
- Uses `CFBundleVersion` (build number) synced to match marketing version
- Both are automatically updated by Fastlane during iOS builds
- TestFlight shows version as "0.2.0 (0.2.0)" - both numbers will match

### Android (Google Play Console)  
- Uses `versionName` from Tauri config
- Version code auto-calculated from semver
- Play Store shows "Version 0.2.0 (1001)"

### Web (SPA)
- Version visible in browser dev tools
- Can add version display in app footer
- Deploy notes should reference version

## 🚨 Emergency Hotfix Process

### For Critical Bug Fixes

1. **Create hotfix branch**:
   ```bash
   git checkout -b hotfix/v0.1.2
   ```

2. **Fix the bug and test**

3. **Bump patch version (no git tag created)**:
   ```bash
   npm version patch  # 0.1.1 → 0.1.2
   # Or manually edit and sync:
   # Edit package.json → npm run check-versions --sync
   ```

4. **Deploy to all platforms immediately**:
   ```bash
   npm run ios:beta && npm run android:beta
   ```

5. **Merge back to main**:
   ```bash
   git checkout main
   git merge hotfix/v0.1.2
   git push    # No tags pushed automatically
   ```

## 🎯 Best Practices

### ✅ Do This
- ✅ Always use `npm version` to update versions (auto-syncs, no git tags created)
- ✅ Use `npm run check-versions --sync` after manual edits
- ✅ Keep all platforms on same version number
- ✅ Git tagging is optional - only tag production releases if desired
- ✅ Update VERSION_STATUS.md after deployments
- ✅ Test all platforms before promoting to production
- ✅ Use semantic versioning correctly (patch/minor/major)
- ✅ Bump patch version for every beta deployment (avoids build conflicts)

### ❌ Avoid This
- ❌ Manually editing version numbers without syncing
- ❌ Different versions across platforms
- ❌ Skipping version bumps for releases
- ❌ Promoting untested builds to production
- ❌ Reusing version numbers (causes iOS/Android upload failures)
- ❌ Relying on automatic git tagging (now disabled for safety)

## 📞 Quick Reference

### Check Current Version
```bash
npm run check-versions     # Run version status script
npm run check-versions --sync  # Auto-sync after manual changes
```

### Update Version Documentation
```bash
npm run update-version-status  # Interactive update of VERSION_STATUS.md
```

### Bump Version and Deploy
```bash
# Patch release (bug fixes) - no git tag created
npm version patch && npm run ios:beta && npm run android:beta

# Minor release (new features) - no git tag created  
npm version minor && npm run ios:beta && npm run android:beta

# Major release (breaking changes) - no git tag created
npm version major && npm run ios:beta && npm run android:beta
```

### Manual Version Management
```bash
# If you manually edit package.json:
npm run check-versions --sync     # Auto-sync to Tauri config

# Or use npm for both files:
npm version 0.1.4  # Updates both files
```

### Emergency Hotfix
```bash
git checkout -b hotfix/critical-fix
# ... make fixes ...
npm version patch  # Auto-syncs both files, no git tag created
npm run ios:beta && npm run android:beta
npm run update-version-status  # Document the hotfix deployment
git checkout main && git merge hotfix/critical-fix
```

## 🔄 Complete Deployment Workflow

### Typical Release Process
```bash
# 1. Develop and test features
git checkout main
# ... make changes ...

# 2. Bump version for release
npm version minor  # or patch/major

# 3. Deploy to beta platforms
npm run ios:beta
npm run android:beta

# 4. Update documentation
npm run update-version-status
# Enter release notes when prompted

# 5. Commit version status update
git add VERSION_STATUS.md
git commit -m "docs: update version status to v$(node -p 'require("./package.json").version')"

# 6. Push changes
git push origin main
```

---

**Last Updated:** August 2025
**Current Strategy:** Unified Semantic Versioning with Manual Git Tagging Control
**Auto-Tagging:** Disabled for safer manual workflow
**Next Review:** When team grows beyond 5 developers