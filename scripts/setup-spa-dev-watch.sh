#!/bin/bash
# Script to setup SPA config for development with file watching for hot reloading

echo "Setting up SPA development environment..."

# Clean up any existing routes directory
if [ -d app/routes ]; then
    rm -rf app/routes
    echo "Removed existing routes directory"
fi

# Copy SPA routes to standard location
cp -r app/routes-spa app/routes
echo "Copied SPA routes to app/routes/"

# Restore SPA config
if [ -f react-router.config.ts.dev-backup ]; then
    mv react-router.config.ts.dev-backup react-router.config.ts
    echo "Restored original react-router.config.ts from backup"
else
    # Fallback to SPA config if no backup exists
    cp react-router.spa.config.ts react-router.config.ts
    echo "Set react-router.config.ts to SPA mode"
fi

echo "SPA development environment ready"

# Start file watcher in background for hot reloading
echo "Starting file watcher for hot reloading..."
if command -v fswatch >/dev/null 2>&1; then
    # Use fswatch if available (better performance)
    fswatch -o app/routes-spa --batch-marker | while read num_events; do
        if [ "$num_events" != "" ]; then
            echo "Files changed in app/routes-spa/, syncing..."
            rsync -av --delete app/routes-spa/ app/routes/
        fi
    done &
    WATCHER_PID=$!
    echo "File watcher started with fswatch (PID: $WATCHER_PID)"
elif command -v inotifywait >/dev/null 2>&1; then
    # Use inotifywait on Linux
    inotifywait -m -r -e modify,create,delete,move app/routes-spa --format '%w%f' | while read file; do
        echo "File changed: $file, syncing..."
        rsync -av --delete app/routes-spa/ app/routes/
    done &
    WATCHER_PID=$!
    echo "File watcher started with inotifywait (PID: $WATCHER_PID)"
else
    # Fallback: Use a simple polling approach
    echo "Installing fswatch for better file watching..."
    if command -v brew >/dev/null 2>&1; then
        brew install fswatch
        echo "Installed fswatch, please restart dev:spa for optimal performance"
    fi
    
    # Simple polling fallback
    (
        LAST_CHANGE=$(find app/routes-spa -type f -exec stat -f %m {} \; | sort -n | tail -1)
        while true; do
            sleep 2
            CURRENT_CHANGE=$(find app/routes-spa -type f -exec stat -f %m {} \; | sort -n | tail -1)
            if [ "$CURRENT_CHANGE" != "$LAST_CHANGE" ]; then
                echo "Changes detected in app/routes-spa/, syncing..."
                rsync -av --delete app/routes-spa/ app/routes/
                LAST_CHANGE=$CURRENT_CHANGE
            fi
        done
    ) &
    WATCHER_PID=$!
    echo "File watcher started with polling (PID: $WATCHER_PID)"
fi

# Store the watcher PID for cleanup
echo $WATCHER_PID > .spa-watcher.pid
echo "Hot reloading enabled: Changes to app/routes-spa/ will be automatically synced"