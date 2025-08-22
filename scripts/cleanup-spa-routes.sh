#!/bin/bash
# Script to clean up SPA routes after build

echo "Cleaning up SPA routes..."

# Remove the routes directory that was created for SPA build
if [ -d app/routes ]; then
    rm -rf app/routes
    echo "Removed temporary routes directory"
fi

# Restore original config
if [ -f react-router.config.ts.backup ]; then
    mv react-router.config.ts.backup react-router.config.ts
    echo "Restored original react-router.config.ts"
fi

echo "SPA routes cleanup complete"