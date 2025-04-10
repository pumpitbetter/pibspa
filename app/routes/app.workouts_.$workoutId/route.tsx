import invariant from "tiny-invariant";
import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { db } from "~/db/db";
import type { Route } from "./+types/route";
import { getExerciseById, type GroupedWorkout } from "~/lib/utils";
import { defaultSettings } from "~/db/settings";
import { Button } from "~/components/ui/button";
import { ExerciseCard } from "./exercise-card";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const workout = await db.workouts
    .findOne({
      selector: {
        id: params.workoutId,
      },
    })
    .exec();
  const exercises = await db.exercises.find().exec();
  const settings = await db.settings.findOne().exec();

  invariant(workout, "workout not found");
  const sets = JSON.parse(workout.sets || "");
  return {
    groupedWorkout: {
      workout: workout.toMutableJSON(),
      sets,
    } as GroupedWorkout,
    exercises: exercises ? exercises.map((e) => e.toMutableJSON()) : [],
    settings: settings ? settings.toMutableJSON() : defaultSettings,
  };
}

export default function Workout({ loaderData }: Route.ComponentProps) {
  const { groupedWorkout, exercises, settings } = loaderData;
  const { workout, sets } = groupedWorkout;

  console.log("workout", workout);
  console.log("sets", sets);

  return (
    <Page>
      <Header
        title={workout.name}
        right={
          <Button
            variant={"ghost"}
            className="text-primary"
            onClick={() => {
              console.log("TODO: finish workout");
            }}
          >
            Finish
          </Button>
        }
      />
      <MainContent>
        {Object.entries(sets).map(([exerciseId, exerciseSets]) => {
          const exerciseName =
            getExerciseById({
              exercises,
              exerciseId,
            })?.name ?? "Unknown Exercise";

          return (
            <li key={exerciseId} className="list-none px-4 pb-4">
              <ExerciseCard
                exerciseName={exerciseName}
                sets={exerciseSets}
                weightUnit={settings.weigthUnit}
              />
            </li>
          );
        })}
      </MainContent>
    </Page>
  );
}
