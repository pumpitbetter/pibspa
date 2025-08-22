#!/bin/bash
# Script to automatically install development dependencies after npm install

echo "🔧 Setting up development dependencies..."

# Detect platform
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 macOS detected - installing development tools..."
    
    # Check if Homebrew is installed
    if ! command -v brew >/dev/null 2>&1; then
        echo "🍺 Homebrew not found. Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH for this session
        if [[ -f "/opt/homebrew/bin/brew" ]]; then
            export PATH="/opt/homebrew/bin:$PATH"
        elif [[ -f "/usr/local/bin/brew" ]]; then
            export PATH="/usr/local/bin:$PATH"
        fi
    else
        echo "✅ Homebrew already installed"
    fi
    
    # Install fswatch for file watching (required for hot reloading)
    if ! command -v fswatch >/dev/null 2>&1; then
        echo "👁️  Installing fswatch for hot reloading..."
        brew install fswatch
        echo "✅ fswatch installed successfully"
    else
        echo "✅ fswatch already installed"
    fi
    
    # Install Ruby with rbenv if needed (required for Fastlane)
    if ! command -v rbenv >/dev/null 2>&1; then
        echo "💎 Installing rbenv for Ruby management..."
        brew install rbenv ruby-build
        echo "✅ rbenv installed - you may need to restart your terminal"
    else
        echo "✅ rbenv already installed"
    fi
    
    # Install Fastlane if Ruby is available
    if command -v ruby >/dev/null 2>&1 && command -v gem >/dev/null 2>&1; then
        if ! command -v fastlane >/dev/null 2>&1; then
            echo "🚀 Installing Fastlane for iOS/Android automation..."
            gem install fastlane
            echo "✅ Fastlane installed successfully"
        else
            echo "✅ Fastlane already installed"
        fi
    else
        echo "⚠️  Ruby not available - Fastlane installation skipped"
    fi
    
    # Install Rust toolchain for Tauri
    if ! command -v rustc >/dev/null 2>&1; then
        echo "🦀 Installing Rust toolchain for Tauri..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source ~/.cargo/env
        echo "✅ Rust installed successfully"
        
        # Add iOS targets for mobile development
        echo "📱 Adding iOS targets for mobile development..."
        rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
        echo "✅ iOS targets added"
    else
        echo "✅ Rust already installed"
    fi
    
    # Check for remaining development tools and suggest installation
    missing_tools=()
    
    if ! xcode-select -p >/dev/null 2>&1; then
        missing_tools+=("Xcode Command Line Tools")
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        echo ""
        echo "⚠️  Additional development tools needed:"
        for tool in "${missing_tools[@]}"; do
            echo "   • $tool"
        done
        echo ""
        echo "📖 Run the following to complete setup:"
        echo "   📚 Follow SETUP.md for complete installation guide"
        echo "   📱 Install Xcode Command Line Tools: xcode-select --install"
        echo ""
    else
        echo "🎉 All development tools are installed and ready!"
        echo ""
        echo "� Installed tools:"
        echo "   ✅ Homebrew package manager"
        echo "   ✅ fswatch for hot reloading"
        echo "   ✅ rbenv for Ruby management"
        echo "   ✅ Fastlane for iOS/Android automation"
        echo "   ✅ Rust toolchain with iOS targets"
    fi
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Linux detected - checking for file watching tools..."
    
    # On Linux, try to install inotify-tools for file watching
    if ! command -v inotifywait >/dev/null 2>&1; then
        echo "👁️  Installing inotify-tools for file watching..."
        
        # Try different package managers
        if command -v apt-get >/dev/null 2>&1; then
            sudo apt-get update && sudo apt-get install -y inotify-tools
        elif command -v yum >/dev/null 2>&1; then
            sudo yum install -y inotify-tools
        elif command -v dnf >/dev/null 2>&1; then
            sudo dnf install -y inotify-tools
        elif command -v pacman >/dev/null 2>&1; then
            sudo pacman -S inotify-tools
        else
            echo "⚠️  Please install inotify-tools manually for file watching support"
        fi
    else
        echo "✅ inotify-tools already installed"
    fi
    
else
    echo "⚠️  Unsupported platform: $OSTYPE"
    echo "📖 Please follow SETUP.md for manual installation"
fi

echo ""
echo "🎯 Next steps:"
echo "   🌐 For web development: npm run dev"
echo "   📱 For mobile development: npm run ios:dev or npm run android:dev"
echo "   🚀 For automated builds: npm run ios:beta or npm run android:beta"
echo "   🔥 Hot reloading is enabled for all development modes"
echo ""
echo "⚠️  Note: You may need to restart your terminal for PATH changes to take effect"
echo ""