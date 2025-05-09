import type { ProgramsDocType } from "./programs";

export const madcow: ProgramsDocType = {
  id: "madcow",
  name: "Madcow 5x5",
  description:
    "An intermediate strength program with weekly progression increasing weight of compound lifts like squats, bench press, and deadlifts.",
  type: "strength",
  level: "intermediate",
  exercises: [
    {
      exerciseId: "barbell-squat",
      exerciseWeight: {
        value: 75,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-bench-press",
      exerciseWeight: {
        value: 75,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-incline-bench-press",
      exerciseWeight: {
        value: 75,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-deadlift",
      exerciseWeight: {
        value: 75,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-row",
      exerciseWeight: {
        value: 75,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-curl",
      exerciseWeight: {
        value: 45,
        units: "lbs",
      },
    },
    {
      exerciseId: "ezbar-skullcrusher",
      exerciseWeight: {
        value: 45,
        units: "lbs",
      },
    },
    {
      exerciseId: "dips",
      exerciseWeight: {
        value: 0,
        units: "lbs",
      },
    },
    {
      exerciseId: "hanging-knee-raise",
      exerciseWeight: {
        value: 0,
        units: "lbs",
      },
    },
    {
      exerciseId: "pullups",
      exerciseWeight: {
        value: 0,
        units: "lbs",
      },
    },
    {
      exerciseId: "planks",
      exerciseWeight: {
        value: 0,
        units: "lbs",
      },
      duration: 30,
    },
  ],
};
