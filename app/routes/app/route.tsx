import { Link, NavLink, Outlet, useLoaderData } from "react-router";
import cx from "classix";
import type { Route } from "./+types/route";
import { dbPromise } from "~/db/db";
import { Button } from "~/components/ui/button";

function navLinkStyle({ isActive }: { isActive: boolean }): string {
  return isActive
    ? cx("text-sm", "text-primary hover:text-primary")
    : cx("text-sm", "text-on-surface hover:text-primary");
}

export async function clientLoader() {
  const db = await dbPromise;
  const settings = await db.settings.findOne().exec();
  const activeWorkout = await db.workouts
    .findOne({
      selector: {
        programId: settings?.programId,
        finishedAt: null,
      },
    })
    .exec();

  return {
    activeWorkout: activeWorkout ? activeWorkout.toMutableJSON() : null,
  };
}

// This is a *layout* for the rest of the app pages
export default function App({ loaderData }: Route.ComponentProps) {
  const { activeWorkout } = loaderData;
  console.log("activeWorkout", activeWorkout);
  const bottomNavHeight = 56; // px
  return (
    <div className="flex flex-col h-dvh">
      <div className="flex-1">
        <Outlet />
        <div className={`min-h-[${bottomNavHeight}px]`}></div>
      </div>
      {activeWorkout && (
        <div className={`fixed bottom-[56px] right-0`}>
          <Link to={`/app/workouts/${activeWorkout.id}`}>
            <Button className=" rounded-none rounded-tl-lg">
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
