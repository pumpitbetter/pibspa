#!/bin/bash
# Script to clean up SSR routes after build

echo "Cleaning up SSR routes..."

# Remove the entire routes directory that was created for SSR build
if [ -d app/routes ]; then
    rm -rf app/routes
    echo "Removed temporary routes directory"
fi

# Restore original config
if [ -f react-router.config.ts.backup ]; then
    mv react-router.config.ts.backup react-router.config.ts
    echo "Restored original react-router.config.ts"
fi

echo "SSR routes cleanup complete"