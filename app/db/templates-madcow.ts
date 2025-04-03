import type { MyDatabase } from "./db";

export async function initMadcowTemplates(db: MyDatabase) {
  //
  // Madcow 5x5
  //

  // Workout A

  // Barbell Squat sets
  db.templates.insertIfNotExists({
    id: "ivF7ZkiARfM2M7Keez9a2t",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-squat",
    order: 1,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "6qX4vHhkQBpLBS1MBHZLpm",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-squat",
    order: 2,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "ithdu5RqaZuEzAbfkBTjNv",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-squat",
    order: 3,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "aATWs7ZJaF9Mdn7JQXR82P",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-squat",
    order: 4,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "mxYn7w7cJM6CQZSsqC3CqF",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-squat",
    order: 5,
    load: (100 - 12.5 * 0) / 100,
    reps: 5,
  });

  // Bench Press sets
  db.templates.insertIfNotExists({
    id: "tVmFUHxUZ8bqg31iATtdnF",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-bench-press",
    order: 6,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "ctRAMxTzUpRjnHF53dhyan",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-bench-press",
    order: 7,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "ePs6JuJA6yM2TaUUF3imGi",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-bench-press",
    order: 8,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "npYQG18GDMiE2HAE94VaXP",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-bench-press",
    order: 9,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "3eVPe9SdyH1a564VLv8ZCA",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-bench-press",
    order: 10,
    load: (100 - 12.5 * 0) / 100,
    reps: 5,
  });

  // Barbell Row sets
  db.templates.insertIfNotExists({
    id: "ikRzQZZJ2P8NpXxuS8oFTy",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-row",
    order: 11,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "tiA47tvRcqSeDH3cWFYsc3",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-row",
    order: 12,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "pc8AkLGCS19V1DdGFu3vSm",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-row",
    order: 13,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "s9cTP7dPWtecJJvarpW7US",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-row",
    order: 14,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "ft75Su2gbZEYoKi4jzyTCc",
    workoutId: "madcow-workout-1",
    exerciseId: "barbell-row",
    order: 15,
    load: (100 - 12.5 * 0) / 100,
    reps: 5,
  });

  // Dip sets
  db.templates.insertIfNotExists({
    id: "sj6AGpGBbdZgdNFfScirm3",
    workoutId: "madcow-workout-1",
    exerciseId: "dips",
    order: 16,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "qRGMLt2QfWdQnX7N1Qg7um",
    workoutId: "madcow-workout-1",
    exerciseId: "dips",
    order: 17,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "xgqCuyZt1HRGSGE7pSPTX5",
    workoutId: "madcow-workout-1",
    exerciseId: "dips",
    order: 18,
    load: 1,
    reps: 8,
  });

  // Hanging knee raise sets
  db.templates.insertIfNotExists({
    id: "kEe6TMkc3xu4RnjafEDSW6",
    workoutId: "madcow-workout-1",
    exerciseId: "hanging-knee-raise",
    order: 19,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "1SG1KbPecumNhjUa6VtwAN",
    workoutId: "madcow-workout-1",
    exerciseId: "hanging-knee-raise",
    order: 20,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "hLyKjRjHDFwkmb1aNvr33D",
    workoutId: "madcow-workout-1",
    exerciseId: "hanging-knee-raise",
    order: 21,
    load: 1,
    reps: 8,
  });

  // Workout B

  // Barbell Squat sets
  db.templates.insertIfNotExists({
    id: "iRW2LuAjsXeQURtp8ogrSx",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-squat",
    order: 1,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "rv9LUo6iRkP1VWWeTokxd9",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-squat",
    order: 2,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "22cUxKt7F5G9xSxFLmQqqf",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-squat",
    order: 3,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "ijVwd57YuWUNzHCnLV3mej",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-squat",
    order: 4,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  // Incline Bench Press sets
  db.templates.insertIfNotExists({
    id: "bfMDfWNux5XL67zMNPtjpB",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-incline-bench-press",
    order: 5,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "rUYQqJhAW25JQMKzcKPSRu",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-incline-bench-press",
    order: 6,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "aiK4Y9rknpWpash88jUFuN",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-incline-bench-press",
    order: 7,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "1fKxz6Rmrqom7Wt1zBdhP3",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-incline-bench-press",
    order: 8,
    load: 1,
    reps: 5,
  });

  // Deadlift sets
  db.templates.insertIfNotExists({
    id: "mF9RnHz8FfpcADbxFPPWuJ",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-deadlift",
    order: 9,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "3pYLTVRtnKATyVoXsyckDR",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-deadlift",
    order: 10,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "94uHihiPKMR28P4aKmyS3t",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-deadlift",
    order: 11,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "ccNqFrj5feJsQQHzM2XU4x",
    workoutId: "madcow-workout-2",
    exerciseId: "barbell-deadlift",
    order: 12,
    load: 1,
    reps: 5,
  });

  // Pullup sets
  db.templates.insertIfNotExists({
    id: "uunFS2R8DAKUa41yStjvRy",
    workoutId: "madcow-workout-2",
    exerciseId: "pullups",
    order: 13,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "v4Bu7DfjtQQysNPhxJsnCQ",
    workoutId: "madcow-workout-2",
    exerciseId: "pullups",
    order: 14,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "9cM7aeiwR5yUP9CotfGgUQ",
    workoutId: "madcow-workout-2",
    exerciseId: "pullups",
    order: 15,
    load: 1,
    reps: 8,
  });

  // Plank sets
  db.templates.insertIfNotExists({
    id: "r5iCwNYxyTo5PC2kzZ8Hx2",
    workoutId: "madcow-workout-2",
    exerciseId: "planks",
    order: 16,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "k7qWy1gZwQU2sRihmCjbsZ",
    workoutId: "madcow-workout-2",
    exerciseId: "planks",
    order: 17,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "utjRLE2oXyJnVgbA3hyGd4",
    workoutId: "madcow-workout-2",
    exerciseId: "planks",
    order: 18,
    load: 1,
    reps: 8,
  });

  // Workout C

  // Barbell Squat sets
  db.templates.insertIfNotExists({
    id: "fE4uG3xqR7Rm1e9dxWrYqa",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-squat",
    order: 1,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "sXZ3Z6AkcjZzAyiAmQEiwS",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-squat",
    order: 2,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "aYUGS8Z8ebjrHVEyc2KDRz",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-squat",
    order: 3,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "6ysaYxyHGFsA7khFqmFeog",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-squat",
    order: 4,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "dBnztPdAEmNoALBtLEN3Ly",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-squat",
    order: 5,
    load: (100 + 12.5) / 100, // app will always calculate min(load, current max weight +  weight progression for this exercise)
    reps: 3,
  });

  db.templates.insertIfNotExists({
    id: "mmevFKe6R41RfH9PZEhVLV",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-squat",
    order: 6,
    load: (100 - 12.5 * 2) / 100,
    reps: 8,
  });

  // Bench Press sets
  db.templates.insertIfNotExists({
    id: "ntkjx6ghGHuAYKkNfjRWBV",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-bench-press",
    order: 7,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "jWLxoJuCYw4X9LkbWA1M7v",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-bench-press",
    order: 8,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "mK9BnVZ3FRarggHW3miU7S",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-bench-press",
    order: 9,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "crcSp1F7xzAXnL3qvJyUK4",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-bench-press",
    order: 10,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "6pUGx8sDsLW5UcaEsUexJ4",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-bench-press",
    order: 11,
    load: (100 + 12.5) / 100, // app will always calculate min(load, current max weight +  weight progression for this exercise)
    reps: 3,
  });

  db.templates.insertIfNotExists({
    id: "kFCSdUKNMSXq9cNHuZPsmJ",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-bench-press",
    order: 12,
    load: (100 - 12.5 * 2) / 100,
    reps: 8,
  });

  // Barbell Row sets
  db.templates.insertIfNotExists({
    id: "qz6YhY37ie2Jipuf8se9ii",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-row",
    order: 13,
    load: (100 - 12.5 * 4) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "232pS17GjAUXt2esQD4mPr",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-row",
    order: 14,
    load: (100 - 12.5 * 3) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "iZYMXiqxhwUAWWZn7TRwME",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-row",
    order: 15,
    load: (100 - 12.5 * 2) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "6HVcTcFcNYVexAwsoUTuGj",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-row",
    order: 16,
    load: (100 - 12.5 * 1) / 100,
    reps: 5,
  });

  db.templates.insertIfNotExists({
    id: "rFGS5Dr2Me7y1gyUf8oJDx",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-row",
    order: 17,
    load: (100 + 12.5) / 100, // app will always calculate min(load, current max weight +  weight progression for this exercise)
    reps: 3,
  });

  db.templates.insertIfNotExists({
    id: "6MqtBwRRUo8kupYXzMYULV",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-row",
    order: 18,
    load: (100 - 12.5 * 2) / 100,
    reps: 8,
  });

  // Barbell curl sets
  db.templates.insertIfNotExists({
    id: "5VPK9wT6ooK173mgTY3w3z",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-curl",
    order: 19,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "4cNQ5gyx39ePYS9pJaQBY9",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-curl",
    order: 20,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "oCC4X3bjztA2ZWqZg2pVPa",
    workoutId: "madcow-workout-3",
    exerciseId: "barbell-curl",
    order: 21,
    load: 1,
    reps: 8,
  });

  // EZ bar skullcrusher sets
  db.templates.insertIfNotExists({
    id: "jYKbLb47HkzRHUK2tzsBfk",
    workoutId: "madcow-workout-3",
    exerciseId: "ezbar-skullcrusher",
    order: 22,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "99stSC2YfcHZSUsiQ6akqX",
    workoutId: "madcow-workout-3",
    exerciseId: "ezbar-skullcrusher",
    order: 23,
    load: 1,
    reps: 8,
  });

  db.templates.insertIfNotExists({
    id: "mgcTxF7P6RS2odiGdkSDY7",
    workoutId: "madcow-workout-3",
    exerciseId: "ezbar-skullcrusher",
    order: 24,
    load: 1,
    reps: 8,
  });
}
