import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { dbPromise } from "~/db/db";
import { defaultProgram } from "~/db/programs";
import type { Route } from "./+types/route";

import {
  generateWorkoutsFromRoutines,
  getExerciseById,
  groupCircuitsIntoSets,
  groupIntoCircuits,
  getProgramExerciseWeight,
  progressProgramExercise,
  cn,
  type GroupedWorkout,
} from "~/lib/utils";
import { List } from "~/components/list";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { SetsDocType } from "~/db/sets";
import { defaultSettings } from "~/db/settings";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import invariant from "tiny-invariant";
import { v7 as uuidv7 } from "uuid";
import type { HistoryDocType } from "~/db/history";

export async function clientLoader() {
  const db = await dbPromise;
  const settings = await db.settings.findOne().exec();
  const program = await db.programs
    .findOne({
      selector: {
        id: settings?.programId,
      },
    })
    .exec();
  const routines = await db.routines
    .find({
      selector: {
        programId: settings?.programId,
      },
      sort: [{ order: "asc" }],
    })
    .exec();
  const templates = await db.templates
    .find({
      selector: {
        programId: settings?.programId,
      },
    })
    .exec();
  const activeWorkout = await db.workouts
    .findOne({
      selector: {
        programId: settings?.programId,
        finishedAt: null,
      },
    })
    .exec();
  const lastWorkout = await db.workouts
    .findOne({
      selector: {
        programId: settings?.programId,
        finishedAt: { $ne: null },
      },
      sort: [{ finishedAt: "desc" }],
    })
    .exec();

  const exercises = await db.exercises.find().exec();

  const count = 16; // Number of routines to generate in the queue

  const workouts = generateWorkoutsFromRoutines({
    routines,
    count,
    previousWorkout:
      activeWorkout?.toMutableJSON() || lastWorkout?.toMutableJSON(),
  }).filter((i) => i !== null);

  // create a mutable copy of program exercises that can be progressed
  const p = program?.toMutableJSON();
  let programExercises = p?.exercises ? [...p.exercises] : [];

  // group workouts into sets
  const groupedWorkouts: GroupedWorkout[] = workouts.map((workout) => {
    const sets: SetsDocType[] = templates
      .filter((template) => {
        return template.routineId === workout.routineId;
      })
      .sort((a, b) => {
        return a.order - b.order;
      })
      .map((template) => template.toMutableJSON())
      .map((t) => ({
        ...t,
        workoutId: workout.id,
        weight: { value: 0, units: settings?.weigthUnit ?? "lbs" },
      }));

    const groupedSets = groupCircuitsIntoSets<SetsDocType>(
      groupIntoCircuits<SetsDocType>(sets)
    );

    return { workout, sets: groupedSets };
  });

  // calculate progressions and weights
  groupedWorkouts.forEach((item, index) => {
    const { sets, workout } = item;

    Object.entries(sets).map((setInfo) => {
      const [exerciseId, sets] = setInfo;

      // do we have a set with progression?
      const setWithProgression = sets.find((set) => {
        return (
          set.progression?.increment?.value &&
          set.progression?.increment?.value > 0 &&
          set.progression?.increment?.frequency &&
          set.progression?.increment?.frequency > 0
        );
      });

      // progress if we have find N previous workouts with the same template and exerciseId where N is progression increment frequency
      if (setWithProgression) {
        const frequency =
          setWithProgression.progression?.increment?.frequency ?? 1;
        const increment = setWithProgression.progression?.increment?.value ?? 0;

        let previousSuccessfullRoutines = 0;
        for (let i = index - 1; i >= 0; i--) {
          const previousWorkout = groupedWorkouts[i];
          if (previousWorkout.workout.routineId !== workout.routineId) {
            // skip over workouts with different routineId
            continue;
          }

          // for now assume it was successfull
          previousSuccessfullRoutines++;
        }

        if (previousSuccessfullRoutines >= frequency) {
          // we have N previous workouts with the same template and exerciseId
          // progress the weight
          programExercises = progressProgramExercise({
            programExercises,
            exerciseId,
            increment,
          });
        }
      }

      // iterate over the sets and calculate the new weight from load
      sets.forEach((set) => {
        // clalculate the new weight
        const exercise = programExercises.find(
          (exercise) => exercise.exerciseId === exerciseId
        );

        set.weight = getProgramExerciseWeight({
          programExercises,
          exerciseId,
          load: set.load,
          units: settings?.weigthUnit ?? "lbs",
          increment: set?.progression?.increment?.value ?? 5,
          barWeight: settings?.barbellWeight ?? 0,
        });
      });
    });
  });

  return {
    program: program ? program.toMutableJSON() : defaultProgram,
    routines: routines ? routines.map((w) => w.toMutableJSON()) : [],
    exercises: exercises ? exercises.map((e) => e.toMutableJSON()) : [],
    workouts: groupedWorkouts,
    settings: settings ? settings.toMutableJSON() : defaultSettings,
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const groupedWorkout = JSON.parse(
    formData.get("groupedWorkout") as string
  ) as GroupedWorkout;
  invariant(groupedWorkout, "groupedWorkout is required");

  const db = await dbPromise;
  await db.workouts.upsert({
    id: groupedWorkout.workout.id,
    programId: groupedWorkout.workout.programId,
    name: groupedWorkout.workout.name,
    routineId: groupedWorkout.workout.routineId,
    startedAt: new Date().valueOf(),
    finishedAt: null,
  });

  const r = Object.entries(groupedWorkout.sets);
  for (const [exerciseId, sets] of r) {
    for (const set of sets) {
      const history: HistoryDocType = {
        id: uuidv7(),
        workoutId: groupedWorkout.workout.id,
        programId: groupedWorkout.workout.programId,
        routineId: groupedWorkout.workout.routineId ?? "",
        templateId: set.id,
        exerciseId,
        load: set.load ?? 0,
        order: set.order ?? 0,
        targetReps: set.reps ?? 5, // TODO: can this possibly ever be null?
        targetWeight: set.weight ?? { value: 0, units: "lbs" },
        liftedReps: set.reps ?? { value: 0, units: "lbs" },
        liftedWeight: set.weight ?? { value: 0, units: "lbs" },
        completed: false,
      };
      await db.history.upsert(history);
    }
  }

  return { groupedWorkout: groupedWorkout };
}

export default function Queue({ loaderData }: Route.ComponentProps) {
  const [workouts, setWorkouts] = useState<GroupedWorkout[]>(
    () => loaderData.workouts
  );
  const { program, routines, exercises, settings } = loaderData;
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetcher.submit(event.currentTarget);
    navigate(`/app/workouts/${workouts[0].workout.id}`);
  };

  return (
    <Page>
      <Header title={program.name} />
      <MainContent>
        <List>
          {workouts.map((item, itemIdx) => (
            <li key={item.workout.id} className="w-full p-4">
              <Card
                className={cn(
                  itemIdx === 0
                    ? item.workout.startedAt
                      ? "border-primary"
                      : "border-on-surface-container"
                    : ""
                )}
              >
                <CardHeader>
                  <CardTitle>{item.workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(item.sets).map((set) => {
                    return (
                      <div key={set[0]} className="w-full pb-3">
                        <div>
                          {getExerciseById({
                            exercises,
                            exerciseId: set[0],
                          })?.name ?? "Unknown Exercise"}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {`${set[1]
                            .map((item) => `${item.reps}x${item.weight?.value}`)
                            .join(", ")} (${settings.weigthUnit})`}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
                {itemIdx === 0 && (
                  <CardFooter>
                    <fetcher.Form
                      method="post"
                      onSubmit={handleSubmit}
                      className="w-full"
                    >
                      <input
                        type="hidden"
                        name="groupedWorkout"
                        value={JSON.stringify(item)}
                      />
                      {!item.workout.startedAt && (
                        <div className="flex justify-end gap-4">
                          <Button
                            variant="secondary"
                            className="w-24"
                            onClick={() => {
                              // slice the first item from the workouts array
                              setWorkouts((prev) => {
                                const workouts = [...prev];
                                workouts.shift();
                                return workouts;
                              });
                              // update the workouts in the state
                            }}
                          >
                            Skip
                          </Button>
                          <Button type="submit" className="w-24">
                            Start
                          </Button>
                        </div>
                      )}
                    </fetcher.Form>
                  </CardFooter>
                )}
              </Card>
            </li>
          ))}
        </List>
      </MainContent>
    </Page>
  );
}
