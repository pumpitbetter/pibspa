import { Link, NavLink, Outlet, useLoaderData } from "react-router";
import cx from "classix";
import type { Route } from "./+types/route";
import { dbPromise } from "~/db/db";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";

function navLinkStyle({ isActive }: { isActive: boolean }): string {
  return isActive
    ? cx("text-sm", "text-primary hover:text-primary")
    : cx("text-sm", "text-on-surface hover:text-primary");
}

export async function clientLoader() {
  // For now, just return empty data and let the component handle database loading
  return {
    activeWorkout: null,
  };
}// This is a *layout* for the rest of the app pages
export default function App({ loaderData }: Route.ComponentProps) {
  const [databaseReady, setDatabaseReady] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const bottomNavHeight = 56; // px
  
  useEffect(() => {
    let isMounted = true;
    
    const initializeDatabase = async () => {
      try {
        const db = await dbPromise;
        
        if (!isMounted) return;
        
        if (!db) {
          return;
        }
        
        const settings = await db.settings.findOne().exec();
        const workout = await db.workouts
          .findOne({
            selector: {
              programId: settings?.programId,
              finishedAt: null,
            },
          })
          .exec();
        
        if (!isMounted) return;
        
        setActiveWorkout(workout ? workout.toMutableJSON() : null);
        setDatabaseReady(true);
      } catch (error) {
        console.error('Database initialization failed:', error);
        if (isMounted) {
          setDatabaseReady(true); // Set to true even on error to stop loading
        }
      }
    };
    
    initializeDatabase();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Show loading state while database initializes
  if (!databaseReady) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
          <div className="text-sm text-muted-foreground mt-2">Initializing database</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-dvh">
      <div className="flex-1">
        <Outlet />
        <div className={`min-h-[${bottomNavHeight}px]`}></div>
      </div>
      {activeWorkout && (
        <div className={`fixed bottom-[56px] right-0`}>
          <Link to={`/app/workouts/${activeWorkout.id}`}>
            <Button className="min-h-[56px] rounded-none rounded-tl-lg">
              Continue Workout
            </Button>
          </Link>
        </div>
      )}
      <nav
        className={cx(
          `flex justify-around p-4 fixed bottom-0 w-full min-h-[${bottomNavHeight}px] border-ts`,
          "text-on-surface bg-surface-container border-outline-variant"
        )}
      >
        <NavLink to="program" className={navLinkStyle}>
          Program
        </NavLink>
        <NavLink to="queue" className={navLinkStyle}>
          Queue
        </NavLink>
        <NavLink to="history" className={navLinkStyle}>
          History
        </NavLink>
        <NavLink to="progress" className={navLinkStyle}>
          Progress
        </NavLink>
        <NavLink to="settings" className={navLinkStyle}>
          Settings
        </NavLink>
      </nav>
    </div>
  );
}
