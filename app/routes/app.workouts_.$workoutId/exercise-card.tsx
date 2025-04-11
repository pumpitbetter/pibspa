import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DialogEditSet } from "./dialog-edit-set";
import { useFetcher } from "react-router";
import { Checkbox } from "~/components/ui/checkbox";
import type { HistoryDocType } from "~/db/history";

export function ExerciseCard({
  workoutId,
  exerciseName,
  sets,
  weightUnit,
}: {
  workoutId: string;
  exerciseName: string;
  sets: Array<HistoryDocType>;
  weightUnit: string;
}) {
  const fetcher = useFetcher();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{exerciseName}</CardTitle>
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
                <span className="p-4">
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
