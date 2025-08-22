#!/bin/bash
echo "Updating type imports in routes-spa files..."

# Function to update a single file's import path
update_file_imports() {
    local file="$1"
    local route_path="$2"
    
    # Calculate the relative path from routes-spa file to the generated types
    # Example: routes-spa/app.history/route.tsx -> ../../.react-router/types/app/routes/app.history/+types/route
    local relative_path="../../.react-router/types/app/routes/$route_path/+types/route"
    
    # Replace the import line
    sed -i '' "s|import type { Route } from \"./+types/route\";|import type { Route } from \"$relative_path\";|g" "$file"
    echo "Updated: $file"
}

# Find all route files in routes-spa and update their imports
find app/routes-spa -name "route.tsx" | while read file; do
    # Extract the route path (directory name)
    route_path=$(dirname "$file" | sed 's|app/routes-spa/||')
    update_file_imports "$file" "$route_path"
done

# Also handle any _index.tsx files
find app/routes-spa -name "_index.tsx" | while read file; do
    # For _index files, the route path is different
    route_path=$(dirname "$file" | sed 's|app/routes-spa/||')
    if [ "$route_path" = "." ]; then
        route_path=""
    fi
    
    # Calculate relative path for _index files
    if [ -z "$route_path" ]; then
        relative_path="../../.react-router/types/app/routes/+types/_index"
    else
        relative_path="../../.react-router/types/app/routes/$route_path/+types/_index"
    fi
    
    sed -i '' "s|import type { Route } from \"./+types/.*\";|import type { Route } from \"$relative_path\";|g" "$file"
    echo "Updated: $file"
done

echo "Type import paths updated!"