/**
 * Database utilities for safe server-side database access
 */

import { prisma } from './prisma';

/**
 * Check if we're running in a server-side environment
 * where database access is allowed
 */
export function isServerSide(): boolean {
  return typeof window === 'undefined' && typeof process !== 'undefined';
}

/**
 * Check if we're in SSR mode (not SPA mode)
 */
export function isSSRMode(): boolean {
  return isServerSide() && process.env.BUILD_MODE !== 'spa';
}

/**
 * Safely get the Prisma client, with runtime checks
 * Throws an error if accessed in non-server environments
 */
export function getPrismaClient() {
  if (!isServerSide()) {
    throw new Error(
      'Database access attempted in browser environment. ' +
      'Database operations must only be used in server-side code (loaders, actions, etc.)'
    );
  }
  
  if (process.env.BUILD_MODE === 'spa') {
    throw new Error(
      'Database access attempted in SPA build. ' +
      'This route should be excluded from SPA builds or use client-side storage instead.'
    );
  }
  
  return prisma;
}

/**
 * Wrapper for database operations that provides better error messages
 */
export async function withDatabase<T>(
  operation: (db: typeof prisma) => Promise<T>,
  errorMessage = 'Database operation failed'
): Promise<T> {
  try {
    const db = getPrismaClient();
    return await operation(db);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Database access')) {
      // Re-throw our custom errors
      throw error;
    }
    
    console.error(`${errorMessage}:`, error);
    throw new Error(`${errorMessage}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}