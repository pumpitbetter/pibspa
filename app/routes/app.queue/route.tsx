import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { db } from "~/db/db";
import { defaultProgram } from "~/db/programs";
import type { RoutinesDocType, RoutinesDocument } from "~/db/routines";
import type { Route } from "./+types/route";

import {
  generateWorkoutsFromRoutines,
  getExerciseById,
  groupCircuitsIntoSets,
  groupSetsIntoWorkouts,
  groupTemplatesIntoCircuits,
} from "~/lib/utils";
import { List } from "~/components/List";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { SetsDocType } from "~/db/sets";
import type { WorkoutsDocType } from "~/db/workout";

type WorkoutDocType = RoutinesDocType;

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

  // generate queue of ordered templates for each routine in routineQueue
  const groupedWorkouts = workouts.map((workout) => {
    // TODO: calculate weights from load and max weight
    const sets = templates
      .filter((template) => {
        return template.routineId === workout.routineId;
      })
      .sort((a, b) => {
        return a.order - b.order;
      })
      .map((template) => template.toMutableJSON())
      .map((t) => ({ ...t, workoutId: workout.id }));

    const groupedSets = groupCircuitsIntoSets(groupTemplatesIntoCircuits(sets));

    return { workout, sets: groupedSets };
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
          {workouts.map((item, itemIdx) => (
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
                            .map((item) => `${item.reps}x${item.load * 100}%`)
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
