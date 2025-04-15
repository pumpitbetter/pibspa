import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DialogEditSet } from "./dialog-edit-set";
import { Link, useFetcher, useLoaderData } from "react-router";
import { Checkbox } from "~/components/ui/checkbox";
import type { HistoryDocType } from "~/db/history";
import { calculatePlates, exerciseUsesPlates } from "~/lib/utils";
import type { clientLoader } from "./route";
import type { ExercisesDocType } from "~/db/exercises";

export function ExerciseCard({
  workoutId,
  exercise,
  sets,
  weightUnit,
}: {
  workoutId: string;
  exercise: ExercisesDocType;
  sets: Array<HistoryDocType>;
  weightUnit: string;
}) {
  const fetcher = useFetcher();
  const { settings } = useLoaderData<typeof clientLoader>();

  // given a count and value of plates, return an array of numbers
  const availablePlates: Array<number> = (
    settings?.plates?.map((plate) =>
      Array(Math.trunc(plate.count / 2)).fill(plate.weight)
    ) || []
  )
    .flat()
    .sort((a, b) => b - a);

  const searchParams = new URLSearchParams({
    back: "/app/workouts/" + workoutId,
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
      <CardHeader>
        <CardTitle>{exercise.name ?? "Unknown exercise"}</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        {sets.map((item) => (
          <div key={item.id} className="w-full">
            <div className="flex items-center px-4">
              <Checkbox
                className="w-7 h-7"
                checked={item.completed}
                onCheckedChange={async (checked) => {
                  await fetcher.submit(
                    {
                      intent: "complete",
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
              {exerciseUsesPlates({ exercise }) && (
                <Link
                  to={"/app/settings/plates?" + searchParams.toString()}
                  className="text-xs text-muted-foreground"
                >
                  {calcPlates(item.liftedWeight?.value || 0)}
                </Link>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
