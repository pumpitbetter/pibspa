#!/bin/bash
# Start SSR development server with isolated configuration

echo "🚀 Starting SSR development server..."

# Set up SSR configuration  
cp react-router.ssr-dev.config.ts react-router.config.ts
echo "✅ Configured for SSR development (app-ssr directory)"

# Start Vite with SSR config
echo "🔥 Starting Vite dev server on port 5174..."
vite dev --config vite.ssr-dev.config.ts --port 5174