#!/bin/bash
echo "Setting up SPA development environment with symbolic links..."

# Remove existing routes directory if it exists
if [ -d "app/routes" ]; then
    echo "Removed existing routes directory"
    rm -rf app/routes
fi

# Create routes directory
mkdir -p app/routes

# Create symbolic links for each route file/directory in routes-spa
find app/routes-spa -type f -name "*.tsx" | while read file; do
    # Get relative path from routes-spa
    rel_path=${file#app/routes-spa/}
    # Create directory structure if needed
    mkdir -p "app/routes/$(dirname "$rel_path")"
    # Create symbolic link pointing back to routes-spa
    ln -sf "../../routes-spa/$rel_path" "app/routes/$rel_path"
done

# Handle directories that might contain non-tsx files
find app/routes-spa -type d | while read dir; do
    if [ "$dir" != "app/routes-spa" ]; then
        rel_path=${dir#app/routes-spa/}
        mkdir -p "app/routes/$rel_path"
    fi
done

# Backup and restore original react-router.config.ts if it exists
if [ -f "react-router.config.ts.backup" ]; then
    cp react-router.config.ts.backup react-router.config.ts
    echo "Restored original react-router.config.ts from backup"
else
    # Create backup if it doesn't exist
    cp react-router.config.ts react-router.config.ts.backup
    echo "Created backup of react-router.config.ts"
fi

echo "SPA development environment ready with symbolic links"
echo "Now run: npx react-router typegen"