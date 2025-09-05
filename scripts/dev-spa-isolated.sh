#!/bin/bash
# Isolated SPA development server

echo "🚀 Starting SPA development server (isolated)..."

# Ensure we're in the main project directory
cd "$(dirname "$0")/.."

# Copy necessary files to workspace-spa if they don't exist
if [ ! -f workspace-spa/package.json ]; then
    echo "📦 Setting up SPA workspace..."
    cp package.json workspace-spa/
    cp tsconfig.json workspace-spa/ 2>/dev/null || true
    
    # Create symlinks to shared resources
    ln -sf ../node_modules workspace-spa/node_modules 2>/dev/null || true
    ln -sf ../public workspace-spa/public 2>/dev/null || true
    ln -sf ../app-spa workspace-spa/app 2>/dev/null || true
fi

# Navigate to SPA workspace
cd workspace-spa

echo "📁 Working directory: $(pwd)"
echo "⚙️  Using SPA configuration (ssr: false)"
echo "🎯 Target port: 5173"

# Start Vite dev server with SPA config
echo "🔥 Starting SPA dev server..."
npx vite dev --port 5173 --host