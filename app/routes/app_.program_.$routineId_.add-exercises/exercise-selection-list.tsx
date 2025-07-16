import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import type { ExercisesDocType } from "~/db/exercises";

interface ExerciseSelectionListProps {
  exercises: ExercisesDocType[];
  selectedExercises: string[];
  onExerciseToggle: (exerciseId: string) => void;
}

export function ExerciseSelectionList({
  exercises,
  selectedExercises,
  onExerciseToggle,
}: ExerciseSelectionListProps) {
  const getEquipmentIcon = (equipment: string) => {
    const icons: Record<string, string> = {
      barbell: "🏋️",
      dumbbell: "🥊",
      bodyweight: "💪",
      machine: "⚙️",
      kettlebell: "🔔",
      band: "🎗️",
      squatrack: "🏗️",
      flatbench: "🪑",
      inclinebench: "📐",
      pullupbar: "🚧",
      dipbar: "🤸",
    };
    return icons[equipment] || "🏃";
  };

  const formatTrackingTypes = (track: string[]) => {
    return track
      .map((t) => {
        switch (t) {
          case "weight":
            return "Weight";
          case "time":
            return "Time";
          case "distance":
            return "Distance";
          default:
            return t;
        }
      })
      .join(", ");
  };

  if (exercises.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No exercises found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => {
        const isSelected = selectedExercises.includes(exercise.id);

        return (
          <Card
            key={exercise.id}
            className={`cursor-pointer transition-colors ${
              isSelected ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
            }`}
            onClick={() => onExerciseToggle(exercise.id)}
          >
            <CardContent className="px-2 py-1">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isSelected}
                  onChange={() => onExerciseToggle(exercise.id)}
                  className="mt-1"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{exercise.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {exercise.type}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-muted-foreground">
                        Equipment:
                      </span>
                      {exercise.equipment.slice(0, 3).map((eq) => (
                        <div
                          key={eq}
                          className="text-xs bg-muted rounded-full px-2 py-1 capitalize"
                        >
                          {eq}
                        </div>
                      ))}
                      {exercise.equipment.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{exercise.equipment.length - 3} more
                        </div>
                      )}
                    </div>

                    {exercise.tags && exercise.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-muted-foreground">
                          Tags:
                        </span>
                        {exercise.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
