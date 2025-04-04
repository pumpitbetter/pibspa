import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";

export function LinkBack({ to }: { to: string }) {
  return (
    <Link to={to} className="text-primary">
      <ChevronLeft className="mr-4" />
    </Link>
  );
}
