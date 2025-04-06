import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ExercisesDocType } from "~/db/exercises";
import type { RoutinesDocument } from "~/db/routines";
import type { SetsDocType } from "~/db/sets";
import type { TemplatesDocType } from "~/db/templates";
import type { WorkoutsDocType } from "~/db/workout";
import { v7 as uuidv7 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function consoleLogFormData(formData: FormData) {
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
}

export function getExerciseById({
  exercises,
  exerciseId,
}: {
  exercises: ExercisesDocType[];
  exerciseId: string;
}): ExercisesDocType | null {
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

export function groupTemplatesIntoCircuits(
  array: TemplatesDocType[]
): Record<string, TemplatesDocType[]> {
  const groupedArray = array.reduce((acc, template) => {
    const order = template.order;
    if (!acc[order]) {
      acc[order] = [];
    }
    acc[order].push(template);
    acc[order].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
    return acc;
  }, {} as Record<string, TemplatesDocType[]>);
  return groupedArray;
}

export function groupCircuitsIntoSets(
  groupedTemplates: Record<string, TemplatesDocType[]>
): Record<string, TemplatesDocType[]> {
  return Object.entries(groupedTemplates).reduce((acc, [order, templates]) => {
    templates.forEach((template) => {
      const exerciseId = template.exerciseId;
      if (!acc[exerciseId]) {
        acc[exerciseId] = [];
      }
      acc[exerciseId].push(template);
    });
    return acc;
  }, {} as Record<string, TemplatesDocType[]>);
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
