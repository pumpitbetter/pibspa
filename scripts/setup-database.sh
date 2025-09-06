#!/bin/bash

# Development database setup script for PumpItBetter SPA

set -e

echo "🚀 Setting up development database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start PostgreSQL container
echo "📦 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is healthy
until docker-compose exec postgres pg_isready -U pibspa -d pibspa_dev; do
    echo "⏳ Waiting for PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "📊 Pushing database schema..."
npm run db:push

# Seed database with initial data
echo "🌱 Seeding database..."
npm run db:seed

echo "🎉 Database setup complete!"
echo ""
echo "📍 Database connection:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: pibspa_dev"
echo "   Username: pibspa"
echo "   Password: pibspa_dev_password"
echo ""
echo "🔧 Useful commands:"
echo "   npm run db:studio     - Open Prisma Studio"
echo "   npm run docker:logs   - View PostgreSQL logs"
echo "   npm run docker:down   - Stop containers"
echo ""
echo "🌐 pgAdmin (optional):"
echo "   URL: http://localhost:8080"
echo "   Email: admin@pibspa.com"
echo "   Password: admin"