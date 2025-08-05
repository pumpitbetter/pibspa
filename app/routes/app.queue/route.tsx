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
  cn,
  type GroupedWorkout,
} from "~/lib/utils";
import { 
  enhanceTemplatesWithProgression,
  calculateExerciseProgressionIndices,
  getCurrentExerciseWeight,
  processWorkoutProgression,
  type WeightCalculation 
} from "~/lib/queue-integration";
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
  invariant(settings, "Settings not found.");
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

  // Enhance templates with progression-calculated weights
  const templateDocs = templates.map(t => t.toMutableJSON());

  // Calculate exercise-specific progression indices for all workouts
  const exerciseProgressionIndices = calculateExerciseProgressionIndices(workouts, templateDocs);

  // group workouts into sets using enhanced templates
  const groupedWorkouts: GroupedWorkout[] = await Promise.all(
    workouts.map(async (workout, workoutIndex) => {
      // Get exercise-specific progression indices for this workout
      const workoutExerciseIndices = exerciseProgressionIndices[workoutIndex] || new Map();
      
      // Enhance templates for this specific workout with the appropriate indices
      const enhancedTemplates = await enhanceTemplatesWithProgression(db, templateDocs, workoutIndex, workoutExerciseIndices);
      
      const workoutTemplates = enhancedTemplates.filter((template) => {
        return template.routineId === workout.routineId;
      })
      .sort((a, b) => {
        return a.order - b.order;
      });

      const sets: SetsDocType[] = workoutTemplates
        .map((template) => ({
          id: template.id,
          programId: template.programId,
          routineId: template.routineId,
          exerciseId: template.exerciseId,
          order: template.order,
          sequence: template.sequence,
          load: template.load || 0,
          workoutId: workout.id,
          weight: { 
            value: template.calculatedWeight.weight, 
            units: template.calculatedWeight.units as "kg" | "lbs"
          },
          reps: template.calculatedWeight.reps || template.repRange?.min || template.repRange?.max || 5, // Use calculated reps, fallback to template range
          amrep: template.amrep || false,
          restTime: template.restTime,
        }));

      const groupedSets = groupCircuitsIntoSets<SetsDocType>(
        groupIntoCircuits<SetsDocType>(sets)
      );

      return { workout, sets: groupedSets };
    })
  );

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
        amrep: set.amrep ?? false,
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
