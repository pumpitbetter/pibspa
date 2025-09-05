#!/bin/bash
# Script to conditionally copy SSR routes for SSR builds

echo "Setting up SSR routes..."

# Backup current config and use SSR config
cp react-router.config.ts react-router.config.ts.backup
cp react-router.ssr.config.ts react-router.config.ts
echo "Switched to SSR configuration"

# Clean up any existing routes directory
if [ -d app/routes ]; then
    rm -rf app/routes
    echo "Removed existing routes directory"
fi

# Create routes directory and copy only SSR-compatible routes
mkdir -p app/routes
echo "Created clean routes directory"

# Copy SSR-specific routes only (no SPA app routes that use RxDB)
cp app/routes-ssr/_index.tsx app/routes/_index.tsx
echo "Added SSR-compatible index route"

# Copy only the catch-all route for client-side navigation (if needed)
cp app/routes-spa/$.tsx app/routes/$.tsx
echo "Added catch-all route"

echo "SSR routes ready for build (marketing content at root)"