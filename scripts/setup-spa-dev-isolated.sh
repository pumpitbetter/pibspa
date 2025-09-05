#!/bin/bash
# Script to setup SPA config for development without interfering with SSR

echo "Setting up SPA development environment (isolated)..."

# Check if SSR dev server is already running
if [ -f .ssr-running.pid ]; then
    echo "⚠️  SSR dev server appears to be running"
    echo "📋 This will set up SPA for port 5173 alongside SSR on port 5174"
    echo "🔧 Using SPA-only routes setup..."
    
    # Don't overwrite routes if SSR is running - use SPA-specific setup
    if [ ! -d app/routes ]; then
        mkdir -p app/routes
    fi
    
    # Only copy SPA routes if routes directory is empty or doesn't exist
    if [ ! -f app/routes/_index.tsx ]; then
        cp -r app/routes-spa/* app/routes/
        echo "✅ Initialized routes directory with SPA routes"
    else
        echo "ℹ️  Routes directory already exists - not overwriting"
    fi
    
    # Use SPA config only if not already set
    if [ ! -f react-router.config.ts ] || ! grep -q '"ssr": false' react-router.config.ts; then
        cp react-router.spa.config.ts react-router.config.ts
        echo "✅ Set react-router.config.ts to SPA mode"
    else
        echo "ℹ️  React Router already in SPA mode"
    fi
else
    echo "🚀 Setting up clean SPA environment..."
    
    # Clean setup when no SSR is running
    if [ -d app/routes ]; then
        rm -rf app/routes
        echo "🧹 Removed existing routes directory"
    fi
    
    cp -r app/routes-spa app/routes
    echo "📁 Copied SPA routes to app/routes/"
    
    cp react-router.spa.config.ts react-router.config.ts
    echo "⚙️  Set react-router.config.ts to SPA mode"
fi

# Mark SPA as running
echo $$ > .spa-running.pid
echo "📝 Marked SPA as running (PID: $$)"

echo "✅ SPA development environment ready on port 5173"

# Start file watcher for SPA routes
echo "👀 Starting file watcher for hot reloading..."
if command -v fswatch >/dev/null 2>&1; then
    fswatch -o app/routes-spa --batch-marker | while read num_events; do
        if [ "$num_events" != "" ]; then
            echo "🔄 Files changed in app/routes-spa/, syncing..."
            rsync -av --delete app/routes-spa/ app/routes/
        fi
    done &
    WATCHER_PID=$!
    echo "👁️  File watcher started with fswatch (PID: $WATCHER_PID)"
else
    echo "⚠️  fswatch not found - install with: brew install fswatch"
fi

echo $WATCHER_PID > .spa-watcher.pid
echo "🔥 Hot reloading enabled for SPA routes"