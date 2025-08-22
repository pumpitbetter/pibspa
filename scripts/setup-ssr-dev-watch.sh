#!/bin/bash
# Script to setup SSR config for development with file watching for hot reloading

echo "Setting up SSR development environment with file watching..."

# Backup current config and use SSR config
if [ -f react-router.config.ts ]; then
    cp react-router.config.ts react-router.config.ts.dev-backup
fi
cp react-router.ssr.config.ts react-router.config.ts

# Clean up any existing routes directory
if [ -d app/routes ]; then
    rm -rf app/routes
    echo "Removed existing routes directory"
fi

# Create routes directory
mkdir -p app/routes
echo "Created clean routes directory"

# Use direct copy instead of symbolic links for better compatibility
# React Router v7 has issues detecting symlinked routes during development
cp app/routes-ssr/_index.tsx app/routes/_index.tsx
echo "Copied SSR-compatible index route (direct file)"

# Copy only the catch-all route for client-side navigation (if needed)
cp app/routes-spa/$.tsx app/routes/$.tsx
echo "Added catch-all route"

echo "SSR development environment ready (marketing content at root)"

# Start file watcher in background for hot reloading
echo "Starting file watcher for hot reloading..."
if command -v fswatch >/dev/null 2>&1; then
    # Use fswatch if available (better performance)
    fswatch -o app/routes-ssr --batch-marker | while read num_events; do
        if [ "$num_events" != "" ]; then
            echo "Files changed in app/routes-ssr/, syncing..."
            # Only copy specific SSR files to avoid overwriting SPA catch-all
            cp app/routes-ssr/_index.tsx app/routes/_index.tsx
            echo "Synced SSR index route"
        fi
    done &
    WATCHER_PID=$!
    echo "File watcher started with fswatch (PID: $WATCHER_PID)"
elif command -v inotifywait >/dev/null 2>&1; then
    # Use inotifywait on Linux
    inotifywait -m -r -e modify,create,delete,move app/routes-ssr --format '%w%f' | while read file; do
        echo "File changed: $file, syncing..."
        # Only copy specific SSR files to avoid overwriting SPA catch-all
        cp app/routes-ssr/_index.tsx app/routes/_index.tsx
        echo "Synced SSR index route"
    done &
    WATCHER_PID=$!
    echo "File watcher started with inotifywait (PID: $WATCHER_PID)"
else
    # Fallback: Use a simple polling approach
    echo "Installing fswatch for better file watching..."
    if command -v brew >/dev/null 2>&1; then
        brew install fswatch
        echo "Installed fswatch, please restart for optimal performance"
    fi
    
    # Simple polling fallback
    (
        LAST_CHANGE=$(find app/routes-ssr -type f -exec stat -f %m {} \; | sort -n | tail -1)
        while true; do
            sleep 2
            CURRENT_CHANGE=$(find app/routes-ssr -type f -exec stat -f %m {} \; | sort -n | tail -1)
            if [ "$CURRENT_CHANGE" != "$LAST_CHANGE" ]; then
                echo "Changes detected in app/routes-ssr/, syncing..."
                # Only copy specific SSR files to avoid overwriting SPA catch-all
                cp app/routes-ssr/_index.tsx app/routes/_index.tsx
                echo "Synced SSR index route"
                LAST_CHANGE=$CURRENT_CHANGE
            fi
        done
    ) &
    WATCHER_PID=$!
    echo "File watcher started with polling (PID: $WATCHER_PID)"
fi

# Store the watcher PID for cleanup
echo $WATCHER_PID > .ssr-watcher.pid
echo "Hot reloading enabled: Changes to app/routes-ssr/ will be automatically synced"
echo "Run 'npm run dev:spa' to switch back to SPA development"