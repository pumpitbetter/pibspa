import type { ProgramsDocType } from "./programs";

export const five31Trident: ProgramsDocType = {
  id: "531-trident",
  name: "5/3/1 - Trident",
  ownerId: "system",
  description:
    "An intermediate strength program with progression increasing weight of compound lifts every 4 week cycle.  One big lift plus two complementary accessory lifts per session",
  type: "strength",
  level: "intermediate",
  exercises: [
    {
      exerciseId: "barbell-overhead-press",
      exerciseWeight: {
        value: 65,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-deadlift",
      exerciseWeight: {
        value: 135,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-bench-press",
      exerciseWeight: {
        value: 135,
        units: "lbs",
      },
    },
    {
      exerciseId: "dumbbell-bench-press",
      exerciseWeight: {
        value: 135,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-squat",
      exerciseWeight: {
        value: 135,
        units: "lbs",
      },
    },
    {
      exerciseId: "leg-press",
      exerciseWeight: {
        value: 135,
        units: "lbs",
      },
    },
    {
      exerciseId: "dumbbell-row-one-arm",
      exerciseWeight: {
        value: 40,
        units: "lbs",
      },
    },
    {
      exerciseId: "leg-curl",
      exerciseWeight: {
        value: 60,
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
  ],
};
