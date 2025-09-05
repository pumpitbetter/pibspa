#!/bin/bash
# Deploy to Fly.io production environment
set -e

echo "🚀 Deploying PumpItBetter to Fly.io PRODUCTION environment..."

# Ensure we're logged in to Fly.io
if ! flyctl auth whoami >/dev/null 2>&1; then
    echo "❌ Not logged in to Fly.io. Please run: flyctl auth login"
    exit 1
fi

echo "✅ Fly.io authentication verified"

# Confirmation prompt for production deployment
echo "⚠️  You are about to deploy to PRODUCTION!"
echo "   This will update the live website at www.pumpitbetter.com"
echo "   and the fitness app at app.pumpitbetter.com"
echo ""
read -p "🤔 Are you sure you want to continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Production deployment cancelled"
    exit 1
fi

# Deploy to production environment
echo "📦 Deploying to production environment..."
flyctl deploy --config fly.toml --remote-only

echo "🎉 Deployment to PRODUCTION environment complete!"
echo ""
echo "📱 Your applications are live at:"
echo "   🌐 Marketing Site: https://www.pumpitbetter.com"
echo "   📱 Fitness App: https://app.pumpitbetter.com"
echo ""
echo "🔍 Monitor your deployment:"
echo "   📊 Logs: flyctl logs --app pumpitbetter-prod"
echo "   📈 Status: flyctl status --app pumpitbetter-prod"
echo "   🏥 Health: curl https://www.pumpitbetter.com/health"