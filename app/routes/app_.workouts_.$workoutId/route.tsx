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
import { DialogAlertDelete } from "./dialog-alert-delete";

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

type Intent = "completeWorkout" | "editWorkout" | "deleteWorkout";
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as Intent;

  switch (intent) {
    case "completeWorkout": {
      await completeWorkout(formData);
      break;
    }
    case "editWorkout": {
      await editWorkout(formData);
      break;
    }
    case "deleteWorkout": {
      await deleteWorkout(formData);
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
          <DialogAlertDelete workoutId={workout.id}>
            <Button variant={"ghost"} className="text-primary">
              Delete
            </Button>
          </DialogAlertDelete>
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

async function completeWorkout(formData: FormData) {
  const completed = formData.get("completed") === "true";
  const setId = formData.get("setId") as string;

  const db = await dbPromise;
  const history = await db.history.findOne({ selector: { id: setId } }).exec();
  invariant(history, "history not found");

  await history.update({
    $set: {
      completed,
    },
  });
}

async function editWorkout(formData: FormData) {
  const setId = formData.get("setId") as string;
  const reps = Number(formData.get("reps") as string);
  const weight = Number(formData.get("weight") as string);

  const db = await dbPromise;
  const history = await db.history.findOne({ selector: { id: setId } }).exec();
  invariant(history, "history not found");

  await history.update({
    $set: {
      liftedReps: reps,
      liftedWeight: {
        value: weight,
        units: history.liftedWeight?.units,
      },
    },
  });
}

async function deleteWorkout(formData: FormData) {
  const workoutId = formData.get("workoutId") as string;

  const db = await dbPromise;

  const workout = await db.workouts
    .findOne({ selector: { id: workoutId } })
    .exec();
  invariant(workout, "workout not found");
  const updatedWorkout = await workout.update({
    $set: {
      finishedAt: new Date().valueOf(),
    },
  });
  await updatedWorkout.remove();

  // make sure it's gone
  const settings = await db.settings.findOne().exec();
  const w = await db.workouts
    .findOne({
      selector: {
        programId: settings?.programId,
        finishedAt: null,
      },
    })
    .exec();
  invariant(!w, "workout still found");

  const workoutHistory = await db.history
    .find({ selector: { workoutId } })
    .exec();
  await db.history.bulkRemove(workoutHistory);

  // await db.waitForLeadership();
  // await db.requestIdlePromise();
  // await db.workouts.awaitPersistence();
  // await db.workouts.promiseWait(1000);
}
