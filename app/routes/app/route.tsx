import { NavLink, Outlet } from "react-router";
import cx from "classix";
import type { Route } from "./+types/route";
import { db } from "~/db/db";

function navLinkStyle({ isActive }: { isActive: boolean }): string {
  return isActive
    ? cx("text-sm", "text-primary hover:text-primary")
    : cx("text-sm", "text-on-surface hover:text-primary");
}

// invoking client side db here to create/initialize so it's ready for other routes
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const settings = await db.settings.findOne().exec();
  return settings?.toMutableJSON();
}

// This is a *layout* for the rest of the app pages
export default function App() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <Outlet />
      </div>
      <nav
        className={cx(
          "flex justify-around p-4 fixed bottom-0 w-full border-ts",
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
