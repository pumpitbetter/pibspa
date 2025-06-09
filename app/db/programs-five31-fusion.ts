import type { ProgramsDocType } from "./programs";

export const five31Fusion: ProgramsDocType = {
  id: "531-fusion",
  name: "5/3/1 - Fusion",
  description:
    "A 4-day per week strength program blending 5/3/1 progression for multiple compound lifts per session with focused pulling assistance. Designed for strength and time efficiency.",
  type: "strength",
  level: "intermediate", // Or "advanced" depending on the intensity and volume perception
  exercises: [
    {
      exerciseId: "barbell-overhead-press", // Used in Day 1 & Day 3
      exerciseWeight: {
        value: 65,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-deadlift", // Used in Day 1
      exerciseWeight: {
        value: 135,
        units: "lbs",
      },
    },
    {
      exerciseId: "pullups", // Used in Day 1 & Day 4
      exerciseWeight: {
        value: 0, // Bodyweight, or add weight if applicable
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-bench-press", // Used in Day 2 & Day 4
      exerciseWeight: {
        value: 135,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-squat", // Used in Day 2 & Day 4
      exerciseWeight: {
        value: 135,
        units: "lbs",
      },
    },
    {
      exerciseId: "dumbbell-row-one-arm", // Used in Day 2
      exerciseWeight: {
        value: 40,
        units: "lbs",
      },
    },
    {
      exerciseId: "barbell-row", // Used in Day 3
      exerciseWeight: {
        value: 95, // Adjusted as it's a 5/3/1 lift in this program
        units: "lbs",
      },
    },
  ],
};
