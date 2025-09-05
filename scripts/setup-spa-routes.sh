#!/bin/bash
# Script to setup SPA routes for SPA builds

echo "Setting up SPA routes..."

# Backup current config and use SPA config
cp react-router.config.ts react-router.config.ts.backup
cp react-router.spa.config.ts react-router.config.ts
echo "Switched to SPA configuration"

# Clean up any existing routes directory
if [ -d app/routes ]; then
    rm -rf app/routes
    echo "Removed existing routes directory"
fi

# Copy SPA routes to standard location
cp -r app/routes-spa app/routes
echo "Copied SPA routes to app/routes/"

echo "SPA routes ready for build"