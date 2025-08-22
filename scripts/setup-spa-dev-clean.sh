#!/bin/bash
echo "Setting up clean SPA development environment..."

# Remove existing routes directory if it exists
if [ -d "app/routes" ]; then
    echo "Removed existing routes directory"
    rm -rf app/routes
fi

# Copy SPA routes to main routes directory for development
echo "Copying SPA routes for development..."
cp -r app/routes-spa app/routes

# Generate types for the copied routes
echo "Generating React Router types..."
npx react-router typegen

echo "✅ SPA development environment ready!"
echo ""
echo "📁 File structure:"
echo "   app/routes-spa/ ← Your source files (commit these to git)"
echo "   app/routes/     ← Development files (DO NOT commit these)"
echo "   .react-router/  ← Generated types (DO NOT commit these)"
echo ""
echo "🔄 Development workflow:"
echo "   1. Edit files in app/routes/ (full TypeScript support)"
echo "   2. When ready to commit:"
echo "      - Copy changes back: cp -r app/routes/* app/routes-spa/"
echo "      - Commit from app/routes-spa/"
echo ""
echo "🚀 Start development: npm run dev:spa"