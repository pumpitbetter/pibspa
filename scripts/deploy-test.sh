#!/bin/bash
# Deploy to Fly.io test environment
set -e

echo "🚀 Deploying PumpItBetter to Fly.io TEST environment..."

# Ensure we're logged in to Fly.io
if ! flyctl auth whoami >/dev/null 2>&1; then
    echo "❌ Not logged in to Fly.io. Please run: flyctl auth login"
    exit 1
fi

echo "✅ Fly.io authentication verified"

# Deploy to test environment
echo "📦 Deploying to test environment..."
flyctl deploy --config fly.test.toml --remote-only

echo "🎉 Deployment to TEST environment complete!"
echo ""
echo "📱 Your applications are available at:"
echo "   🌐 Marketing Site: https://pumpitbetter-test.fly.dev"
echo "   📱 Fitness App: https://pumpitbetter-test.fly.dev (subdomain routing will be configured later)"
echo ""
echo "🔍 Monitor your deployment:"
echo "   📊 Logs: flyctl logs --app pumpitbetter-test"
echo "   📈 Status: flyctl status --app pumpitbetter-test"
echo "   🏥 Health: curl https://pumpitbetter-test.fly.dev/health"