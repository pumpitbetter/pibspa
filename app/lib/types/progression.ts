/**
 * Progression System Types - Template-Level Configuration
 * 
 * Defines progression configuration that lives directly in templates.
 * Presence of progressionConfig indicates progression is enabled.
 */

export interface ProgressionConfig {
  type: 'linear' | 'reps' | 'time' | 'none';
  
  // Which sets count for progression (optional - if not specified, all sets count)
  progressionSets?: number[]; // e.g., [3] for only 3rd set
  
  // Multi-stage progression control (not applicable for 'none' type)
  enableWeightProgression?: boolean; // For reps/time types
  
  // Increment configuration (not applicable for 'none' type)
  incrementType?: 'fixed' | 'percentage';
  weightIncrement?: number; // Fixed lbs OR percentage
  repsIncrement?: number; // For reps type
  timeIncrement?: number; // For time type (seconds)
  
  // Rounding (for percentage calculations)
  weightRoundingIncrement?: number; // 2.5, 5, 10 lbs
  timeRoundingIncrement?: number; // 5, 10 seconds
  
  // Deload configuration (not applicable for 'none' type)
  deloadStrategy?: 'weight-only' | 'reps-only' | 'time-only' | 'time-then-weight' | 'percentage';
  deloadType?: 'fixed' | 'percentage';
  deloadAmount?: number; // Fixed amount OR percentage
  failureThreshold?: number; // Consecutive failures before deload
}

/**
 * Progression examples for common use cases
 */
export const ProgressionExamples = {
  // Traditional strength training
  linearProgression: {
    type: 'linear' as const,
    incrementType: 'fixed' as const,
    weightIncrement: 5, // +5 lbs each success
    weightRoundingIncrement: 2.5,
    deloadStrategy: 'weight-only' as const,
    deloadType: 'percentage' as const,
    deloadAmount: 10, // -10% on deload
    failureThreshold: 3
  },

  // Double progression (6-8 reps, then add weight)
  repProgression: {
    type: 'reps' as const,
    enableWeightProgression: true,
    incrementType: 'fixed' as const,
    weightIncrement: 5, // +5 lbs when reps maxed
    repsIncrement: 1,
    weightRoundingIncrement: 2.5,
    deloadStrategy: 'weight-only' as const,
    deloadType: 'fixed' as const,
    deloadAmount: 5, // -5 lbs on deload
    failureThreshold: 3
  },

  // Time progression with weight (30-60s, then add weight)
  timeProgression: {
    type: 'time' as const,
    enableWeightProgression: true,
    incrementType: 'fixed' as const,
    timeIncrement: 10, // +10 seconds
    weightIncrement: 5, // +5 lbs when time maxed
    timeRoundingIncrement: 5,
    weightRoundingIncrement: 2.5,
    deloadStrategy: 'time-then-weight' as const,
    deloadType: 'fixed' as const,
    deloadAmount: 15, // -15 seconds, then -5 lbs if needed
    failureThreshold: 3
  },

  // 5/3/1 AMRAP progression (only final set triggers progression)
  amrapProgression: {
    type: 'linear' as const,
    progressionSets: [3], // Only 3rd set counts
    incrementType: 'fixed' as const,
    weightIncrement: 10, // +10 lbs for deadlift/squat
    weightRoundingIncrement: 2.5,
    deloadStrategy: 'percentage' as const,
    deloadType: 'percentage' as const,
    deloadAmount: 10, // -10% on deload
    failureThreshold: 3
  },

  // No progression (static exercises)
  noProgression: {
    type: 'none' as const
  }
};

// Helper type guards for type checking
export const isLinearProgression = (config: ProgressionConfig): config is ProgressionConfig & { type: 'linear' } => {
  return config.type === 'linear';
};

export const isRepProgression = (config: ProgressionConfig): config is ProgressionConfig & { type: 'reps' } => {
  return config.type === 'reps';
};

export const isTimeProgression = (config: ProgressionConfig): config is ProgressionConfig & { type: 'time' } => {
  return config.type === 'time';
};

export const isNoProgression = (config: ProgressionConfig): config is ProgressionConfig & { type: 'none' } => {
  return config.type === 'none';
};
