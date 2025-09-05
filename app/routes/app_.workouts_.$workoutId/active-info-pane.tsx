import { Link } from "react-router";
import { BarWithPlates } from "~/components/bar-with-plates";
import type { HistoryDocType } from "~/db/history";
import { useRestTime } from "~/lib/hooks";
import { calculatePlates, cn } from "~/lib/utils";

export const ACTIVE_INFO_PANE_HEIGHT = "min-h-[80px]";

export function ActiveInfoPane({
  item,
  barWeight,
  weight,
  availablePlates,
}: {
  item: HistoryDocType;
  barWeight: number;
  weight: number;
  availablePlates: number[];
}) {
  const { elapsedRestTime } = useRestTime();
  const plates = barWeight
    ? calculatePlates({
        targetWeight: weight,
        barbellWeight: barWeight,
        availablePlates: availablePlates,
      })
    : null;

  const searchParams = new URLSearchParams({
    back: "/app/workouts/" + item.workoutId,
  });

  const addPlates =
    plates === "add plates..." ? (
      <Link
        to={"/app/settings/plates?" + searchParams.toString()}
        className="text-on-tertiary-container"
      >
        {" add plates..."}
      </Link>
    ) : null;

  const platesString =
    plates && typeof plates === "object"
      ? plates.map((plate) => plate).join(", ")
      : plates;

  return (
    <div
      className={cn(
        "flex gap-0 bg-surface-container-high",
        ACTIVE_INFO_PANE_HEIGHT
      )}
    >
      {(barWeight || elapsedRestTime) && (
        <BarWithPlates
          barWeight={barWeight}
          plates={plates}
          workoutId={item.workoutId}
        />
      )}
    </div>
  );
}
