import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DialogEditSet } from "./dialog-edit-set";
import { useFetcher, useLoaderData } from "react-router";
import { Checkbox } from "~/components/ui/checkbox";
import type { HistoryDocType } from "~/db/history";
import { cn } from "~/lib/utils";
import type { clientLoader } from "./route";
import type { ExercisesDocType } from "~/db/exercises";
import { useRestTime } from "~/lib/hooks";

export function ExerciseCard({
  exercise,
  sets,
  weightUnit,
  activeItem,
  setActiveItemId,
  setNextActiveItemId,
}: {
  exercise: ExercisesDocType;
  sets: Array<HistoryDocType>;
  weightUnit: string;
  activeItem: HistoryDocType | null | undefined;
  setActiveItemId: (value: string | null) => void;
  setNextActiveItemId: (after: string) => void;
}) {
  const fetcher = useFetcher();
  const { startRest, stopRest } = useRestTime();

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
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onCheckedChange={async (checked) => {
                  if (checked) {
                    setNextActiveItemId(item.id);
                    startRest();
                  } else {
                    setActiveItemId(item.id);
                    stopRest();
                  }

                  await fetcher.submit(
                    {
                      intent: "completeSet",
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
