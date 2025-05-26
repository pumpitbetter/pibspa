import invariant from "tiny-invariant";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { dbPromise } from "~/db/db";
import type { Route } from "./+types/route";
import {
  cn,
  getAvailablePlateCounts,
  getBarWeight,
  getExerciseById,
  groupCircuitsIntoSets,
  groupIntoCircuits,
} from "~/lib/utils";
import { defaultSettings } from "~/db/settings";
import { Button } from "~/components/ui/button";
import { ExerciseCard } from "./exercise-card";
import { useFetcher, useSearchParams } from "react-router";
import { DialogAlertDelete } from "./dialog-alert-delete";
import { DialogAlertFinish } from "./dialog-alert-finish";
import { DialogSummary } from "./dialog-summary";
import { ACTIVE_INFO_PANE_HEIGHT, ActiveInfoPane } from "./active-info-pane";
import { WorkoutHeader } from "./workout-header";
import { useActiveItem } from "./use-active-item-hook";
import { useRestTime } from "~/lib/hooks";

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

type Intent = "completeSet" | "editWorkout" | "deleteWorkout" | "finishWorkout";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as Intent;

  switch (intent) {
    case "completeSet": {
      await completeSet(formData);
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
    case "finishWorkout": {
      await finishWorkout(formData);
      break;
    }
  }

  return;
}

export default function Workout({ loaderData }: Route.ComponentProps) {
  const { groupedWorkout, exercises, settings } = loaderData;
  const { workout, sets } = groupedWorkout;
  const [searchParams] = useSearchParams();
  const { elapsedRestTime, stopRest } = useRestTime();

  const { activeItemId, setActiveItemId, setNextActiveItemId } = useActiveItem(
    sets,
    Object.values(sets).flat()[0]?.id ?? null
  );

  const activeItem = Object.values(sets)
    .find((exerciseSets) => exerciseSets.some((set) => set.id === activeItemId))
    ?.find((set) => set.id === activeItemId)
    ?.toMutableJSON();

  const activeExercise = activeItem
    ? getExerciseById({
        exercises,
        exerciseId: activeItem.exerciseId,
      })
    : null;

  const activeExerciseBarWeight = activeExercise
    ? getBarWeight({
        settings,
        exercise: activeExercise,
      })
    : null;

  const availablePlates = activeExerciseBarWeight
    ? getAvailablePlateCounts({
        plates: settings?.plates ?? [],
      })
    : [];

  const fetcher = useFetcher();

  // are all exercises completed?
  const allCompleted = Object.values(sets).every((exerciseSets) =>
    exerciseSets.every((set) => set.completed)
  );

  return (
    <Page>
      <WorkoutHeader
        to={searchParams.get("back") ?? "/app/queue"}
        title={workout.name}
        startedAt={workout.startedAt}
        finishedAt={workout.finishedAt}
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
                exercise={exercise}
                sets={exerciseSets}
                weightUnit={settings.weigthUnit}
                activeItem={activeItem}
                setActiveItemId={setActiveItemId}
                setNextActiveItemId={setNextActiveItemId}
                workoutFinished={!!workout.finishedAt}
              />
            </li>
          );
        })}
        <div className="flex justify-end gap-4 px-4 pb-4">
          <DialogAlertDelete
            workoutId={workout.id}
            setActiveItemId={setActiveItemId}
          >
            <Button variant={"ghost"} className="text-primary">
              Delete
            </Button>
          </DialogAlertDelete>
          {!allCompleted && !workout.finishedAt && (
            <DialogAlertFinish
              workoutId={workout.id}
              setActiveItemId={setActiveItemId}
            >
              <Button>Finish</Button>
            </DialogAlertFinish>
          )}
          {allCompleted && (
            <DialogSummary workoutId={workout.id}>
              <Button
                onClick={async () => {
                  setActiveItemId(null);
                  stopRest();
                  await fetcher.submit(
                    {
                      intent: "finishWorkout",
                      workoutId: workout.id,
                    },
                    { method: "post" }
                  );
                }}
              >
                Finish
              </Button>
            </DialogSummary>
          )}
        </div>
        {activeItem !== null &&
          activeItem !== undefined &&
          ((activeExerciseBarWeight !== null &&
            activeExerciseBarWeight !== 0) ||
            elapsedRestTime != 0) && (
            <div>
              <div className={ACTIVE_INFO_PANE_HEIGHT}></div>
              <div
                className={cn("fixed bottom-0 w-full", ACTIVE_INFO_PANE_HEIGHT)}
              >
                <ActiveInfoPane
                  item={activeItem}
                  barWeight={activeExerciseBarWeight || 0}
                  weight={activeItem.liftedWeight?.value ?? 0}
                  availablePlates={availablePlates}
                />
              </div>
            </div>
          )}
      </MainContent>
    </Page>
  );
}

async function completeSet(formData: FormData) {
  const completed = formData.get("completed") === "true";
  const setId = formData.get("setId") as string;

  const db = await dbPromise;
  const history = await db.history.findOne({ selector: { id: setId } }).exec();
  invariant(history, "history not found");

  const template = await db.templates
    .findOne({
      selector: {
        id: history.templateId,
      },
    })
    .exec();
  invariant(template, "template not found");

  // and user is completing with target reps and weight achived
  // and the template indicates to progress
  // progress the weight
  if (
    template.progression?.increment?.value &&
    history.liftedReps &&
    history.liftedReps >= history.targetReps &&
    history.liftedWeight &&
    history.liftedWeight.value >= history.targetWeight?.value
  ) {
    const program = await db.programs
      .findOne({ selector: { id: history.programId } })
      .exec();
    invariant(program, "program not found");

    const programExercise = program.exercises?.find(
      (exercise) => exercise.exerciseId === history.exerciseId
    );
    invariant(programExercise, "program exercise not found");

    await program.modify((doc) => {
      invariant(doc.exercises, "Program has no exercises");
      const exercises = doc.exercises.map((item) => {
        if (item.exerciseId === history.exerciseId) {
          return {
            ...item,
            exerciseWeight: {
              value:
                programExercise.exerciseWeight?.value +
                (template.progression?.increment?.value || 0) *
                  (completed && history.completed === false ? 1 : -1),
              units: programExercise.exerciseWeight?.units,
            },
          };
        }
        return item;
      });
      doc.exercises = exercises;
      return doc;
    });
  }

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
}

async function finishWorkout(formData: FormData) {
  const workoutId = formData.get("workoutId") as string;

  const db = await dbPromise;

  // find the workout
  const workout = await db.workouts
    .findOne({ selector: { id: workoutId } })
    .exec();
  invariant(workout, "workout not found");

  // find all history items for this workout
  const history = await db.history.find({ selector: { workoutId } }).exec();
  invariant(history, "history not found");

  const updatedWorkout = await workout.update({
    $set: {
      finishedAt: new Date().valueOf(),
    },
  });

  // make sure it's gone when quering unfinished workouts
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
}
