/**
 * Progression Calculation Engine
 * 
 * Implements the 4-type progression system (Linear, Reps, Time, None)
 * Based on the progression system design documents.
 */

import type { 
  ProgressionConfig,
  LinearProgressionConfig,
  RepProgressionConfig,
  TimeProgressionConfig,
  NoProgressionConfig
} from "./types/progression";

import {
  isLinearProgression,
  isRepProgression,
  isTimeProgression,
  isNoProgression
} from "./types/progression";

// Workout performance data for an exercise
export interface ExercisePerformance {
  exerciseId: string;
  sets: {
    weight?: number;
    reps?: number;
    duration?: number; // seconds
    completed: boolean;
    failed: boolean;
  }[];
}

// Current progression state
export interface ProgressionState {
  maxWeight?: number;
  maxReps?: number;
  maxTime?: number; // seconds
  consecutiveFailures: number;
  lastProgressionDate?: Date;
}

// Progression calculation result
export interface ProgressionResult {
  progressionOccurred: boolean;
  newMaxWeight?: number;
  newMaxReps?: number;
  newMaxTime?: number;
  newConsecutiveFailures: number;
  action: 'progression' | 'deload' | 'maintain';
  details: string; // Human readable description
}

/**
 * Calculate progression for an exercise based on workout performance
 */
export function calculateProgression(
  config: ProgressionConfig,
  currentState: ProgressionState,
  performance: ExercisePerformance,
  template: { repRange?: { min: number; max: number }; timeRange?: { min: number; max: number }; load?: number }
): ProgressionResult {
  
  if (isNoProgression(config)) {
    return {
      progressionOccurred: false,
      newConsecutiveFailures: currentState.consecutiveFailures,
      action: 'maintain',
      details: 'Static exercise - no progression applied'
    };
  }

  // Check if exercise was failed (any set marked as failed)
  const exerciseFailed = performance.sets.some(set => set.failed);
  
  if (exerciseFailed) {
    const newFailures = currentState.consecutiveFailures + 1;
    
    // Check if deload is needed
    if (config.deload && newFailures >= config.deload.trigger.consecutiveFails) {
      return applyDeload(config, currentState, newFailures);
    }
    
    return {
      progressionOccurred: false,
      newConsecutiveFailures: newFailures,
      action: 'maintain',
      details: `Exercise failed. Consecutive failures: ${newFailures}`
    };
  }

  // Exercise succeeded - check for progression
  if (isLinearProgression(config)) {
    return calculateLinearProgression(config, currentState, performance);
  }
  
  if (isRepProgression(config)) {
    return calculateRepProgression(config, currentState, performance, template);
  }
  
  if (isTimeProgression(config)) {
    return calculateTimeProgression(config, currentState, performance, template);
  }

  // Fallback
  return {
    progressionOccurred: false,
    newConsecutiveFailures: 0, // Reset failures on success
    action: 'maintain',
    details: 'Unknown progression type'
  };
}

/**
 * Linear Progression: Add weight each successful session
 */
function calculateLinearProgression(
  config: LinearProgressionConfig,
  currentState: ProgressionState,
  performance: ExercisePerformance
): ProgressionResult {
  
  const currentWeight = currentState.maxWeight || 0;
  let newWeight: number;
  
  if (config.increment.unit === 'absolute') {
    newWeight = currentWeight + config.increment.amount;
  } else {
    // Percentage increment
    newWeight = currentWeight * (1 + config.increment.amount / 100);
  }
  
  // Apply rounding if configured
  if (config.rounding?.increment) {
    newWeight = Math.round(newWeight / config.rounding.increment) * config.rounding.increment;
  }
  
  return {
    progressionOccurred: true,
    newMaxWeight: newWeight,
    newConsecutiveFailures: 0, // Reset failures on success
    action: 'progression',
    details: `Linear progression: ${currentWeight} → ${newWeight} ${config.increment.unit === 'percentage' ? '(+' + config.increment.amount + '%)' : '(+' + config.increment.amount + ')'}`
  };
}

/**
 * Rep Progression: Increase reps within range, then add weight and reset reps
 */
function calculateRepProgression(
  config: RepProgressionConfig,
  currentState: ProgressionState,
  performance: ExercisePerformance,
  template: { repRange?: { min: number; max: number }; load?: number }
): ProgressionResult {
  
  if (!template.repRange) {
    return {
      progressionOccurred: false,
      newConsecutiveFailures: 0,
      action: 'maintain',
      details: 'Rep progression requires repRange in template'
    };
  }
  
  const currentReps = currentState.maxReps || template.repRange.min;
  const currentWeight = currentState.maxWeight || 0;
  
  // Check if we can increase reps
  if (currentReps < template.repRange.max) {
    const newReps = Math.min(currentReps + config.repsIncrement, template.repRange.max);
    
    return {
      progressionOccurred: true,
      newMaxReps: newReps,
      newConsecutiveFailures: 0,
      action: 'progression',
      details: `Rep progression: ${currentReps} → ${newReps} reps`
    };
  }
  
  // Reps are at max, add weight and reset reps
  let newWeight: number;
  if (config.weightIncrement.unit === 'absolute') {
    newWeight = currentWeight + config.weightIncrement.amount;
  } else {
    newWeight = currentWeight * (1 + config.weightIncrement.amount / 100);
  }
  
  // Apply rounding
  if (config.rounding?.increment) {
    newWeight = Math.round(newWeight / config.rounding.increment) * config.rounding.increment;
  }
  
  return {
    progressionOccurred: true,
    newMaxWeight: newWeight,
    newMaxReps: template.repRange.min, // Reset to minimum reps
    newConsecutiveFailures: 0,
    action: 'progression',
    details: `Double progression: ${currentWeight} @ ${currentReps} reps → ${newWeight} @ ${template.repRange.min} reps`
  };
}

/**
 * Time Progression: Increase time within range, optionally add weight and reset time
 */
function calculateTimeProgression(
  config: TimeProgressionConfig,
  currentState: ProgressionState,
  performance: ExercisePerformance,
  template: { timeRange?: { min: number; max: number }; load?: number }
): ProgressionResult {
  
  if (!template.timeRange) {
    return {
      progressionOccurred: false,
      newConsecutiveFailures: 0,
      action: 'maintain',
      details: 'Time progression requires timeRange in template'
    };
  }
  
  const currentTime = currentState.maxTime || template.timeRange.min;
  const currentWeight = currentState.maxWeight || 0;
  
  // Check if we can increase time
  if (currentTime < template.timeRange.max) {
    let newTime = currentTime + config.timeIncrement;
    
    // Apply time rounding
    if (config.rounding?.timeIncrement) {
      newTime = Math.round(newTime / config.rounding.timeIncrement) * config.rounding.timeIncrement;
    }
    
    newTime = Math.min(newTime, template.timeRange.max);
    
    return {
      progressionOccurred: true,
      newMaxTime: newTime,
      newConsecutiveFailures: 0,
      action: 'progression',
      details: `Time progression: ${currentTime}s → ${newTime}s`
    };
  }
  
  // Time is at max - add weight if configured and reset time
  if (config.weightIncrement) {
    let newWeight: number;
    if (config.weightIncrement.unit === 'absolute') {
      newWeight = currentWeight + config.weightIncrement.amount;
    } else {
      newWeight = currentWeight * (1 + config.weightIncrement.amount / 100);
    }
    
    // Apply weight rounding
    if (config.rounding?.weightIncrement) {
      newWeight = Math.round(newWeight / config.rounding.weightIncrement) * config.rounding.weightIncrement;
    }
    
    return {
      progressionOccurred: true,
      newMaxWeight: newWeight,
      newMaxTime: template.timeRange.min, // Reset to minimum time
      newConsecutiveFailures: 0,
      action: 'progression',
      details: `Time-weight progression: ${currentWeight} @ ${currentTime}s → ${newWeight} @ ${template.timeRange.min}s`
    };
  }
  
  // Time maxed but no weight progression configured
  return {
    progressionOccurred: false,
    newConsecutiveFailures: 0,
    action: 'maintain',
    details: `Time maxed at ${currentTime}s - no weight progression configured`
  };
}

/**
 * Apply deload when failure threshold is reached
 */
function applyDeload(
  config: LinearProgressionConfig | RepProgressionConfig | TimeProgressionConfig,
  currentState: ProgressionState,
  newFailures: number
): ProgressionResult {
  
  if (!config.deload) {
    return {
      progressionOccurred: false,
      newConsecutiveFailures: newFailures,
      action: 'maintain',
      details: 'Deload triggered but no deload configuration found'
    };
  }
  
  const result: ProgressionResult = {
    progressionOccurred: true,
    newConsecutiveFailures: 0, // Reset failures after deload
    action: 'deload',
    details: ''
  };
  
  // Apply deload to weight if exercise uses weight
  if (currentState.maxWeight !== undefined) {
    let newWeight: number;
    if (config.deload.unit === 'absolute') {
      newWeight = Math.max(0, currentState.maxWeight - config.deload.amount);
    } else {
      newWeight = currentState.maxWeight * (1 - config.deload.amount / 100);
    }
    
    result.newMaxWeight = newWeight;
    result.details += `Weight deload: ${currentState.maxWeight} → ${newWeight}. `;
  }
  
  // Apply deload to reps if exercise uses rep progression
  if (isRepProgression(config) && currentState.maxReps !== undefined) {
    // For rep progression, deload typically reduces weight, not reps
    // Reps stay the same unless specifically configured otherwise
    result.newMaxReps = currentState.maxReps;
  }
  
  // Apply deload to time if exercise uses time progression
  if (isTimeProgression(config) && currentState.maxTime !== undefined) {
    // For time progression, can deload time duration
    let newTime: number;
    if (config.deload.unit === 'absolute') {
      newTime = Math.max(0, currentState.maxTime - config.deload.amount);
    } else {
      newTime = currentState.maxTime * (1 - config.deload.amount / 100);
    }
    
    result.newMaxTime = newTime;
    result.details += `Time deload: ${currentState.maxTime}s → ${newTime}s. `;
  }
  
  result.details += `Reset consecutive failures.`;
  
  return result;
}

/**
 * Helper function to round weights to available plate increments
 */
export function roundWeight(weight: number, increment: number = 2.5): number {
  return Math.round(weight / increment) * increment;
}

/**
 * Helper function to round time to sensible increments
 */
export function roundTime(seconds: number, increment: number = 5): number {
  return Math.round(seconds / increment) * increment;
}
