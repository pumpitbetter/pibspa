import { withDatabase, isSSRMode } from "~/lib/db/utils";

export async function loader() {
  // Early check if we're in the right environment
  if (!isSSRMode()) {
    return new Response(
      JSON.stringify({
        status: "unavailable",
        database: "not available in SPA builds",
        timestamp: new Date().toISOString(),
        environment: "spa",
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Test database connection and get stats using the safe wrapper
    const stats = await withDatabase(
      async (db) => {
        // Simple database connection test
        await db.$queryRaw`SELECT 1`;
        
        // Get some basic stats
        const exerciseCount = await db.exercise.count();
        const userCount = await db.user.count();
        
        return { exercises: exerciseCount, users: userCount };
      },
      'Health check failed'
    );
    
    return new Response(
      JSON.stringify({
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
        environment: "ssr",
        stats,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    
    return new Response(
      JSON.stringify({
        status: "unhealthy",
        database: "disconnected",
        timestamp: new Date().toISOString(),
        environment: "ssr",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}