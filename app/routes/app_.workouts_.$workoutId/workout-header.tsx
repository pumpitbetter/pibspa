import { EllipsisVertical } from "lucide-react";
import { Header } from "~/components/header";
import { LinkBack } from "~/components/link-back";
import { useElapsedTime } from "~/lib/hooks";

export function WorkoutHeader({
  to,
  title,
  startedAt,
}: {
  to: string;
  title: string;
  startedAt: number;
}) {
  const { elapsedMinutes } = useElapsedTime(startedAt);
  return (
    <Header
      left={<LinkBack to={to} />}
      title={title}
      right={
        <div className="flex justify-end gap-4">
          <div>{elapsedMinutes} mins</div>
          <div>
            <EllipsisVertical />
          </div>
        </div>
      }
    />
  );
}
