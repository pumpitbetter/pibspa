import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ExercisesDocType } from "~/db/exercises";

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
