import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ExercisesDocType } from "~/db/exercises";
import type { RoutinesDocument } from "~/db/routines";
import type { SetsDocType } from "~/db/sets";
import type { TemplatesDocType } from "~/db/templates";
import type { WorkoutsDocType } from "~/db/workout";
import { v7 as uuidv7 } from "uuid";
import type { ProgramsDocType } from "~/db/programs";

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
}: {
  routines: RoutinesDocument[];
  count: number;
}): WorkoutsDocType[] {
  if (!routines?.length) {
    return [];
  }

  const queue = [];

  // iterate from 0 to count going through the routines from beginning to end in round robin fashion adding each routine id to the queue
  for (let i = 0; i < count; ) {
    for (let j = 0; j < routines.length && i < count; j++, i++) {
      const routine = routines[j];
      const routineId = routine.id;
      queue.push({ ...routine.toMutableJSON(), routineId, id: uuidv7() });
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
}: {
  programExercises: ProgramExercise[];
  exerciseId: string;
  load: number;
  units: "kg" | "lbs";
  increment: number;
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
      ? Math.round(
          (programExercise.exerciseWeight.value + increment) / increment
        ) * increment
      : Math.round((load * programExercise.exerciseWeight.value) / increment) *
        increment;

  return {
    value: weightValue,
    units,
  };
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
