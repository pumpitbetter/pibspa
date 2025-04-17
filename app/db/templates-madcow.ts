import type { MyDatabase } from "./db";

export async function initMadcowTemplates(db: MyDatabase) {
  //
  // Madcow 5x5
  //

  // routine A

  // Barbell Squat sets
  await await db.templates.insertIfNotExists({
    id: "ivF7ZkiARfM2M7Keez9a2t",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-squat",
    order: 1,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "6qX4vHhkQBpLBS1MBHZLpm",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-squat",
    order: 2,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "ithdu5RqaZuEzAbfkBTjNv",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-squat",
    order: 3,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "aATWs7ZJaF9Mdn7JQXR82P",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-squat",
    order: 4,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "mxYn7w7cJM6CQZSsqC3CqF",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-squat",
    order: 5,
    load: 1,
    reps: 5,
    progression: {
      increment: {
        value: 5,
        kind: "weight",
        type: "absolute",
        frequency: 1, // every time this routine is done
      },
      decrement: {
        value: 0.1, // 10% of the load
        kind: "weight",
        type: "percentage",
        frequency: 3, // every 3 times this routine is done, if failed to complete the reps at this load
      },
    },
  });

  // Bench Press sets
  await await db.templates.insertIfNotExists({
    id: "tVmFUHxUZ8bqg31iATtdnF",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-bench-press",
    order: 6,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "ctRAMxTzUpRjnHF53dhyan",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-bench-press",
    order: 7,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "ePs6JuJA6yM2TaUUF3imGi",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-bench-press",
    order: 8,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "npYQG18GDMiE2HAE94VaXP",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-bench-press",
    order: 9,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "3eVPe9SdyH1a564VLv8ZCA",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-bench-press",
    order: 10,
    load: 1,
    reps: 5,
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

  // Barbell Row sets
  await await db.templates.insertIfNotExists({
    id: "ikRzQZZJ2P8NpXxuS8oFTy",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-row",
    order: 11,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "tiA47tvRcqSeDH3cWFYsc3",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-row",
    order: 12,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "pc8AkLGCS19V1DdGFu3vSm",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-row",
    order: 13,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "s9cTP7dPWtecJJvarpW7US",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-row",
    order: 14,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  await await db.templates.insertIfNotExists({
    id: "ft75Su2gbZEYoKi4jzyTCc",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "barbell-row",
    order: 15,
    load: 1,
    reps: 5,
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

  // Dip sets
  await await db.templates.insertIfNotExists({
    id: "sj6AGpGBbdZgdNFfScirm3",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "dips",
    order: 16,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "qRGMLt2QfWdQnX7N1Qg7um",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "dips",
    order: 17,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "xgqCuyZt1HRGSGE7pSPTX5",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "dips",
    order: 18,
    load: 1,
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

  // Hanging knee raise sets
  await db.templates.insertIfNotExists({
    id: "kEe6TMkc3xu4RnjafEDSW6",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "hanging-knee-raise",
    order: 19,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "1SG1KbPecumNhjUa6VtwAN",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "hanging-knee-raise",
    order: 20,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "hLyKjRjHDFwkmb1aNvr33D",
    programId: "madcow",
    routineId: "madcow-routine-1",
    exerciseId: "hanging-knee-raise",
    order: 21,
    load: 1,
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

  // routine B

  // Barbell Squat sets
  await db.templates.insertIfNotExists({
    id: "iRW2LuAjsXeQURtp8ogrSx",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-squat",
    order: 1,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "rv9LUo6iRkP1VWWeTokxd9",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-squat",
    order: 2,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "22cUxKt7F5G9xSxFLmQqqf",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-squat",
    order: 3,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "ijVwd57YuWUNzHCnLV3mej",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-squat",
    order: 4,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  // Incline Bench Press sets
  await db.templates.insertIfNotExists({
    id: "bfMDfWNux5XL67zMNPtjpB",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-incline-bench-press",
    order: 5,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "rUYQqJhAW25JQMKzcKPSRu",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-incline-bench-press",
    order: 6,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "aiK4Y9rknpWpash88jUFuN",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-incline-bench-press",
    order: 7,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "1fKxz6Rmrqom7Wt1zBdhP3",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-incline-bench-press",
    order: 8,
    load: 1,
    reps: 5,
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

  // Deadlift sets
  await db.templates.insertIfNotExists({
    id: "mF9RnHz8FfpcADbxFPPWuJ",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-deadlift",
    order: 9,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "3pYLTVRtnKATyVoXsyckDR",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-deadlift",
    order: 10,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "94uHihiPKMR28P4aKmyS3t",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-deadlift",
    order: 11,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "ccNqFrj5feJsQQHzM2XU4x",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "barbell-deadlift",
    order: 12,
    load: 1,
    reps: 5,
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

  // Pullup sets
  await db.templates.insertIfNotExists({
    id: "uunFS2R8DAKUa41yStjvRy",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "pullups",
    order: 13,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "v4Bu7DfjtQQysNPhxJsnCQ",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "pullups",
    order: 14,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "9cM7aeiwR5yUP9CotfGgUQ",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "pullups",
    order: 15,
    load: 1,
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

  // Plank sets
  await db.templates.insertIfNotExists({
    id: "r5iCwNYxyTo5PC2kzZ8Hx2",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "planks",
    order: 16,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "k7qWy1gZwQU2sRihmCjbsZ",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "planks",
    order: 17,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "utjRLE2oXyJnVgbA3hyGd4",
    programId: "madcow",
    routineId: "madcow-routine-2",
    exerciseId: "planks",
    order: 18,
    load: 1,
    reps: 8,
    progression: {
      increment: {
        value: 10,
        kind: "seconds",
        type: "absolute",
        frequency: 1,
      },
      decrement: {
        value: 10,
        kind: "seconds",
        type: "absolute",
        frequency: 3,
      },
    },
  });

  // routine C

  // Barbell Squat sets
  await db.templates.insertIfNotExists({
    id: "fE4uG3xqR7Rm1e9dxWrYqa",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-squat",
    order: 1,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "sXZ3Z6AkcjZzAyiAmQEiwS",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-squat",
    order: 2,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "aYUGS8Z8ebjrHVEyc2KDRz",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-squat",
    order: 3,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "6ysaYxyHGFsA7khFqmFeog",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-squat",
    order: 4,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "dBnztPdAEmNoALBtLEN3Ly",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-squat",
    order: 5,
    load: (100 + 12.5) / 100, // app will always calculate min(load, current max weight +  weight progression for this exercise)
    reps: 3,
    progression: {
      increment: {
        value: 2.5,
        kind: "weight",
        type: "absolute",
      },
    },
  });

  await db.templates.insertIfNotExists({
    id: "mmevFKe6R41RfH9PZEhVLV",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-squat",
    order: 6,
    load: (100 - 12.5 * 2) / 100,
    reps: 8,
  });

  // Bench Press sets
  await db.templates.insertIfNotExists({
    id: "ntkjx6ghGHuAYKkNfjRWBV",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-bench-press",
    order: 7,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "jWLxoJuCYw4X9LkbWA1M7v",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-bench-press",
    order: 8,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "mK9BnVZ3FRarggHW3miU7S",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-bench-press",
    order: 9,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "crcSp1F7xzAXnL3qvJyUK4",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-bench-press",
    order: 10,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "6pUGx8sDsLW5UcaEsUexJ4",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-bench-press",
    order: 11,
    load: (100 + 12.5) / 100, // app will always calculate min(load, current max weight +  weight progression for this exercise)
    reps: 3,
    progression: {
      increment: {
        value: 2.5,
        kind: "weight",
        type: "absolute",
      },
    },
  });

  await db.templates.insertIfNotExists({
    id: "kFCSdUKNMSXq9cNHuZPsmJ",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-bench-press",
    order: 12,
    load: (100 - 12.5 * 2) / 100,
    reps: 8,
  });

  // Barbell Row sets
  await db.templates.insertIfNotExists({
    id: "qz6YhY37ie2Jipuf8se9ii",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-row",
    order: 13,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "232pS17GjAUXt2esQD4mPr",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-row",
    order: 14,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "iZYMXiqxhwUAWWZn7TRwME",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-row",
    order: 15,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "6HVcTcFcNYVexAwsoUTuGj",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-row",
    order: 16,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  await db.templates.insertIfNotExists({
    id: "rFGS5Dr2Me7y1gyUf8oJDx",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-row",
    order: 17,
    load: (100 + 12.5) / 100, // app will always calculate min(load, current max weight +  weight progression for this exercise)
    reps: 3,
    progression: {
      increment: {
        value: 2.5,
        kind: "weight",
        type: "absolute",
      },
    },
  });

  await db.templates.insertIfNotExists({
    id: "6MqtBwRRUo8kupYXzMYULV",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-row",
    order: 18,
    load: (100 - 12.5 * 2) / 100,
    reps: 8,
  });

  // Barbell curl sets
  await db.templates.insertIfNotExists({
    id: "5VPK9wT6ooK173mgTY3w3z",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-curl",
    order: 19,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "4cNQ5gyx39ePYS9pJaQBY9",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-curl",
    order: 20,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "oCC4X3bjztA2ZWqZg2pVPa",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "barbell-curl",
    order: 21,
    load: 1,
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

  // EZ bar skullcrusher sets
  await db.templates.insertIfNotExists({
    id: "jYKbLb47HkzRHUK2tzsBfk",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "ezbar-skullcrusher",
    order: 22,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "99stSC2YfcHZSUsiQ6akqX",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "ezbar-skullcrusher",
    order: 23,
    load: 1,
    reps: 8,
  });

  await db.templates.insertIfNotExists({
    id: "mgcTxF7P6RS2odiGdkSDY7",
    programId: "madcow",
    routineId: "madcow-routine-3",
    exerciseId: "ezbar-skullcrusher",
    order: 24,
    load: 1,
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
