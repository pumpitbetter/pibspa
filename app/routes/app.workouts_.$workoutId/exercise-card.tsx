import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Circle } from "lucide-react";
import { DialogCompleteSet } from "./dialog-complete-set";

export function ExerciseCard({
  exerciseName,
  sets,
  weightUnit,
}: {
  exerciseName: string;
  sets: Array<{ id: string; reps: number; weight?: { value: number } }>;
  weightUnit: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{exerciseName}</CardTitle>
      </CardHeader>
      <CardContent>
        {sets.map((item) => (
          <DialogCompleteSet
            key={item.id}
            reps={item.reps}
            weight={item.weight?.value ?? 0}
          >
            <div className="w-full pb-4">
              <div className="flex items-center gap-4">
                <Circle />
                {item.reps} x {item.weight?.value} {weightUnit}
              </div>
            </div>
          </DialogCompleteSet>
        ))}
      </CardContent>
    </Card>
  );
}
