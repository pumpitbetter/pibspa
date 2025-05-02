import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DialogEditSet } from "./dialog-edit-set";
import { Link, useFetcher, useLoaderData } from "react-router";
import { Checkbox } from "~/components/ui/checkbox";
import type { HistoryDocType, HistoryDocument } from "~/db/history";
import {
  calculatePlates,
  cn,
  exerciseUsesPlates,
  getAvailablePlateCounts,
} from "~/lib/utils";
import type { clientLoader } from "./route";
import type { ExercisesDocType } from "~/db/exercises";

export function ExerciseCard({
  workoutId,
  exercise,
  sets,
  weightUnit,
  activeItem,
  setActiveItemId,
}: {
  workoutId: string;
  exercise: ExercisesDocType;
  sets: Array<HistoryDocType>;
  weightUnit: string;
  activeItem: HistoryDocType | null | undefined;
  setActiveItemId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const fetcher = useFetcher();
  const { settings } = useLoaderData<typeof clientLoader>();

  const searchParams = new URLSearchParams({
    back: "/app/workouts/" + workoutId,
  });

  const availablePlates = getAvailablePlateCounts({
    plates: settings?.plates ?? [],
  });

  const calcPlates = (targetWeight: number) => {
    const barbellWeight = settings?.barbellWeight ?? 0;
    const plates = calculatePlates({
      targetWeight,
      barbellWeight,
      availablePlates,
    });

    // if plates is a string, return it
    if (typeof plates === "string") {
      if (plates === "add plates...") {
        return (
          <Link
            to={"/app/settings/plates?" + searchParams.toString()}
            className="text-on-tertiary-container"
          >
            {" add plates..."}
          </Link>
        );
      } else {
        return plates;
      }
    }

    if (plates.length === 0) {
      return <span>= empty bar</span>;
    }
    // convert to string

    const platesString = "= " + plates.join(", ");
    return platesString;
  };

  return (
    <Card>
      <CardHeader className="my-0">
        <CardTitle>{exercise.name ?? "Unknown exercise"}</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        {sets.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "w-full border-4 rounded-lg",
              activeItem?.id === item.id
                ? "border-tetriary"
                : "border-transparent"
            )}
          >
            <div
              className="flex items-center px-3 gap-4"
              onClick={() => {
                setActiveItemId(item.id);
              }}
            >
              <Checkbox
                className={cn("w-7 h-7")}
                checked={item.completed}
                onCheckedChange={async (checked) => {
                  await fetcher.submit(
                    {
                      intent: "completeWorkout",
                      setId: item.id,
                      completed: checked ? "true" : "false",
                    },
                    { method: "post" }
                  );
                }}
              />
              <DialogEditSet
                key={item.id}
                setId={item.id}
                reps={item.liftedReps ?? 0}
                weight={item.liftedWeight?.value ?? 0}
              >
                <span className="px-2 py-4">
                  {item.liftedReps} x {item.liftedWeight?.value} {weightUnit}
                </span>
              </DialogEditSet>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
