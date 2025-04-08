import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { db } from "~/db/db";
import { defaultProgram } from "~/db/programs";
import type { Route } from "./+types/route";

import {
  generateWorkoutsFromRoutines,
  getExerciseById,
  groupCircuitsIntoSets,
  groupIntoCircuits,
  getProgramExerciseWeight,
  progressProgramExercise,
} from "~/lib/utils";
import { List } from "~/components/List";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { SetsDocType } from "~/db/sets";

export async function clientLoader() {
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

  const exercises = await db.exercises.find().exec();

  const count = 9; // Number of routines to generate in the queue

  const workouts = generateWorkoutsFromRoutines({ routines, count });

  // create a mutable copy of program exercises that can be progressed
  const p = program?.toMutableJSON();
  let programExercises = p?.exercises ? [...p.exercises] : [];

  // group workouts into sets
  const groupedWorkouts = workouts.map((workout) => {
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

        set.weight = getProgramExerciseWeight({
          programExercises,
          exerciseId,
          load: set.load,
          units: settings?.weigthUnit ?? "lbs",
          increment: setWithProgression?.progression?.increment?.value ?? 5, // TODO: fix this, it should be coming from program exercises progressions
        });
      });
    });
  });

  return {
    program: program ? program.toMutableJSON() : defaultProgram,
    routines: routines ? routines.map((w) => w.toMutableJSON()) : [],
    exercises: exercises ? exercises.map((e) => e.toMutableJSON()) : [],
    workouts: groupedWorkouts,
  };
}

export default function Queue({ loaderData }: Route.ComponentProps) {
  const { program, routines, exercises, workouts } = loaderData;

  return (
    <Page>
      <Header title={program.name} />
      <MainContent>
        <List>
          {workouts.map((item) => (
            <li key={item.workout.id} className="w-full p-4">
              <Card>
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
                          {set[1]
                            .map(
                              (item) =>
                                `${item.reps}x${item.weight?.value}${item.weight?.units}`
                            )
                            .join(", ")}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </li>
          ))}
        </List>
      </MainContent>
    </Page>
  );
}
