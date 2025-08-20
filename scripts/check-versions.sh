#!/bin/bash
# Check version synchronization across all platforms

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
        echo "🔧 Or use: npm version patch|minor|major"
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