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

## 📋 Version Status Documentation & Changelog Automation

### 🤖 Automated Changelog Generation

We have intelligent tools that analyze your git commits and automatically generate release notes.

#### Generate Changelog Script

The `generate-changelog.sh` script creates professional release notes from your git commit history:

**Usage:**
```bash
npm run generate-changelog
```

**What it does:**
- Analyzes git commits since the last version/tag
- Categorizes commits using conventional commit patterns
- Generates markdown-formatted release notes
- Handles breaking changes and special commits
- Provides ready-to-use content for app stores and documentation

**Example output:**
```markdown
## New Features
- Add user authentication system
- Implement dark mode toggle

## Bug Fixes  
- Fix navigation issue on mobile devices
- Resolve memory leak in chart component

## Documentation
- Update API documentation
- Add troubleshooting guide
```

#### Enhanced Version Status Script

The `update-version-status-auto.sh` script combines changelog generation with documentation updates:

**Usage:**
```bash
npm run update-version-status-auto
```

**Workflow:**
1. **Auto-generates** release notes from git history
2. **Shows preview** with 3 options:
   - Use auto-generated notes as-is
   - Edit the notes in nano
   - Enter notes manually
3. **Updates** `VERSION_STATUS.md` with your choice

**Interactive experience:**
```bash
🤖 Generating release notes from git history...
📝 Auto-generated release notes:
## New Features
- Add workout progress tracking
- Implement exercise search

Would you like to:
1) Use these auto-generated notes
2) Edit the notes  
3) Enter notes manually
Choose option (1-3): 
```

### Manual Version Status Script

The original `update-version-status.sh` script is still available for manual release note entry:

**Usage:**
```bash
npm run update-version-status
```

**Best practices:**
- Use `npm run update-version-status-auto` for quick, AI-assisted documentation
- Use `npm run update-version-status` when you want complete manual control
- Use `npm run generate-changelog` to preview what changed without updating docs
- Run after successful deployments to all platforms

## 🏷️ Git Tagging Strategy (Optional)

Git tagging is **completely optional** and disabled by default for safer manual control. The automated changelog generation works perfectly without any git tags!

### 🤖 How Changelog Generation Works

The `generate-changelog.sh` script is smart and uses this hierarchy to find changes:

1. **Git Tags** (if they exist): `v0.1.1` → `v0.1.2`
2. **Version Commits** (fallback): Finds `npm version` commits automatically  
3. **Recent Commits** (ultimate fallback): Last 10 commits if no version history

**✅ This means you can use automated release notes immediately without creating any git tags!**

### Recommended Tagging Strategy

**For Patch Releases (Beta Testing):**
```bash
npm version patch               # 0.1.1 → 0.1.2 (creates version commit)
npm run generate-changelog      # Finds changes since last version commit
npm run ios:beta && npm run android:beta
# No git tag needed - just deploy and test
```

**For Production Releases (Store Releases):**
```bash
# After successful beta testing and store promotion
git tag -a v0.1.2 -m "Production release v0.1.2: Bug fixes and stability"
git push --tags  # Optional - only if you want to track production milestones
```

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

## 📝 Git Commit Conventions & Smart Features

### 🎯 Conventional Commits for Smart Changelog Generation

Our changelog automation works best when you use conventional commit patterns. These create better release notes and help categorize changes automatically.

#### Basic Format
```
<type>: <description>

[optional body]

[optional footer]
```

#### Commit Types & When to Use

| Type | When to Use | Example | Appears In Changelog As |
|------|-------------|---------|------------------------|
| `feat:` | Adding new features or functionality | `feat: add dark mode toggle` | **New Features** |
| `fix:` | Bug fixes and error corrections | `fix: resolve navigation crash on iOS` | **Bug Fixes** |
| `docs:` | Documentation changes only | `docs: update API guide` | **Documentation** |
| `style:` | Code formatting, whitespace, semicolons | `style: fix eslint warnings` | **Style Changes** |
| `refactor:` | Code restructuring without changing functionality | `refactor: optimize workout calculation logic` | **Code Refactoring** |
| `perf:` | Performance improvements | `perf: reduce app startup time by 40%` | **Performance Improvements** |
| `test:` | Adding or updating tests | `test: add unit tests for auth service` | **Testing** |
| `build:` | Build system and dependency changes | `build: update React Router to v7.3` | **Build & CI** |
| `ci:` | CI/CD pipeline changes | `ci: add automated iOS deployment` | **Build & CI** |
| `chore:` | Maintenance tasks, version bumps | `chore: bump version to 0.2.0` | **Maintenance** |

#### Advanced Patterns

**Breaking Changes:**
```bash
git commit -m "feat!: redesign authentication system

BREAKING CHANGE: Previous auth tokens are no longer valid.
Users will need to log in again after this update."
```

**Scoped Commits (Optional):**
```bash
git commit -m "feat(auth): add two-factor authentication"
git commit -m "fix(ios): resolve push notification crash"  
git commit -m "docs(api): add workout endpoints guide"
```

**Multi-line Commits:**
```bash
git commit -m "feat: add workout progress tracking

- Track sets, reps, and weight over time
- Generate progress charts
- Export workout history to CSV
- Sync data across all devices

Closes #42, #38"
```

#### Real-World Examples

**Good Conventional Commits:**
```bash
# New features
git commit -m "feat: add exercise search and filtering"
git commit -m "feat: implement offline workout sync"

# Bug fixes  
git commit -m "fix: prevent duplicate exercise entries"
git commit -m "fix: resolve crash when deleting workout"

# Performance
git commit -m "perf: optimize chart rendering for large datasets"

# Documentation
git commit -m "docs: add deployment troubleshooting guide"

# Breaking changes
git commit -m "feat!: migrate to new workout data format

BREAKING CHANGE: Existing workouts need migration.
Run 'npm run migrate-workouts' after updating."
```

**Avoid These Patterns:**
```bash
# Too vague
git commit -m "updates"
git commit -m "fix stuff"
git commit -m "changes"

# Not descriptive enough
git commit -m "fix: bug"
git commit -m "feat: update"

# Missing type
git commit -m "add new feature"
git commit -m "fixed the problem"
```

#### How Smart Features Work

**Automatic Categorization:**
- `feat:` commits → **New Features** section
- `fix:` commits → **Bug Fixes** section  
- `docs:` commits → **Documentation** section
- Breaking changes → **Breaking Changes** section (highlighted)

**Smart Filtering:**
- Ignores merge commits and version bumps
- Combines related commits (e.g., multiple fixes for same issue)
- Prioritizes breaking changes and new features
- Handles conventional commit scopes (`feat(auth):`)

**Special Detection:**
- Recognizes `BREAKING CHANGE:` in commit bodies
- Finds GitHub issue references (`Closes #42`)
- Groups commits by type automatically
- Formats output for different platforms (App Store, Play Store, docs)

### 📋 Commit Message Templates

Create a git commit template to make conventional commits easier:

```bash
# Create commit template
cat > ~/.gitmessage << 'EOF'
# <type>: <subject> (50 chars max)
#
# <body> - Explain what and why (72 chars per line)
#
# <footer> - Reference issues, breaking changes
#
# Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
# Breaking change: Add ! after type (feat!:) and BREAKING CHANGE: in footer
EOF

# Configure git to use template
git config --global commit.template ~/.gitmessage
```

**Usage:**
```bash
git commit  # Opens editor with template
```

### 🚀 Recommended Workflow

**For Feature Development:**
```bash
# Start feature
git checkout -b feature/exercise-search

# Make commits with conventional format
git commit -m "feat: add basic exercise search functionality"
git commit -m "feat: implement exercise filtering by muscle group" 
git commit -m "test: add unit tests for search service"
git commit -m "docs: update API documentation for search endpoints"

# Merge to main
git checkout main
git merge feature/exercise-search

# Generate changelog to see what changed
npm run generate-changelog
```

**For Bug Fixes:**
```bash
# Fix bug
git commit -m "fix: resolve workout timer not stopping on app background"

# Update with auto-generated release notes
npm run update-version-status-auto
```

**For Releases:**
```bash
# Bump version 
npm version minor  # 0.1.1 → 0.2.0

# See what's new since last release
npm run generate-changelog

# Deploy with auto-generated release notes
npm run update-version-status-auto
npm run ios:beta && npm run android:beta
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