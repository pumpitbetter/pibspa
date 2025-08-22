#!/bin/bash
echo "Syncing development changes back to source..."

if [ ! -d "app/routes" ]; then
    echo "❌ No development routes directory found. Run setup-spa-dev-clean.sh first."
    exit 1
fi

if [ ! -d "app/routes-spa" ]; then
    echo "❌ No source routes directory found."
    exit 1
fi

# Sync changes from development back to source
echo "📥 Copying changes from app/routes/ to app/routes-spa/..."
rsync -av --exclude='+types' app/routes/ app/routes-spa/

echo "✅ Changes synced to source files!"
echo ""
echo "📋 Next steps:"
echo "   - Review changes in app/routes-spa/"
echo "   - Commit your changes from app/routes-spa/"
echo "   - Continue developing in app/routes/"