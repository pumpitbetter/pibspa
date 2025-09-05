#!/bin/bash
# Script to setup SSR config for development without interfering with SPA

echo "Setting up SSR development environment (isolated)..."

# Check if SPA dev server is already running
if [ -f .spa-running.pid ]; then
    echo "⚠️  SPA dev server appears to be running"
    echo "❌ Cannot run SSR and SPA simultaneously - they share the same config files"
    echo "💡 Please stop the SPA server first with Ctrl+C, then start SSR"
    echo "🔄 Or use separate terminals and start SSR first, then SPA"
    exit 1
fi

echo "🚀 Setting up clean SSR environment..."

# Backup current config if it exists
if [ -f react-router.config.ts ]; then
    cp react-router.config.ts react-router.config.ts.dev-backup
    echo "💾 Backed up current config"
fi

# Set SSR config
cp react-router.ssr.config.ts react-router.config.ts
echo "⚙️  Set react-router.config.ts to SSR mode"

# Clean routes setup
if [ -d app/routes ]; then
    rm -rf app/routes
    echo "🧹 Removed existing routes directory"
fi

mkdir -p app/routes
echo "📁 Created clean routes directory"

# Copy SSR routes
cp app/routes-ssr/_index.tsx app/routes/_index.tsx
echo "📄 Copied SSR-compatible index route"

# Add catch-all for client navigation
cp app/routes-spa/$.tsx app/routes/$.tsx
echo "🎯 Added catch-all route"

# Mark SSR as running
echo $$ > .ssr-running.pid
echo "📝 Marked SSR as running (PID: $$)"

echo "✅ SSR development environment ready on port 5174"

# Start file watcher for SSR routes
echo "👀 Starting file watcher for hot reloading..."
if command -v fswatch >/dev/null 2>&1; then
    fswatch -o app/routes-ssr --batch-marker | while read num_events; do
        if [ "$num_events" != "" ]; then
            echo "🔄 Files changed in app/routes-ssr/, syncing..."
            cp app/routes-ssr/_index.tsx app/routes/_index.tsx
            echo "✅ Synced SSR index route"
        fi
    done &
    WATCHER_PID=$!
    echo "👁️  File watcher started with fswatch (PID: $WATCHER_PID)"
else
    echo "⚠️  fswatch not found - install with: brew install fswatch"
fi

echo $WATCHER_PID > .ssr-watcher.pid
echo "🔥 Hot reloading enabled for SSR routes"
echo "ℹ️  To run SPA alongside this, start it after SSR is running"