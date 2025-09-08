# Database Setup Guide

This guide explains how to set up and use the PostgreSQL database with Prisma for PumpItBetter SPA.

**⚠️ IMPORTANT: Database access is only available in SSR builds, not SPA builds for mobile apps.**

## Prerequisites

Before setting up the server database, ensure you have Docker installed:

### Install Docker Desktop

1. **Download Docker Desktop** from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Install and start** Docker Desktop
3. **Verify installation** by running:
   ```bash
   docker --version
   ```

If you prefer not to use Docker, you can install PostgreSQL directly:
```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15
```

## Architecture Overview

PumpItBetter uses a **dual database architecture** with clear separation between client and server data:

### Client Database (RxDB)
- **Purpose**: Offline-first functionality for mobile apps
- **Technology**: RxDB (browser-based database)
- **Usage**: SPA builds, mobile apps, offline storage
- **Included in**: SPA builds ✅
- **Data**: Workout tracking, exercise definitions, progress charts

### Server Database (PostgreSQL + Prisma)
- **Purpose**: Centralized data storage for web features
- **Technology**: PostgreSQL with Prisma ORM
- **Usage**: SSR builds, server-side features, data persistence
- **Included in**: SPA builds ❌ (excluded by design)
- **Data**: User accounts, advanced analytics, server-side features

The database setup is designed with a clear separation:

- **SSR Builds** (`npm run dev`, `npm run build:ssr`): Full server database access
- **SPA Builds** (`npm run build:spa`): Server database routes excluded, client database used instead

This ensures that:
- Mobile apps don't include server-side dependencies
- Database credentials never reach client devices  
- Mobile apps remain lightweight and secure
- Both databases serve their specific purposes without conflict

## Database Terminology

When discussing databases in this project, we use these terms:

- **"Client database"** or **"RxDB"** = Browser-based database for offline functionality
- **"Server database"** or **"PostgreSQL/Prisma"** = Server-side database for centralized data
- Use context-specific terms like **"SPA database"** vs **"SSR database"** when discussing builds

## Quick Start

### Step 1: Verify Docker Installation

First, check that Docker is properly installed and running:

```bash
# Check Docker installation
docker --version

# Check if Docker is running
docker info
```

If Docker is not installed, see the [Prerequisites](#prerequisites) section above.

### Step 2: Start the Server Database

Choose one of the following methods:

#### Automated Setup (Recommended)

Run the setup script to start everything automatically:

```bash
./scripts/setup-database.shr
```

This script will:
1. Start PostgreSQL container
2. Wait for database to be ready
3. Generate Prisma client
4. Push database schema
5. Seed initial data

#### Manual Setup

If you prefer to run each step manually:

```bash
# 1. Start PostgreSQL container
npm run docker:up

# 2. Generate Prisma client
npm run db:generate

# 3. Push database schema
npm run db:push

# 4. Seed database with initial exercises
npm run db:seed
```

### Step 3: Verify Database is Working

Test your database connection:

```bash
# Open Prisma Studio to view data
npm run db:studio

# Check container status
docker ps | grep postgres

# View database logs
npm run docker:logs
```

## Database Access

### Connection Details
- **Host**: localhost
- **Port**: 5432
- **Database**: pibspa_dev
- **Username**: pibspa
- **Password**: pibspa_dev_password

### Database Tools

#### Prisma Studio (Recommended)
```bash
npm run db:studio
```
Opens Prisma Studio at: http://localhost:5556

#### pgAdmin (Optional)
If you started the full Docker compose setup:
- URL: http://localhost:8080
- Email: admin@pibspa.com
- Password: admin

#### Direct PostgreSQL Connection
```bash
# Connect using psql
docker exec -it pibspa-postgres psql -U pibspa -d pibspa_dev
```

## Database Commands

### Development
```bash
# Start database container
npm run docker:up

# Stop database container
npm run docker:down

# View database logs
npm run docker:logs

# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Reset database and run all migrations
npm run db:migrate:reset

# Seed database with initial data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Schema Changes

1. Modify `prisma/schema.prisma`
2. Generate client: `npm run db:generate`
3. Push changes: `npm run db:push`
4. Update seed data if needed: `npm run db:seed`

For production, use migrations instead:
```bash
npm run db:migrate
```

## Schema Overview

### Current Models

- **User**: User accounts and authentication
- **UserProfile**: Extended user information and preferences
- **Exercise**: Exercise definitions (default and user-created)
- **Workout**: Workout sessions
- **WorkoutExercise**: Exercises within workouts
- **WorkoutSet**: Individual sets with reps, weight, etc.

### Default Data

The seed script creates default exercises including:
- Barbell Squat
- Deadlift
- Bench Press
- Pull-ups
- Push-ups
- Running
- Plank

## Usage in Code

### Safe Database Access (Recommended)

```typescript
import { withDatabase } from "~/lib/db/utils";

// Example: Get all exercises with proper error handling
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const exercises = await withDatabase(
      async (db) => {
        return await db.exercise.findMany({
          where: { isDefault: true },
          orderBy: { name: 'asc' }
        });
      },
      'Failed to load exercises'
    );
    
    return { exercises };
  } catch (error) {
    // Handle database unavailable gracefully
    return { exercises: [] };
  }
};
```

### Direct Database Connection (SSR Only)

```typescript
import { getPrismaClient } from "~/lib/db/utils";

// Only use this in server-side code where you're certain it's SSR
const db = getPrismaClient();
const exercises = await db.exercise.findMany();
```

### Environment Checks

```typescript
import { isSSRMode, isServerSide } from "~/lib/db/utils";

// Check if database access is available
if (isSSRMode()) {
  // Safe to use database
} else {
  // Use client-side storage or skip database operations
}
```

## Build Isolation

### SSR Routes (Database Access Available)
- Routes in `app/routes/` that use `loader` functions
- API endpoints (`app/routes/api.*.ts`)
- Server-side rendering with database queries

### SPA Routes (No Database Access)
- Client-side routing in mobile apps
- Database routes are automatically excluded from SPA builds
- Use RxDB or other client-side storage instead

### Route Exclusion

Database-dependent routes are automatically excluded from SPA builds:

```javascript
// In scripts/build-spa.js
const routesToExclude = [
  'app/routes/exercises._index.tsx',  // Uses database
  'app/routes/api.health.ts',         // Uses database
  // Add new database routes here
];
```

### Build-Time Protection

The system includes multiple layers of protection:

1. **Build-time exclusion**: Database routes removed from SPA builds
2. **Import aliasing**: Prisma imports redirected to stub in SPA builds  
3. **Runtime checks**: Errors thrown if database accessed in browser
4. **Environment detection**: Automatic SSR vs SPA mode detection
5. **Automatic cleanup**: Pre-build checks and dedicated cleanup command

### Route Exclusion Recovery

If routes get "stuck" in excluded state (404 errors in SSR mode):

```bash
# Clean up any stuck exclusions
npm run build:spa:cleanup

# Or manually check for temp files
ls temp-excluded/
```

The build system now includes:
- **Pre-build cleanup**: Automatically runs before SPA builds
- **Improved error handling**: Ensures cleanup runs even if build fails  
- **Dedicated cleanup command**: `npm run build:spa:cleanup`
- **Recovery detection**: Warns about incomplete cleanup

## Troubleshooting

### Docker Installation Issues

1. **Docker command not found**:
   - Download and install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
   - Restart your terminal after installation
   - Verify with: `docker --version`

2. **Docker daemon not running**:
   - Start Docker Desktop application
   - Wait for Docker Desktop to fully start (green indicator)
   - Try command again

### Database Connection Issues

1. **Check if Docker is running**:
   ```bash
   docker info
   ```

2. **Check container status**:
   ```bash
   docker-compose ps
   # or
   docker ps | grep postgres
   ```

3. **View PostgreSQL logs**:
   ```bash
   npm run docker:logs
   ```

4. **Restart containers**:
   ```bash
   npm run docker:down
   npm run docker:up
   ```

5. **Port 5432 already in use**:
   ```bash
   # Check what's using port 5432
   sudo lsof -i :5432
   
   # Stop local PostgreSQL if running
   brew services stop postgresql
   ```

### Prisma Issues

1. **Regenerate client after schema changes**:
   ```bash
   npm run db:generate
   ```

2. **Reset database if corrupted**:
   ```bash
   npm run db:migrate:reset
   ```

3. **Check database connection**:
   ```bash
   npx prisma db pull
   ```

## Environment Variables

The database connection is configured in `.env`:

```env
DATABASE_URL="postgresql://pibspa:pibspa_dev_password@localhost:5432/pibspa_dev?schema=public"
```

Never commit the `.env` file to version control.

## Production Considerations

- Use proper database credentials
- Set up connection pooling
- Configure backup strategy
- Use migrations instead of `db:push`
- Set up monitoring and logging