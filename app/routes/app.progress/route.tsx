import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { List } from "~/components/list";
import { ListItem } from "~/components/list-item";
import { dbPromise } from "~/db/db";
import type { Route } from "./+types/route";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const db = await dbPromise;

  // Get all exercises
  const exercises = await db.exercises.find().exec();

  // Get all completed history entries
  const historyEntries = await db.history
    .find({
      selector: {
        completed: true,
        liftedWeight: { $exists: true },
      },
    })
    .exec();

  // Get all workouts to access their dates
  const workouts = await db.workouts.find().exec();
  const workoutMap = new Map<string, any>();
  workouts.forEach((workout) => {
    const workoutData = workout.toMutableJSON();
    workoutMap.set(workoutData.id, workoutData);
  });

  // Process history to find max weight per exercise
  const exerciseStats = new Map<
    string,
    {
      maxWeight: number;
      units: string;
      lastWorkoutDate: number;
    }
  >();

  for (const entry of historyEntries) {
    const historyData = entry.toMutableJSON();

    if (
      historyData.liftedWeight?.value !== undefined &&
      historyData.liftedWeight.value >= 0
    ) {
      const exerciseId = historyData.exerciseId;
      const currentWeight = historyData.liftedWeight.value;
      const currentUnits = historyData.liftedWeight.units;

      const workout = workoutMap.get(historyData.workoutId);
      const workoutDate = workout?.startedAt || 0;

      const existing = exerciseStats.get(exerciseId);

      if (!existing || currentWeight > existing.maxWeight) {
        exerciseStats.set(exerciseId, {
          maxWeight: currentWeight,
          units: currentUnits,
          lastWorkoutDate: workoutDate,
        });
      }
    }
  }

  // Build final result with exercises that have been performed
  const exerciseResults = exercises
    .map((exercise) => {
      const exerciseData = exercise.toMutableJSON();
      const stats = exerciseStats.get(exerciseData.id);

      if (stats) {
        return {
          exercise: exerciseData,
          maxWeight: stats.maxWeight,
          units: stats.units,
          lastWorkoutDate: stats.lastWorkoutDate,
        };
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.lastWorkoutDate - a.lastWorkoutDate);

  return {
    exerciseResults,
  };
}

export default function Progress({ loaderData }: Route.ComponentProps) {
  const { exerciseResults } = loaderData;

  const handleExercisePress = (exerciseId: string, exerciseName: string) => {
    console.log(`Pressed exercise: ${exerciseName} (ID: ${exerciseId})`);
  };

  return (
    <Page>
      <Header title="Progress" />
      <MainContent>
        {exerciseResults.length === 0 ? (
          <div className="p-4 text-center text-on-surface-variant">
            No exercise data available yet. Complete some workouts to see your
            progress!
          </div>
        ) : (
          <List>
            {exerciseResults.map((result) => (
              <ListItem
                key={result.exercise.id}
                title={result.exercise.name}
                content={`${result.maxWeight} ${result.units}`}
                onClick={() =>
                  handleExercisePress(result.exercise.id, result.exercise.name)
                }
              />
            ))}
          </List>
        )}
      </MainContent>
    </Page>
  );
}
