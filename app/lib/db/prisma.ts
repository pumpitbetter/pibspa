import { PrismaClient } from '@prisma/client';

// Runtime check to prevent database access in browser/SPA environments
if (typeof window !== 'undefined') {
  throw new Error(
    'Prisma client cannot be used in browser environments. ' +
    'Database operations should only be used in server-side code (loaders, actions, etc.)'
  );
}

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});