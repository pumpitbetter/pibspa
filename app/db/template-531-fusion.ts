import type { MyDatabase } from "./db";
import type { TemplatesDocType } from "./templates";

// Helper function to generate unique 22-character IDs
let idCounter = 0; // Initialize a counter

function generateId(): string {
  idCounter++; // Increment for each call
  const staticPrefix = "531fusion-"; // Static prefix for the program
  // Pad the counter to ensure a consistent length, though not strictly 22 chars anymore
  // This is more for predictability than matching the exact previous random format.
  // If a 22-char length is critical for other parts of your system,
  // you might need a more complex scheme or accept shorter, predictable IDs.
  const idString = idCounter.toString().padStart(10, "0"); // Example padding
  return `${staticPrefix}${idString}`.slice(0, 22); // Ensure it's not longer than 22
}

const programId = "531-fusion";

const fiveThreeOneWeeksParams = [
  // Week 1: 5s week
  {
    sets: [
      { load: 0.65, reps: 5 },
      { load: 0.75, reps: 5 },
      { load: 0.85, reps: 5, amrep: true },
    ],
  },
  // Week 2: 3s week
  {
    sets: [
      { load: 0.7, reps: 3 },
      { load: 0.8, reps: 3 },
      { load: 0.9, reps: 3, amrep: true },
    ],
  },
  // Week 3: 5/3/1 week (PR set)
  {
    sets: [
      { load: 0.75, reps: 5 },
      { load: 0.85, reps: 3 },
      { load: 0.95, reps: 1, amrep: true },
    ],
  },
  // Week 4: Deload week
  {
    sets: [
      { load: 0.4, reps: 5 },
      { load: 0.5, reps: 5 },
      { load: 0.6, reps: 5 },
    ],
  },
];

function getProgression(exerciseId: string) {
  let incrementValue = 0;
  if (exerciseId === "barbell-squat" || exerciseId === "barbell-deadlift") {
    incrementValue = 10;
  } else if (
    exerciseId === "barbell-overhead-press" ||
    exerciseId === "barbell-bench-press" ||
    exerciseId === "barbell-row"
  ) {
    incrementValue = 5;
  }
  if (incrementValue > 0) {
    return {
      increment: {
        value: incrementValue,
        kind: "weight" as "weight",
        type: "absolute" as "absolute",
        frequency: 1,
      },
    };
  }
  return undefined;
}

export async function init531FusionTemplates(db: MyDatabase) {
  const templates: Array<TemplatesDocType> = [];
  let routineCounter = 0;

  for (let weekIndex = 0; weekIndex < 4; weekIndex++) {
    const weekParams = fiveThreeOneWeeksParams[weekIndex];

    // Day 1 of the week in the cycle
    routineCounter++;
    const routineIdDay1 = `${programId}-${routineCounter}`;
    let orderDay1 = 0;
    // Shoulder Press (5/3/1)
    weekParams.sets.forEach((setParams, setIndex) => {
      templates.push({
        id: generateId(),
        programId,
        routineId: routineIdDay1,
        exerciseId: "barbell-overhead-press",
        order: ++orderDay1,
        load: setParams.load,
        reps: setParams.reps,
        amrep: setParams.amrep || false,
        progression:
          weekIndex === 2 && setIndex === weekParams.sets.length - 1
            ? getProgression("barbell-overhead-press")
            : undefined,
      });
    });
    // Deadlift (5/3/1)
    weekParams.sets.forEach((setParams, setIndex) => {
      templates.push({
        id: generateId(),
        programId,
        routineId: routineIdDay1,
        exerciseId: "barbell-deadlift",
        order: ++orderDay1,
        load: setParams.load,
        reps: setParams.reps,
        amrep: setParams.amrep || false,
        progression:
          weekIndex === 2 && setIndex === weekParams.sets.length - 1
            ? getProgression("barbell-deadlift")
            : undefined,
      });
    });
    // Pullups (5x10)
    for (let i = 0; i < 5; i++) {
      templates.push({
        id: generateId(),
        programId,
        routineId: routineIdDay1,
        exerciseId: "pullups",
        order: ++orderDay1,
        load: 1, // Indicates user-defined weight or bodyweight
        reps: 10,
      });
    }

    // Day 2 of the week in the cycle
    routineCounter++;
    const routineIdDay2 = `${programId}-${routineCounter}`;
    let orderDay2 = 0;
    // Bench Press (5/3/1)
    weekParams.sets.forEach((setParams, setIndex) => {
      templates.push({
        id: generateId(),
        programId,
        routineId: routineIdDay2,
        exerciseId: "barbell-bench-press",
        order: ++orderDay2,
        load: setParams.load,
        reps: setParams.reps,
        amrep: setParams.amrep || false,
        progression:
          weekIndex === 2 && setIndex === weekParams.sets.length - 1
            ? getProgression("barbell-bench-press")
            : undefined,
      });
    });
    // Squats (5/3/1)
    weekParams.sets.forEach((setParams, setIndex) => {
      templates.push({
        id: generateId(),
        programId,
        routineId: routineIdDay2,
        exerciseId: "barbell-squat",
        order: ++orderDay2,
        load: setParams.load,
        reps: setParams.reps,
        amrep: setParams.amrep || false,
        progression:
          weekIndex === 2 && setIndex === weekParams.sets.length - 1
            ? getProgression("barbell-squat")
            : undefined,
      });
    });
    // Dumbbell Rows (5x10)
    for (let i = 0; i < 5; i++) {
      templates.push({
        id: generateId(),
        programId,
        routineId: routineIdDay2,
        exerciseId: "dumbbell-row-one-arm",
        order: ++orderDay2,
        load: 1,
        reps: 10,
      });
    }

    // Day 3 of the week in the cycle
    routineCounter++;
    const routineIdDay3 = `${programId}-${routineCounter}`;
    let orderDay3 = 0;
    // Shoulder Press (5/3/1)
    weekParams.sets.forEach((setParams, setIndex) => {
      templates.push({
        id: generateId(),
        programId,
        routineId: routineIdDay3,
        exerciseId: "barbell-overhead-press",
        order: ++orderDay3,
        load: setParams.load,
        reps: setParams.reps,
        amrep: setParams.amrep || false,
        progression:
          weekIndex === 2 && setIndex === weekParams.sets.length - 1
            ? getProgression("barbell-overhead-press")
            : undefined,
      });
    });
    // Barbell Rows (5/3/1)
    weekParams.sets.forEach((setParams, setIndex) => {
      templates.push({
        id: generateId(),
        programId,
        routineId: routineIdDay3,
        exerciseId: "barbell-row",
        order: ++orderDay3,
        load: setParams.load,
        reps: setParams.reps,
        amrep: setParams.amrep || false,
        progression:
          weekIndex === 2 && setIndex === weekParams.sets.length - 1
            ? getProgression("barbell-row")
            : undefined,
      });
    });

    // Day 4 of the week in the cycle
    routineCounter++;
    const routineIdDay4 = `${programId}-${routineCounter}`;
    let orderDay4 = 0;
    // Squats (5/3/1)
    weekParams.sets.forEach((setParams, setIndex) => {
      templates.push({
        id: generateId(),
        programId,
        routineId: routineIdDay4,
        exerciseId: "barbell-squat",
        order: ++orderDay4,
        load: setParams.load,
        reps: setParams.reps,
        amrep: setParams.amrep || false,
        progression:
          weekIndex === 2 && setIndex === weekParams.sets.length - 1
            ? getProgression("barbell-squat")
            : undefined,
      });
    });
    // Bench Press (5/3/1)
    weekParams.sets.forEach((setParams, setIndex) => {
      templates.push({
        id: generateId(),
        programId,
        routineId: routineIdDay4,
        exerciseId: "barbell-bench-press",
        order: ++orderDay4,
        load: setParams.load,
        reps: setParams.reps,
        amrep: setParams.amrep || false,
        progression:
          weekIndex === 2 && setIndex === weekParams.sets.length - 1
            ? getProgression("barbell-bench-press")
            : undefined,
      });
    });
    // Pullups (5x10)
    for (let i = 0; i < 5; i++) {
      templates.push({
        id: generateId(),
        programId,
        routineId: routineIdDay4,
        exerciseId: "pullups",
        order: ++orderDay4,
        load: 1,
        reps: 10,
      });
    }
  }

  await db.templates.bulkInsert(templates);
}
