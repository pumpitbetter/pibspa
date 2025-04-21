import invariant from "tiny-invariant";
import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { dbPromise } from "~/db/db";
import type { Route } from "./+types/route";
import {
  getExerciseById,
  groupCircuitsIntoSets,
  groupIntoCircuits,
} from "~/lib/utils";
import { defaultSettings } from "~/db/settings";
import { Button } from "~/components/ui/button";
import { ExerciseCard } from "./exercise-card";
import { LinkBack } from "~/components/LinkBack";
import { useSearchParams } from "react-router";
import { useElapsedTime } from "~/lib/hooks";
import { EllipsisVertical } from "lucide-react";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const db = await dbPromise;
  const workout = await db.workouts
    .findOne({
      selector: {
        id: params.workoutId,
      },
    })
    .exec();
  const exercises = await db.exercises.find().exec();
  const settings = await db.settings.findOne().exec();
  const history = await db.history
    .find({
      selector: {
        workoutId: params.workoutId,
      },
    })
    .exec();

  invariant(workout, "workout not found");

  const sets = groupCircuitsIntoSets(groupIntoCircuits(history));

  return {
    groupedWorkout: {
      workout: workout.toMutableJSON(),
      sets,
    },
    exercises: exercises ? exercises.map((e) => e.toMutableJSON()) : [],
    settings: settings ? settings.toMutableJSON() : defaultSettings,
  };
}

type Intent = "complete" | "edit";
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as Intent;
  const setId = formData.get("setId") as string;

  const db = await dbPromise;
  let history = await db.history.findOne({ selector: { id: setId } }).exec();
  invariant(history, "history not found");

  switch (intent) {
    case "complete": {
      const completed = formData.get("completed") === "true";
      await history.update({
        $set: {
          completed,
        },
      });
      break;
    }
    case "edit": {
      const reps = Number(formData.get("reps") as string);
      const weight = Number(formData.get("weight") as string);
      await history.update({
        $set: {
          liftedReps: reps,
          liftedWeight: {
            value: weight,
            units: history.liftedWeight?.units,
          },
        },
      });
      break;
    }
  }

  return;
}

export default function Workout({ loaderData }: Route.ComponentProps) {
  const { groupedWorkout, exercises, settings } = loaderData;
  const { workout, sets } = groupedWorkout;
  const [searchParams] = useSearchParams();
  const { elapsedMinutes } = useElapsedTime(groupedWorkout.workout.startedAt);

  return (
    <Page>
      <Header
        left={<LinkBack to={searchParams.get("back") ?? "/app/queue"} />}
        title={workout.name}
        right={
          <div className="flex justify-end gap-4">
            <div>{elapsedMinutes} mins</div>
            <div>
              <EllipsisVertical />
            </div>
          </div>
        }
      />
      <MainContent>
        {Object.entries(sets).map(([exerciseId, exerciseSets]) => {
          const exercise = getExerciseById({
            exercises,
            exerciseId,
          });

          if (!exercise) {
            return null;
          }

          return (
            <li key={exerciseId} className="list-none px-4 pb-4">
              <ExerciseCard
                workoutId={workout.id}
                exercise={exercise}
                sets={exerciseSets}
                weightUnit={settings.weigthUnit}
              />
            </li>
          );
        })}
        <div className="flex justify-end gap-4 px-4 pb-4">
          <Button
            variant={"ghost"}
            className="text-primary"
            onClick={() => {
              console.log("TODO: finish workout");
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              console.log("TODO: finish workout");
            }}
          >
            Finish
          </Button>
        </div>
      </MainContent>
    </Page>
  );
}
