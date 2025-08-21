#!/bin/bash
# Enhanced version bump script that syncs all platform files
#
# Usage: npm run bump patch      # Bump package.json and sync all
#        npm run bump minor      # Bump package.json and sync all
#        npm run bump major      # Bump package.json and sync all  
#        npm run bump --sync     # Sync configs to match package.json (after manual edit)

VERSION_TYPE=$1

# Handle sync mode (when package.json was manually edited)
if [ "$VERSION_TYPE" = "--sync" ] || [ "$VERSION_TYPE" = "-s" ]; then
    echo "🔄 Syncing all configs to match package.json..."
    
    # Get current package.json version
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    
    if [ -z "$CURRENT_VERSION" ]; then
        echo "❌ Could not read package.json version"
        exit 1
    fi
    
    echo "📦 Package.json version: v$CURRENT_VERSION"
    
    # Sync all other files to match
    echo "🔧 Syncing Tauri config..."
    node -e "
    const fs = require('fs');
    const config = JSON.parse(fs.readFileSync('./src-tauri/tauri.conf.json', 'utf8'));
    config.version = '$CURRENT_VERSION';
    fs.writeFileSync('./src-tauri/tauri.conf.json', JSON.stringify(config, null, 2) + '\n');
    console.log('✅ Tauri config updated to v$CURRENT_VERSION');
    "
    
    echo "🔧 Syncing Cargo.toml..."
    sed -i '' "s/^version = \".*\"/version = \"$CURRENT_VERSION\"/" src-tauri/Cargo.toml
    echo "✅ Cargo.toml updated to v$CURRENT_VERSION"
    
    # Verify sync
    echo ""
    echo "🔍 Verification:"
    echo "📦 Package.json: v$(node -p "require('./package.json').version")"
    echo "🔧 Tauri Config: v$(node -p "require('./src-tauri/tauri.conf.json').version")"
    echo "🦀 Cargo.toml: v$(grep '^version = ' src-tauri/Cargo.toml | cut -d'"' -f2)"
    
    echo ""
    echo "✅ All versions synchronized to v$CURRENT_VERSION"
    echo ""
    echo "🚀 Ready to deploy:"
    echo "  npm run ios:beta"
    echo "  npm run android:beta"
    
    exit 0
fi

# Handle version bump mode
if [ -z "$VERSION_TYPE" ]; then
    echo "❌ Usage: npm run bump [patch|minor|major|--sync]"
    echo ""
    echo "Examples:"
    echo "  npm run bump patch   # Bug fixes (0.1.5 → 0.1.6)"
    echo "  npm run bump minor   # New features (0.1.5 → 0.2.0)"
    echo "  npm run bump major   # Breaking changes (0.1.5 → 1.0.0)"
    echo "  npm run bump --sync  # Sync configs after manual package.json edit"
    exit 1
fi

echo "🔄 Bumping $VERSION_TYPE version and syncing all platforms..."

# 1. Bump package.json version
npm version $VERSION_TYPE

# 2. Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")

echo "📦 Updated to v$NEW_VERSION"

# 3. Sync all other files
echo "🔧 Syncing Tauri config..."
node -e "
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./src-tauri/tauri.conf.json', 'utf8'));
config.version = '$NEW_VERSION';
fs.writeFileSync('./src-tauri/tauri.conf.json', JSON.stringify(config, null, 2) + '\n');
console.log('✅ Tauri config updated to v$NEW_VERSION');
"

echo "🔧 Syncing Cargo.toml..."
sed -i '' "s/^version = \".*\"/version = \"$NEW_VERSION\"/" src-tauri/Cargo.toml
echo "✅ Cargo.toml updated to v$NEW_VERSION"

# 4. Verify sync
echo ""
echo "🔍 Verification:"
echo "📦 Package.json: v$(node -p "require('./package.json').version")"
echo "🔧 Tauri Config: v$(node -p "require('./src-tauri/tauri.conf.json').version")"
echo "🦀 Cargo.toml: v$(grep '^version = ' src-tauri/Cargo.toml | cut -d'"' -f2)"

echo ""
echo "✅ All versions synchronized to v$NEW_VERSION"
echo ""
echo "🚀 Ready to deploy:"
echo "  npm run ios:beta"
echo "  npm run android:beta"