#!/bin/bash
# Script to setup SSR config for development with hot reloading support

echo "Setting up SSR development environment..."

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
echo "Hot reloading: Changes to app/routes-ssr/ files will be immediately reflected"
echo "Run 'npm run dev:spa' to switch back to SPA development"