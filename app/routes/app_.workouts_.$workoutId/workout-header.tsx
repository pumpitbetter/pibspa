import { EllipsisVertical } from "lucide-react";
import { Header } from "~/components/header";
import { LinkBack } from "~/components/link-back";
import { useElapsedTime } from "~/lib/hooks";

export function WorkoutHeader({
  to,
  title,
  startedAt,
  finishedAt,
}: {
  to: string;
  title: string;
  startedAt: number;
  finishedAt?: number | null;
}) {
  const { elapsedMinutes } = useElapsedTime(startedAt);
  const length = finishedAt
    ? Math.round((finishedAt - startedAt) / 60000)
    : elapsedMinutes;
  return (
    <Header
      left={<LinkBack to={to} />}
      title={title}
      right={
        <div className="flex justify-end gap-4">
          <div>{length} mins</div>
          <div>
            <EllipsisVertical />
          </div>
        </div>
      }
    />
  );
}
