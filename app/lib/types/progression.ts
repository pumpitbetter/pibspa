/**
 * Progression System Types
 * 
 * Defines the four progression types and their configuration options.
 * This forms the foundation of the new progression system.
 */

// Base progression configuration
export interface BaseProgressionConfig {
  type: 'linear' | 'reps' | 'time' | 'none';
}

// Linear progression - pure weight progression
export interface LinearProgressionConfig extends BaseProgressionConfig {
  type: 'linear';
  increment: {
    amount: number;
    unit: 'absolute' | 'percentage';
  };
  deload?: {
    amount: number;
    unit: 'absolute' | 'percentage';
    trigger: {
      consecutiveFails: number;
    };
  };
  rounding?: {
    increment: number; // e.g., 2.5 for plate increments
  };
}

// Rep progression - double progression (reps then weight)
export interface RepProgressionConfig extends BaseProgressionConfig {
  type: 'reps';
  repsIncrement: number; // How many reps to add each success
  weightIncrement: {
    amount: number;
    unit: 'absolute' | 'percentage';
  };
  deload?: {
    amount: number;
    unit: 'absolute' | 'percentage';
    trigger: {
      consecutiveFails: number;
    };
  };
  rounding?: {
    increment: number;
  };
}

// Time progression - time progression with optional weight progression  
export interface TimeProgressionConfig extends BaseProgressionConfig {
  type: 'time';
  timeIncrement: number; // Seconds to add each success
  weightIncrement?: {
    amount: number;
    unit: 'absolute' | 'percentage';
  };
  deload?: {
    amount: number;
    unit: 'absolute' | 'percentage';
    trigger: {
      consecutiveFails: number;
    };
  };
  rounding?: {
    timeIncrement?: number; // e.g., 5 second increments
    weightIncrement?: number; // e.g., 2.5 lb increments
  };
}

// No progression - static parameters (for flow exercises, videos, etc.)
export interface NoProgressionConfig extends BaseProgressionConfig {
  type: 'none';
  // No additional configuration needed
}

// Union type for all progression configurations
export type ProgressionConfig = 
  | LinearProgressionConfig 
  | RepProgressionConfig 
  | TimeProgressionConfig 
  | NoProgressionConfig;

// Helper type guards for type checking
export const isLinearProgression = (config: ProgressionConfig): config is LinearProgressionConfig => {
  return config.type === 'linear';
};

export const isRepProgression = (config: ProgressionConfig): config is RepProgressionConfig => {
  return config.type === 'reps';
};

export const isTimeProgression = (config: ProgressionConfig): config is TimeProgressionConfig => {
  return config.type === 'time';
};

export const isNoProgression = (config: ProgressionConfig): config is NoProgressionConfig => {
  return config.type === 'none';
};
