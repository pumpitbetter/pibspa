import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ExercisesDocType } from "~/db/exercises";
import type { RoutinesDocument } from "~/db/routines";
import type { SetsDocType } from "~/db/sets";
import type { WorkoutsDocType } from "~/db/workout";
import { v7 as uuidv7 } from "uuid";
import type { SettingsDocType } from "~/db/settings";

export interface GroupedWorkout {
  workout: WorkoutsDocType;
  sets: Record<string, SetsDocType[]>;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function consoleLogFormData(formData: FormData) {
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
}
interface WithId {
  id: string;
}

export function getExerciseById<Type extends WithId>({
  exercises,
  exerciseId,
}: {
  exercises: Type[];
  exerciseId: string;
}): Type | null {
  const exercise = exercises.find((e) => e.id === exerciseId);
  if (!exercise) {
    return null;
  }
  return exercise;
}

export function groupSetsIntoWorkouts(
  array: SetsDocType[]
): Record<string, SetsDocType[]> {
  const groupedArray = array.reduce((acc, set) => {
    const workoutId = set.workoutId;
    if (!acc[workoutId]) {
      acc[workoutId] = [];
    }
    acc[workoutId].push(set);
    return acc;
  }, {} as Record<string, SetsDocType[]>);
  return groupedArray;
}

interface OrderedAndSequenced {
  order: number;
  sequence?: number;
}

export function groupIntoCircuits<Type extends OrderedAndSequenced>(
  array: Type[]
): Record<string, Type[]> {
  const groupedArray = array.reduce((acc, item) => {
    const order = item.order;
    if (!acc[order]) {
      acc[order] = [];
    }
    acc[order].push(item);
    acc[order].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
    return acc;
  }, {} as Record<string, Type[]>);
  return groupedArray;
}

interface WithExerciseId {
  exerciseId: string;
}

export function groupCircuitsIntoSets<Type extends WithExerciseId>(
  groupedTemplates: Record<string, Type[]>
): Record<string, Type[]> {
  return Object.entries(groupedTemplates).reduce((acc, [order, item]) => {
    item.forEach((template) => {
      const exerciseId = template.exerciseId;
      if (!acc[exerciseId]) {
        acc[exerciseId] = [];
      }
      acc[exerciseId].push(template);
    });
    return acc;
  }, {} as Record<string, Type[]>);
}

export function generateWorkoutsFromRoutines({
  routines,
  count,
  previousWorkout,
}: {
  routines: RoutinesDocument[];
  count: number;
  previousWorkout?: WorkoutsDocType;
}): WorkoutsDocType[] {
  if (!routines?.length) {
    return [];
  }

  const queue: WorkoutsDocType[] = [];
  let skip = Boolean(previousWorkout?.id);

  // iterate from 0 to count going through the routines from beginning to end in round robin fashion adding each routine id to the queue
  for (let i = 0; i < count; ) {
    for (let j = 0; j < routines.length && i < count; j++) {
      const routine = routines[j];
      const routineId = routine.id;
      if (skip && routineId !== previousWorkout?.routineId) {
        // keep skipping until we find a routine that is not the same as the previous workout
        continue;
      } else if (skip && routineId === previousWorkout?.routineId) {
        if (null === previousWorkout?.finishedAt) {
          // active workout (not finished, so show it in the queue))
          queue.push(previousWorkout);
          i++;
        }
        skip = false; // reset skip if we find a routine that is not the same as the previous workout
        continue;
      }

      queue.push({
        ...routine.toMutableJSON(),
        routineId,
        id: uuidv7(),
        startedAt: 0,
      });
      i++;
    }
  }

  return queue;
}

interface ProgramExercise {
  exerciseId: string;
  exerciseWeight: {
    value: number;
    units: "kg" | "lbs";
  };
  duration?: number | undefined;
  barWeight?:
    | {
        value: number;
        units: "kg" | "lbs";
      }
    | undefined;
}

export function getProgramExerciseWeight({
  programExercises,
  exerciseId,
  load,
  units,
  increment,
  barWeight,
}: {
  programExercises: ProgramExercise[];
  exerciseId: string;
  load: number;
  units: "kg" | "lbs";
  increment: number;
  barWeight?: number;
}) {
  if (!programExercises) {
    return { value: 0, units }; // Default weight if program or exercises are not defined
  }

  const programExercise = programExercises.find(
    (exercise) => exercise.exerciseId === exerciseId
  );

  if (!programExercise || !programExercise.exerciseWeight) {
    return { value: 0, units }; // Default weight if exercise or weight is not found
  }

  increment = increment || 5; // Default increment if not provided

  // don't ramp up with weight less then 5
  if (load < 1 && increment < 5) {
    increment = 5;
  }
  const weightValue =
    load > 1
      ? Math.max(
          Math.round(
            (programExercise.exerciseWeight.value + increment) / increment
          ) * increment,
          barWeight || 0
        )
      : Math.max(
          Math.round(
            (load * programExercise.exerciseWeight.value) / increment
          ) * increment,
          barWeight || 0
        );

  return {
    value: weightValue,
    units,
  };
}

export function exerciseUsesPlates({
  exercise,
}: {
  exercise: ExercisesDocType;
}): boolean {
  return exercise.equipment.some(
    (item) => item === "barbell" || item === "ezbar"
  );
}

export function getBarWeight({
  settings,
  exercise,
}: {
  settings: SettingsDocType;
  exercise: ExercisesDocType;
}) {
  const isBarbell = exercise.equipment.some((item) => item === "barbell");
  const isEzBar = exercise.equipment.some((item) => item === "ezbar");
  if (isBarbell) {
    return settings?.barbellWeight || 0;
  }
  if (isEzBar) {
    return settings?.ezbarWeight || 0;
  }
  return 0;
}

export function progressProgramExercise({
  programExercises,
  exerciseId,
  increment,
}: {
  programExercises: ProgramExercise[];
  exerciseId: string;
  increment: number;
}): ProgramExercise[] {
  const transformed = programExercises.map((exercise) => {
    if (exercise.exerciseId === exerciseId) {
      exercise.exerciseWeight.value += increment;
    }
    return exercise;
  });

  return transformed;
}

export function calculatePlates({
  targetWeight,
  barbellWeight = 45,
  availablePlates = [45, 35, 25, 10, 5, 2.5],
}: {
  targetWeight: number;
  barbellWeight: number;
  availablePlates: number[];
}): Array<number> | string {
  let remainingWeightPerSide = (targetWeight - barbellWeight) / 2;

  if (remainingWeightPerSide < 0) {
    return ""; // Target weight cannot be less than the barbell weight.
  }

  const platesToLoad: Record<number, number> = {};

  for (const plate of availablePlates) {
    if (remainingWeightPerSide >= plate) {
      platesToLoad[plate] = (platesToLoad[plate] || 0) + 1;
      remainingWeightPerSide -= plate;
    }
  }

  if (remainingWeightPerSide > 0) {
    return "add plates..."; // Not enough plates to reach the target weight.
  }

  // conver to array of numbers in descending order
  const platesArray: Array<number> = Object.entries(platesToLoad)
    .map(([key, value]) => {
      return Array(value).fill(Number(key));
    })
    .flat()
    .sort((a, b) => b - a);

  return platesArray;
}

export function getAvailablePlateCounts({
  plates,
}: {
  plates: { count: number; weight: number }[];
}): number[] {
  return (
    plates.map((plate) =>
      Array(Math.trunc(plate.count / 2)).fill(plate.weight)
    ) || []
  )
    .flat()
    .sort((a, b) => b - a);
}
