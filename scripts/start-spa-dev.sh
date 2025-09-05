#!/bin/bash
# Start SPA development server with isolated configuration

echo "🚀 Starting SPA development server..."

# Set up SPA configuration
cp react-router.spa-dev.config.ts react-router.config.ts
echo "✅ Configured for SPA development (app-spa directory)"

# Start Vite with SPA config
echo "🔥 Starting Vite dev server on port 5173..."
vite dev --config vite.spa-dev.config.ts --port 5173