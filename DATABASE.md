# Database Setup Guide

This guide explains how to set up and use the PostgreSQL database with Prisma for PumpItBetter SPA.

## Quick Start

### Automated Setup (Recommended)

Run the setup script to start everything automatically:

```bash
./scripts/setup-database.sh
```

This script will:
1. Start PostgreSQL container
2. Wait for database to be ready
3. Generate Prisma client
4. Push database schema
5. Seed initial data

### Manual Setup

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
Opens Prisma Studio at: http://localhost:5555

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

### Basic Database Connection

```typescript
import { prisma } from "~/lib/db/prisma";

// Example: Get all exercises
const exercises = await prisma.exercise.findMany({
  where: { isDefault: true },
  orderBy: { name: 'asc' }
});
```

### In React Router Loaders

```typescript
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const exercises = await prisma.exercise.findMany();
  return { exercises };
};
```

## Troubleshooting

### Database Connection Issues

1. **Check if Docker is running**:
   ```bash
   docker info
   ```

2. **Check container status**:
   ```bash
   docker-compose ps
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