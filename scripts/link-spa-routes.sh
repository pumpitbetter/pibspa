#!/bin/bash
# Script to link all routes from routes-spa/ to routes/ for hot reloading
# Run this after adding new routes to routes-spa/

echo "Linking all SPA routes for hot reloading..."

# Ensure routes directory exists
mkdir -p app/routes

# Link all .tsx files from routes-spa/ to routes/
for route_file in app/routes-spa/*.tsx; do
    if [ -f "$route_file" ]; then
        filename=$(basename "$route_file")
        target="app/routes/$filename"
        
        # Remove existing file/link if it exists
        if [ -e "$target" ] || [ -L "$target" ]; then
            rm "$target"
        fi
        
        # Create symbolic link
        ln -sf "../routes-spa/$filename" "$target"
        echo "Linked: $filename"
    fi
done

# Link all subdirectories from routes-spa/ to routes/
for route_dir in app/routes-spa/*/; do
    if [ -d "$route_dir" ]; then
        dirname=$(basename "$route_dir")
        target="app/routes/$dirname"
        
        # Remove existing directory/link if it exists
        if [ -e "$target" ] || [ -L "$target" ]; then
            rm -rf "$target"
        fi
        
        # Create symbolic link
        ln -sf "../routes-spa/$dirname" "$target"
        echo "Linked directory: $dirname"
    fi
done

echo "All SPA routes linked for hot reloading!"
echo "Changes to files in app/routes-spa/ will be immediately reflected in development"