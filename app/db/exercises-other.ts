import type { ExercisesDocType } from "./exercises";

export const otherExercises: ExercisesDocType[] = [
  {
    id: "dips",
    name: "Dips",
    type: "strength",
    track: ["weight"],
    equipment: ["dipbar"],
    tags: ["compound"],
  },
  {
    id: "pullups",
    name: "Pullups",
    type: "strength",
    track: ["weight"],
    equipment: ["pullupbar"],
    tags: ["compound"],
  },
  {
    id: "hanging-knee-raise",
    name: "Hanging Knee Raise",
    type: "strength",
    track: ["weight"],
    equipment: ["pullupbar"],
    tags: ["compound"],
  },
  {
    id: "ezbar-skullcrusher",
    name: "EZ-Bar Skullcrusher",
    type: "strength",
    track: ["weight"],
    equipment: ["ezbar"],
    tags: ["isolation"],
  },
];
