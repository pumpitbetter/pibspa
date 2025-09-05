#!/bin/bash
# Cleanup script for isolated dev servers

echo "🧹 Cleaning up dev server state..."

# Remove PID files
rm -f .spa-running.pid .ssr-running.pid .spa-watcher.pid .ssr-watcher.pid

# Kill any remaining watchers
if [ -f .spa-watcher.pid ]; then
    WATCHER_PID=$(cat .spa-watcher.pid)
    kill $WATCHER_PID 2>/dev/null && echo "🔴 Stopped SPA file watcher"
    rm -f .spa-watcher.pid
fi

if [ -f .ssr-watcher.pid ]; then
    WATCHER_PID=$(cat .ssr-watcher.pid)
    kill $WATCHER_PID 2>/dev/null && echo "🔴 Stopped SSR file watcher"
    rm -f .ssr-watcher.pid
fi

echo "✅ Cleanup complete"