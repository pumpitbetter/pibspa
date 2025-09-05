#!/bin/bash
# Isolated SSR development server

echo "🚀 Starting SSR development server (isolated)..."

# Ensure we're in the main project directory
cd "$(dirname "$0")/.."

# Copy necessary files to workspace-ssr if they don't exist
if [ ! -f workspace-ssr/package.json ]; then
    echo "📦 Setting up SSR workspace..."
    cp package.json workspace-ssr/
    cp tsconfig.json workspace-ssr/ 2>/dev/null || true
    
    # Create symlinks to shared resources
    ln -sf ../node_modules workspace-ssr/node_modules 2>/dev/null || true
    ln -sf ../public workspace-ssr/public 2>/dev/null || true
    ln -sf ../app-ssr workspace-ssr/app 2>/dev/null || true
fi

# Navigate to SSR workspace
cd workspace-ssr

echo "📁 Working directory: $(pwd)"
echo "⚙️  Using SSR configuration (ssr: true)"
echo "🎯 Target port: 5174"

# Start Vite dev server with SSR config
echo "🔥 Starting SSR dev server..."
npx vite dev --port 5174 --host