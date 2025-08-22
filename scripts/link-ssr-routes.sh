#!/bin/bash
# Script to link all routes from routes-ssr/ to routes/ for hot reloading
# Run this after adding new routes to routes-ssr/

echo "Linking all SSR routes for hot reloading..."

# Ensure routes directory exists
mkdir -p app/routes

# Link all .tsx files from routes-ssr/ to routes/
for route_file in app/routes-ssr/*.tsx; do
    if [ -f "$route_file" ]; then
        filename=$(basename "$route_file")
        target="app/routes/$filename"
        
        # Remove existing file/link if it exists
        if [ -e "$target" ] || [ -L "$target" ]; then
            rm "$target"
        fi
        
        # Create symbolic link
        ln -sf "../routes-ssr/$filename" "$target"
        echo "Linked: $filename"
    fi
done

echo "All SSR routes linked for hot reloading!"
echo "Changes to files in app/routes-ssr/ will be immediately reflected in development"