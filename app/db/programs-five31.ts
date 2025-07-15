import type { ProgramsDocType } from "./programs";

export const five31: ProgramsDocType = {
  id: "531",
  name: "5/3/1",
  ownerId: "system",
  description:
    "An intermediate strength program with progression increasing weight of compound lifts every 4 week cycle.",
  type: "strength",
  level: "intermediate",
  exercises: [
    {
      exerciseId: "barbell-squat",
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
      exerciseId: "barbell-deadlift",
      exerciseWeight: {
        value: 135,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-overhead-press",
      exerciseWeight: {
        value: 65,
        units: "lbs",
      },
    },
  ],
};
