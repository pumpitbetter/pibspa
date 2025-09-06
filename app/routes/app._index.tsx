import { redirect } from "react-router";
import { dbPromise } from "~/db/db";

export async function clientLoader() {
  // Initialize database and redirect
  if (typeof window !== 'undefined') {
    try {
      const db = await dbPromise;
      if (!db) {
        console.warn("Database initialization failed, app may not work properly");
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }
  
  throw redirect("/app/queue");
}

// This component shouldn't render due to redirects
export default function App() {
  return null;
}