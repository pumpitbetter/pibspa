import type { ProgramsDocType } from "./programs";

export const fiveBy5: ProgramsDocType = {
  id: "5x5",
  name: "5x5 Linear Progression",
  ownerId: "system",
  description:
    "A beginner strength program that emphasizes rapid progression by increasing weight every workout through five sets of five reps of key compound lifts like squats, bench press, and deadlifts.",
  type: "strength",
  level: "beginner",
  exercises: [
    {
      exerciseId: "barbell-squat",
      exerciseWeight: {
        value: 45,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-bench-press",
      exerciseWeight: {
        value: 45,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-row",
      exerciseWeight: {
        value: 65,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-overhead-press",
      exerciseWeight: {
        value: 45,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-deadlift",
      exerciseWeight: {
        value: 95,
        units: "lbs",
      },
    },
  ],
};
