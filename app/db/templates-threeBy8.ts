import type { MyDatabase } from "./db";

export async function initThreeBy8Templates(db: MyDatabase) {
  //
  // 3x8 Linear Progression Program
  //

  // WORKOUT A: Squat, Bench Press, Deadlift

  // Barbell Squat sets (3 sets of 8 reps)
  await db.templates.insertIfNotExists({
    id: "3x8-squat-a-1",
    programId: "3x8",
    routineId: "3x8-routine-1",
    exerciseId: "barbell-squat",
    order: 1,
    load: 0.85, // 85% of max for warmup
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "3x8-squat-a-2",
    programId: "3x8",
    routineId: "3x8-routine-1",
    exerciseId: "barbell-squat",
    order: 2,
    load: 0.90, // 90% of max for second set
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "3x8-squat-a-3",
    programId: "3x8",
    routineId: "3x8-routine-1",
    exerciseId: "barbell-squat",
    order: 3,
    load: 1.0, // 100% of max for working set
    reps: 8,
    progression: {
      increment: {
        value: 5,
        kind: "weight",
        type: "absolute",
        frequency: 1, // every workout
      },
      decrement: {
        value: 0.1, // 10% deload
        kind: "weight", 
        type: "percentage",
        frequency: 3, // after 3 failed attempts
      },
    },
  });

  // Bench Press sets (3 sets of 8 reps)
  await db.templates.insertIfNotExists({
    id: "3x8-bench-a-1",
    programId: "3x8",
    routineId: "3x8-routine-1",
    exerciseId: "barbell-bench-press",
    order: 4,
    load: 0.85,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "3x8-bench-a-2",
    programId: "3x8",
    routineId: "3x8-routine-1",
    exerciseId: "barbell-bench-press",
    order: 5,
    load: 0.90,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "3x8-bench-a-3",
    programId: "3x8",
    routineId: "3x8-routine-1",
    exerciseId: "barbell-bench-press",
    order: 6,
    load: 1.0,
    reps: 8,
    progression: {
      increment: {
        value: 2.5,
        kind: "weight",
        type: "absolute", 
        frequency: 1,
      },
      decrement: {
        value: 0.1,
        kind: "weight",
        type: "percentage",
        frequency: 3,
      },
    },
  });

  // Deadlift set (1 set of 8 reps)
  await db.templates.insertIfNotExists({
    id: "3x8-deadlift-a-1",
    programId: "3x8",
    routineId: "3x8-routine-1",
    exerciseId: "barbell-deadlift",
    order: 7,
    load: 1.0,
    reps: 8,
    progression: {
      increment: {
        value: 5,
        kind: "weight",
        type: "absolute",
        frequency: 1,
      },
      decrement: {
        value: 0.1,
        kind: "weight",
        type: "percentage",
        frequency: 3,
      },
    },
  });

  // WORKOUT B: Squat, Overhead Press, Barbell Row

  // Barbell Squat sets (3 sets of 8 reps)
  await db.templates.insertIfNotExists({
    id: "3x8-squat-b-1",
    programId: "3x8",
    routineId: "3x8-routine-2",
    exerciseId: "barbell-squat",
    order: 1,
    load: 0.85,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "3x8-squat-b-2",
    programId: "3x8",
    routineId: "3x8-routine-2",
    exerciseId: "barbell-squat",
    order: 2,
    load: 0.90,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "3x8-squat-b-3",
    programId: "3x8",
    routineId: "3x8-routine-2",
    exerciseId: "barbell-squat",
    order: 3,
    load: 1.0,
    reps: 8,
    progression: {
      increment: {
        value: 5,
        kind: "weight",
        type: "absolute",
        frequency: 1,
      },
      decrement: {
        value: 0.1,
        kind: "weight",
        type: "percentage",
        frequency: 3,
      },
    },
  });

  // Overhead Press sets (3 sets of 8 reps)
  await db.templates.insertIfNotExists({
    id: "3x8-ohp-b-1",
    programId: "3x8",
    routineId: "3x8-routine-2",
    exerciseId: "barbell-overhead-press",
    order: 4,
    load: 0.85,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "3x8-ohp-b-2",
    programId: "3x8",
    routineId: "3x8-routine-2",
    exerciseId: "barbell-overhead-press",
    order: 5,
    load: 0.90,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "3x8-ohp-b-3",
    programId: "3x8",
    routineId: "3x8-routine-2",
    exerciseId: "barbell-overhead-press",
    order: 6,
    load: 1.0,
    reps: 8,
    progression: {
      increment: {
        value: 2.5,
        kind: "weight",
        type: "absolute",
        frequency: 1,
      },
      decrement: {
        value: 0.1,
        kind: "weight",
        type: "percentage",
        frequency: 3,
      },
    },
  });

  // Barbell Row sets (3 sets of 8 reps)
  await db.templates.insertIfNotExists({
    id: "3x8-row-b-1",
    programId: "3x8",
    routineId: "3x8-routine-2",
    exerciseId: "barbell-row",
    order: 7,
    load: 0.85,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "3x8-row-b-2",
    programId: "3x8",
    routineId: "3x8-routine-2",
    exerciseId: "barbell-row",
    order: 8,
    load: 0.90,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "3x8-row-b-3",
    programId: "3x8",
    routineId: "3x8-routine-2",
    exerciseId: "barbell-row",
    order: 9,
    load: 1.0,
    reps: 8,
    progression: {
      increment: {
        value: 2.5,
        kind: "weight",
        type: "absolute",
        frequency: 1,
      },
      decrement: {
        value: 0.1,
        kind: "weight",
        type: "percentage",
        frequency: 3,
      },
    },
  });
}
