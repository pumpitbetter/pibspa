import type { TemplatesDocType } from "./templates";

export const fiveDayUpperLowerTemplatesData: TemplatesDocType[] = [
  // DAY 1 - Upper Body
  // Squat – 3 sets × 5–8 reps (Double Progression)
  {
    id: "five-day-upper-lower-day-1-squat-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "barbell-squat",
    order: 1,
    load: 1.0,
    repRange: {
      min: 5,
      max: 8,
    },
  },
  {
    id: "five-day-upper-lower-day-1-squat-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "barbell-squat",
    order: 2,
    load: 1.0,
    repRange: {
      min: 5,
      max: 8,
    },
  },
  {
    id: "five-day-upper-lower-day-1-squat-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "barbell-squat",
    order: 3,
    load: 1.0,
    repRange: {
      min: 5,
      max: 8,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Hamstring Curl – 3 sets × 10–15 reps (Double Progression)
  {
    id: "five-day-upper-lower-day-1-leg-curl-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "machine-leg-curl-lying",
    order: 4,
    load: 1.0,
    repRange: {
      min: 10,
      max: 15,
    },
  },
  {
    id: "five-day-upper-lower-day-1-leg-curl-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "machine-leg-curl-lying",
    order: 5,
    load: 1.0,
    repRange: {
      min: 10,
      max: 15,
    },
  },
  {
    id: "five-day-upper-lower-day-1-leg-curl-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "machine-leg-curl-lying",
    order: 6,
    load: 1.0,
    repRange: {
      min: 10,
      max: 15,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Incline Barbell Bench Press – 3 sets × 5–8 reps
  {
    id: "five-day-upper-lower-day-1-incline-bench-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "barbell-incline-bench-press",
    order: 7,
    load: 1.0,
    repRange: {
      min: 5,
      max: 8,
    },
  },
  {
    id: "five-day-upper-lower-day-1-incline-bench-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "barbell-incline-bench-press",
    order: 8,
    load: 1.0,
    repRange: {
      min: 5,
      max: 8,
    },
  },
  {
    id: "five-day-upper-lower-day-1-incline-bench-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "barbell-incline-bench-press",
    order: 9,
    load: 1.0,
    repRange: {
      min: 5,
      max: 8,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Chest-Supported Row – 4 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-1-chest-row-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "barbell-chest-supported-row",
    order: 10,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-1-chest-row-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "barbell-chest-supported-row",
    order: 11,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-1-chest-row-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "barbell-chest-supported-row",
    order: 12,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-1-chest-row-4",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "barbell-chest-supported-row",
    order: 13,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3, 4], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Bayesian Curl – 3 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-1-bayesian-curl-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "cable-bayesian-curl",
    order: 14,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-1-bayesian-curl-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "cable-bayesian-curl",
    order: 15,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-1-bayesian-curl-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "cable-bayesian-curl",
    order: 16,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Cable Lateral Raise – 4 sets × 12–20 reps
  {
    id: "five-day-upper-lower-day-1-lateral-raise-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "cable-lateral-raise",
    order: 17,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-1-lateral-raise-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "cable-lateral-raise",
    order: 18,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-1-lateral-raise-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "cable-lateral-raise",
    order: 19,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-1-lateral-raise-4",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "cable-lateral-raise",
    order: 20,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3, 4], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Seated Calf Raise – 3 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-1-calf-raise-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "machine-seated-calf-raise",
    order: 21,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-1-calf-raise-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "machine-seated-calf-raise",
    order: 22,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-1-calf-raise-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-1",
    exerciseId: "machine-seated-calf-raise",
    order: 23,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },

  // DAY 2 - Lower Body
  // Leg Press – 3 sets × 10–15 reps
  {
    id: "five-day-upper-lower-day-2-leg-press-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "machine-leg-press-45-degree",
    order: 1,
    load: 1.0,
    repRange: {
      min: 10,
      max: 15,
    },
  },
  {
    id: "five-day-upper-lower-day-2-leg-press-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "machine-leg-press-45-degree",
    order: 2,
    load: 1.0,
    repRange: {
      min: 10,
      max: 15,
    },
  },
  {
    id: "five-day-upper-lower-day-2-leg-press-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "machine-leg-press-45-degree",
    order: 3,
    load: 1.0,
    repRange: {
      min: 10,
      max: 15,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Leg Press Calf Raise – 3 sets × 10–15 reps
  {
    id: "five-day-upper-lower-day-2-leg-press-calf-raise-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "machine-leg-press-calf-raise",
    order: 4,
    load: 1.0,
    repRange: {
      min: 10,
      max: 15,
    },
  },
  {
    id: "five-day-upper-lower-day-2-leg-press-calf-raise-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "machine-leg-press-calf-raise",
    order: 5,
    load: 1.0,
    repRange: {
      min: 10,
      max: 15,
    },
  },
  {
    id: "five-day-upper-lower-day-2-leg-press-calf-raise-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "machine-leg-press-calf-raise",
    order: 6,
    load: 1.0,
    repRange: {
      min: 10,
      max: 15,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Lunges – 3 sets × 6–10 reps
  {
    id: "five-day-upper-lower-day-2-lunge-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "dumbbell-lunge",
    order: 7,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-2-lunge-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "dumbbell-lunge",
    order: 8,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-2-lunge-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "dumbbell-lunge",
    order: 9,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Cable Fly – 3 sets × 12–20 reps
  {
    id: "five-day-upper-lower-day-2-cable-fly-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-chest-fly",
    order: 10,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-2-cable-fly-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-chest-fly",
    order: 11,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-2-cable-fly-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-chest-fly",
    order: 12,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Dr. Swole Pulldown – 4 sets × 12–20 reps
  {
    id: "five-day-upper-lower-day-2-pulldown-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-lat-pulldown",
    order: 13,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-2-pulldown-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-lat-pulldown",
    order: 14,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-2-pulldown-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-lat-pulldown",
    order: 15,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-2-pulldown-4",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-lat-pulldown",
    order: 16,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Cable Curl – 2 sets × 10–15 reps
  {
    id: "five-day-upper-lower-day-2-cable-curl-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-bicep-curl",
    order: 17,
    load: 1.0,
    repRange: {
      min: 10,
      max: 15,
    },
  },
  {
    id: "five-day-upper-lower-day-2-cable-curl-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-bicep-curl",
    order: 18,
    load: 1.0,
    repRange: {
      min: 10,
      max: 15,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Overhead Cable Extension – 2 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-2-overhead-extension-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-overhead-tricep-extension",
    order: 19,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-2-overhead-extension-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-overhead-tricep-extension",
    order: 20,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Cable Upright Row – 4 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-2-upright-row-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-upright-row",
    order: 21,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-2-upright-row-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-upright-row",
    order: 22,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-2-upright-row-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-upright-row",
    order: 23,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-2-upright-row-4",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-2",
    exerciseId: "cable-upright-row",
    order: 24,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },

  // Continue with remaining days...
  // (Due to length limits, I'll continue in the next part)

  // DAY 3 - Upper Body
  // Romanian Deadlift (RDL) – 3 sets × 6–10 reps
  {
    id: "five-day-upper-lower-day-3-rdl-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "barbell-romanian-deadlift",
    order: 1,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-3-rdl-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "barbell-romanian-deadlift",
    order: 2,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-3-rdl-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "barbell-romanian-deadlift",
    order: 3,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Leg Extension – 3 sets × 12–20 reps
  {
    id: "five-day-upper-lower-day-3-leg-extension-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "machine-leg-extension",
    order: 4,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-3-leg-extension-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "machine-leg-extension",
    order: 5,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-3-leg-extension-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "machine-leg-extension",
    order: 6,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Pin Press – 4 sets × 6–10 reps
  {
    id: "five-day-upper-lower-day-3-pin-press-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "barbell-pin-press",
    order: 7,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-3-pin-press-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "barbell-pin-press",
    order: 8,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-3-pin-press-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "barbell-pin-press",
    order: 9,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-3-pin-press-4",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "barbell-pin-press",
    order: 10,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3, 4], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Pull ups – 4 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-3-pullup-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "neutral-grip-pull-up",
    order: 11,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-3-pullup-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "neutral-grip-pull-up",
    order: 12,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-3-pullup-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "neutral-grip-pull-up",
    order: 13,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-3-pullup-4",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "neutral-grip-pull-up",
    order: 14,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3, 4], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Lying Bicep Curl – 3 sets × 6–10 reps
  {
    id: "five-day-upper-lower-day-3-lying-curl-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "dumbbell-lying-bicep-curl",
    order: 15,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-3-lying-curl-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "dumbbell-lying-bicep-curl",
    order: 16,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-3-lying-curl-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "dumbbell-lying-bicep-curl",
    order: 17,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Dumbbell Lateral Raise – 4 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-3-db-lateral-raise-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "dumbbell-lateral-raise",
    order: 18,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-3-db-lateral-raise-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "dumbbell-lateral-raise",
    order: 19,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-3-db-lateral-raise-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "dumbbell-lateral-raise",
    order: 20,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-3-db-lateral-raise-4",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "dumbbell-lateral-raise",
    order: 21,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3, 4], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Machine Calf Raise – 3 sets × 12–20 reps
  {
    id: "five-day-upper-lower-day-3-machine-calf-raise-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "machine-standing-calf-raise",
    order: 22,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-3-machine-calf-raise-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "machine-standing-calf-raise",
    order: 23,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-3-machine-calf-raise-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-3",
    exerciseId: "machine-standing-calf-raise",
    order: 24,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },

  // DAY 4 - Lower Body
  // Hack Squat – 3 sets × 6–10 reps
  {
    id: "five-day-upper-lower-day-4-hack-squat-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "machine-hack-squat",
    order: 1,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-4-hack-squat-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "machine-hack-squat",
    order: 2,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-4-hack-squat-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "machine-hack-squat",
    order: 3,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Barbell Hip Thrust – 2 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-4-hip-thrust-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "barbell-hip-thrust",
    order: 4,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-4-hip-thrust-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "barbell-hip-thrust",
    order: 5,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Dumbbell Bench Press – 3 sets × 6–10 reps
  {
    id: "five-day-upper-lower-day-4-db-bench-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "dumbbell-bench-press",
    order: 6,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-4-db-bench-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "dumbbell-bench-press",
    order: 7,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-4-db-bench-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "dumbbell-bench-press",
    order: 8,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Lat Pulldown – 4 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-4-lat-pulldown-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "cable-lat-pulldown",
    order: 9,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-4-lat-pulldown-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "cable-lat-pulldown",
    order: 10,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-4-lat-pulldown-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "cable-lat-pulldown",
    order: 11,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-4-lat-pulldown-4",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "cable-lat-pulldown",
    order: 12,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3, 4], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Dumbbell Preacher Curl – 2 sets × 6–10 reps
  {
    id: "five-day-upper-lower-day-4-db-preacher-curl-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "dumbbell-preacher-curl",
    order: 13,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-4-db-preacher-curl-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "dumbbell-preacher-curl",
    order: 14,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Pressdowns – 3 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-4-pressdowns-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "cable-tricep-pushdown",
    order: 15,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-4-pressdowns-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "cable-tricep-pushdown",
    order: 16,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-4-pressdowns-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "cable-tricep-pushdown",
    order: 17,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Cable Upright Row – 4 sets × 10–15 reps
  {
    id: "five-day-upper-lower-day-4-upright-row-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "cable-upright-row",
    order: 18,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-4-upright-row-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "cable-upright-row",
    order: 19,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-4-upright-row-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "cable-upright-row",
    order: 20,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-4-upright-row-4",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "cable-upright-row",
    order: 21,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3, 4], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Machine Calf Raise – 3 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-4-machine-calf-raise-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "machine-standing-calf-raise",
    order: 22,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-4-machine-calf-raise-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "machine-standing-calf-raise",
    order: 23,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-4-machine-calf-raise-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-4",
    exerciseId: "machine-standing-calf-raise",
    order: 24,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },

  // DAY 5 - Upper Body
  // Bulgarian Split Squat – 3 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-5-bulgarian-split-squat-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "dumbbell-bulgarian-split-squat",
    order: 1,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-5-bulgarian-split-squat-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "dumbbell-bulgarian-split-squat",
    order: 2,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-5-bulgarian-split-squat-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "dumbbell-bulgarian-split-squat",
    order: 3,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Barbell Back Extension – 3 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-5-back-extension-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "barbell-back-extension",
    order: 4,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-5-back-extension-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "barbell-back-extension",
    order: 5,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-5-back-extension-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "barbell-back-extension",
    order: 6,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Machine Overhead Press – 3 sets × 6–10 reps
  {
    id: "five-day-upper-lower-day-5-machine-overhead-press-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "machine-shoulder-press",
    order: 7,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-5-machine-overhead-press-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "machine-shoulder-press",
    order: 8,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-5-machine-overhead-press-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "machine-shoulder-press",
    order: 9,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Cable Row – 4 sets × 6–10 reps
  {
    id: "five-day-upper-lower-day-5-cable-row-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "cable-seated-row",
    order: 10,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-5-cable-row-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "cable-seated-row",
    order: 11,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-5-cable-row-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "cable-seated-row",
    order: 12,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
  },
  {
    id: "five-day-upper-lower-day-5-cable-row-4",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "cable-seated-row",
    order: 13,
    load: 1.0,
    repRange: {
      min: 6,
      max: 10,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3, 4], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Hammer Curl – 3 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-5-hammer-curl-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "dumbbell-hammer-curl",
    order: 14,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-5-hammer-curl-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "dumbbell-hammer-curl",
    order: 15,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-5-hammer-curl-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "dumbbell-hammer-curl",
    order: 16,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // Cable Lateral Raise – 4 sets × 10–15 reps
  {
    id: "five-day-upper-lower-day-5-cable-lateral-raise-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "cable-lateral-raise",
    order: 17,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-5-cable-lateral-raise-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "cable-lateral-raise",
    order: 18,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-5-cable-lateral-raise-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "cable-lateral-raise",
    order: 19,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
  },
  {
    id: "five-day-upper-lower-day-5-cable-lateral-raise-4",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "cable-lateral-raise",
    order: 20,
    load: 1.0,
    repRange: {
      min: 12,
      max: 20,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3, 4], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
  // EZ Bar Skullcrusher – 3 sets × 8–12 reps
  {
    id: "five-day-upper-lower-day-5-ez-skullcrusher-1",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "ezbar-skullcrusher",
    order: 21,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-5-ez-skullcrusher-2",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "ezbar-skullcrusher",
    order: 22,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
  },
  {
    id: "five-day-upper-lower-day-5-ez-skullcrusher-3",
    programId: "five-day-upper-lower",
    routineId: "five-day-upper-lower-day-5",
    exerciseId: "ezbar-skullcrusher",
    order: 23,
    load: 1.0,
    repRange: {
      min: 8,
      max: 12,
    },
    progressionConfig: {
      type: "reps" as const,
      progressionSets: [1, 2, 3], // All squat sets contribute to progression
      incrementType: "fixed" as const,
      repsIncrement: 1, // +1 rep per session
      weightIncrement: 5, // +5 lbs when max reps achieved
      weightRoundingIncrement: 2.5,
      deloadStrategy: "percentage" as const,
      deloadType: "percentage" as const,
      deloadAmount: 10, // -10% on deload
      failureThreshold: 3,
    },
  },
];
