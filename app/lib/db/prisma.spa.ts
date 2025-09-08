// SPA-safe Prisma client stub
// This file is used in SPA builds to prevent database imports

class SPAPrismaError extends Error {
  constructor() {
    super(
      'Database access is not available in SPA builds. ' +
      'Database operations should only be used in SSR routes. ' +
      'This route should be excluded from SPA builds.'
    );
    this.name = 'SPAPrismaError';
  }
}

// Create a proxy that throws an error for any database operation
export const prisma = new Proxy({}, {
  get() {
    throw new SPAPrismaError();
  },
  set() {
    throw new SPAPrismaError();
  }
}) as any;

// Log warning during development
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️  Prisma client accessed in SPA build. Database operations are not available in mobile apps.'
  );
}