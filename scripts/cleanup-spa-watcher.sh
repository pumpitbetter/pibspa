#!/bin/bash
# Script to cleanup SPA development file watcher

echo "Stopping SPA file watcher..."

# Stop the file watcher if it's running
if [ -f .spa-watcher.pid ]; then
    WATCHER_PID=$(cat .spa-watcher.pid)
    if kill -0 $WATCHER_PID 2>/dev/null; then
        kill $WATCHER_PID
        echo "Stopped file watcher (PID: $WATCHER_PID)"
    else
        echo "File watcher was not running"
    fi
    rm .spa-watcher.pid
else
    echo "No file watcher PID file found"
fi

# Also kill any fswatch processes watching routes-spa
pkill -f "fswatch.*routes-spa" 2>/dev/null && echo "Killed any remaining fswatch processes"

echo "SPA file watcher cleanup complete"