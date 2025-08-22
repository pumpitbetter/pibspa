#!/bin/bash
# Script to setup SPA config for development

echo "Setting up SPA development environment..."

# Clean up any existing routes directory
if [ -d app/routes ]; then
    rm -rf app/routes
    echo "Removed existing routes directory"
fi

#!/bin/bash
# Script to setup SPA config for development with hot reloading support

echo "Setting up SPA development environment..."

# Clean up any existing routes directory
if [ -d app/routes ]; then
    rm -rf app/routes
    echo "Removed existing routes directory"
fi

# Create routes directory
mkdir -p app/routes

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