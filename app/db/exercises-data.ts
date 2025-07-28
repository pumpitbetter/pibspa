import type { ExercisesDocType } from "./exercises";
import { barbellExercises } from "./exercises-barbell";
import { dumbbellExercises } from "./exercises-dumbbell";
import { cableExercises } from "./exercises-cable";
import { machineExercises } from "./exercises-machine";
import { bodyweightExercises } from "./exercises-bodyweight";
import { bandExercises } from "./exercises-band";
import { kettlebellExercises } from "./exercises-kettlebell";
import { medicineballExercises } from "./exercises-medicineball";
import { plyometricExercises } from "./exercises-plyometric";
import { isometricExercises } from "./exercises-isometric";
import { cardioEquipmentExercises } from "./exercises-cardio-equipment";
import { functionalExercises } from "./exercises-functional";
import { otherExercises } from "./exercises-other";

export const exercisesData: ExercisesDocType[] = [
  ...barbellExercises,
  ...dumbbellExercises,
  ...cableExercises,
  ...machineExercises,
  ...bodyweightExercises,
  ...bandExercises,
  ...kettlebellExercises,
  ...medicineballExercises,
  ...plyometricExercises,
  ...isometricExercises,
  ...cardioEquipmentExercises,
  ...functionalExercises,
  ...otherExercises,
];
