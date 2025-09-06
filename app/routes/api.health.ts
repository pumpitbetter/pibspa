import { prisma } from "~/lib/db/prisma";

export async function loader() {
  try {
    // Simple database connection test
    await prisma.$queryRaw`SELECT 1`;
    
    // Get some basic stats
    const exerciseCount = await prisma.exercise.count();
    const userCount = await prisma.user.count();
    
    return new Response(
      JSON.stringify({
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
        stats: {
          exercises: exerciseCount,
          users: userCount,
        },
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