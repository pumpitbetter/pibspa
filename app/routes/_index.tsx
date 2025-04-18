import { useNavigate } from "react-router";
import type { Route } from "../+types/root";
import { useEffect } from "react";
import { dbPromise } from "~/db/db";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// invoking client side db here to create/initialize so it's ready for other routes
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const db = await dbPromise;
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/app/queue");
  }, []);
}
