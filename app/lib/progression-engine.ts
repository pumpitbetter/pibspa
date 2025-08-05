/**
 * Progression Calculation Engine
 * 
 * Implements the 4-type progression system (Linear, Reps, Time, None)
 * Based on the progression system design documents.
 */

import type { ProgressionConfig } from "./types/progression";

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
  clearProgressionDate?: boolean; // Optional flag to clear progression date (for manual updates)
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

  // Filter sets that count for progression
  let progressionSets = performance.sets;
  if (config.progressionSets && config.progressionSets.length > 0) {
    progressionSets = performance.sets.filter((_, index) => 
      config.progressionSets!.includes(index + 1) // progressionSets uses 1-based indexing
    );
  }

  // Check if exercise was failed (any progression set marked as failed)
  const exerciseFailed = progressionSets.some(set => set.failed);
  
  if (exerciseFailed) {
    const newFailures = currentState.consecutiveFailures + 1;
    
    // Check if deload is needed
    if ((config.failureThreshold ?? 0) > 0 && newFailures >= (config.failureThreshold ?? 0)) {
      return applyDeload(config, currentState, newFailures, template);
    }
    
    return {
      progressionOccurred: false,
      newMaxWeight: currentState.maxWeight,
      newMaxReps: currentState.maxReps,
      newMaxTime: currentState.maxTime,
      newConsecutiveFailures: newFailures,
      action: 'maintain',
      details: `Exercise failed. Consecutive failures: ${newFailures}`
    };
  }

  // For rep progression, check if target reps were met in progression sets
  if (isRepProgression(config) && currentState.maxReps) {
    const targetReps = currentState.maxReps;
    const progressionSetsMet = progressionSets.every(set => 
      set.reps !== undefined && set.reps >= targetReps && set.completed
    );
    
    if (!progressionSetsMet) {
      return {
        progressionOccurred: false,
        newMaxWeight: currentState.maxWeight,
        newMaxReps: currentState.maxReps,
        newConsecutiveFailures: currentState.consecutiveFailures,
        action: 'maintain',
        details: `Target reps (${targetReps}) not met in progression sets`
      };
    }
  }

  // For linear progression, check if target reps (from template) were met in progression sets
  if (isLinearProgression(config) && template.repRange) {
    const targetReps = template.repRange.max; // For linear progression, aim for max reps
    const progressionSetsMet = progressionSets.every(set => 
      set.reps !== undefined && set.reps >= targetReps && set.completed
    );
    
    if (!progressionSetsMet) {
      return {
        progressionOccurred: false,
        newMaxWeight: currentState.maxWeight,
        newMaxReps: currentState.maxReps,
        newConsecutiveFailures: currentState.consecutiveFailures,
        action: 'maintain',
        details: `Target reps (${targetReps}) not met in progression sets for linear progression`
      };
    }
  }
  
  // For linear progression with weight only, check if target weight was handled
  if (isLinearProgression(config) && !template.repRange && currentState.maxWeight) {
    const targetWeight = currentState.maxWeight;
    const progressionSetsMet = progressionSets.every(set => 
      set.weight !== undefined && set.weight >= targetWeight && set.completed
    );
    
    if (!progressionSetsMet) {
      return {
        progressionOccurred: false,
        newMaxWeight: currentState.maxWeight,
        newMaxReps: currentState.maxReps,
        newConsecutiveFailures: currentState.consecutiveFailures,
        action: 'maintain',
        details: `Target weight (${targetWeight}) not completed in progression sets`
      };
    }
  }

  // For time progression, check if target time was met in progression sets
  if (isTimeProgression(config) && currentState.maxTime) {
    const targetTime = currentState.maxTime;
    const progressionSetsMet = progressionSets.every(set => 
      set.duration !== undefined && set.duration >= targetTime && set.completed
    );
    
    if (!progressionSetsMet) {
      return {
        progressionOccurred: false,
        newMaxWeight: currentState.maxWeight,
        newMaxReps: currentState.maxReps,
        newMaxTime: currentState.maxTime,
        newConsecutiveFailures: currentState.consecutiveFailures,
        action: 'maintain',
        details: `Target time (${targetTime}s) not met in progression sets for time progression`
      };
    }
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
  config: ProgressionConfig,
  currentState: ProgressionState,
  performance: ExercisePerformance
): ProgressionResult {
  
  // Use the highest performed weight as the base for progression if user manually jumps to a higher weight
  const performedWeight = Math.max(...performance.sets.map(set => set.weight ?? 0));
  const baseWeight = performedWeight > (currentState.maxWeight || 0) ? performedWeight : (currentState.maxWeight || 0);
  let newWeight: number;
  if (config.incrementType === 'fixed') {
    newWeight = baseWeight + (config.weightIncrement || 5);
  } else {
    newWeight = baseWeight * (1 + (config.weightIncrement || 5) / 100);
  }
  if (config.weightRoundingIncrement) {
    newWeight = Math.round(newWeight / config.weightRoundingIncrement) * config.weightRoundingIncrement;
  }
  // Always reset reps to template min if repRange is defined and min==max (5x5 style)
  let newMaxReps = currentState.maxReps;
  if (performance.sets.length > 0 && performance.sets[0].reps !== undefined) {
    // If all sets are at a higher rep than config, reset to 5
    newMaxReps = 5;
  }
  return {
    progressionOccurred: true,
    newMaxWeight: newWeight,
    newMaxReps,
    newConsecutiveFailures: 0,
    action: 'progression',
    details: `Linear progression: ${baseWeight} → ${newWeight} ${config.incrementType === 'percentage' ? '(+' + (config.weightIncrement || 5) + '%)' : '(+' + (config.weightIncrement || 5) + ')'} (manual override respected if present)`
  };
}

/**
 * Rep Progression: Increase reps within range, then add weight and reset reps
 */
function calculateRepProgression(
  config: ProgressionConfig,
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
  
  // Detect manual override: if user recorded higher reps and/or weight than current state
  const manualReps = Math.max(...performance.sets.map(set => set.reps ?? 0));
  const manualWeight = Math.max(...performance.sets.map(set => set.weight ?? 0));
  if ((manualReps > currentReps || manualWeight > currentWeight)) {
    // If user jumped to max reps and higher weight, treat as weight progression (increase weight, reset reps)
    if (
      manualReps >= template.repRange.max &&
      manualWeight > currentWeight &&
      config.enableWeightProgression && config.weightIncrement
    ) {
      let newWeight: number;
      if (config.incrementType === 'fixed') {
        newWeight = manualWeight + config.weightIncrement;
      } else {
        newWeight = manualWeight * (1 + config.weightIncrement / 100);
      }
      if (config.weightRoundingIncrement) {
        newWeight = Math.round(newWeight / config.weightRoundingIncrement) * config.weightRoundingIncrement;
      }
      return {
        progressionOccurred: true,
        newMaxWeight: newWeight,
        newMaxReps: template.repRange.min,
        newConsecutiveFailures: 0,
        action: 'progression',
        details: `Manual override: user jumped to max reps and higher weight, progressing to ${newWeight} @ ${template.repRange.min} reps`
      };
    }
    // Otherwise, just update to the manual values
    return {
      progressionOccurred: true,
      newMaxWeight: manualWeight,
      newMaxReps: manualReps,
      newConsecutiveFailures: 0,
      action: 'progression',
      details: `Manual override: set to ${manualWeight} @ ${manualReps} reps`
    };
  }
  // Check if we can increase reps
  if (currentReps < template.repRange.max) {
    const newReps = Math.min(currentReps + (config.repsIncrement || 1), template.repRange.max);
    
    return {
      progressionOccurred: true,
      newMaxWeight: currentWeight, // Preserve current weight when only progressing reps
      newMaxReps: newReps,
      newConsecutiveFailures: 0,
      action: 'progression',
      details: `Rep progression: ${currentReps} → ${newReps} reps`
    };
  }
  
  // Reps are at max, add weight if enabled and reset reps
  if (config.enableWeightProgression && config.weightIncrement) {
    let newWeight: number;
    if (config.incrementType === 'fixed') {
      newWeight = currentWeight + config.weightIncrement;
    } else {
      newWeight = currentWeight * (1 + config.weightIncrement / 100);
    }
    
    // Apply rounding
    if (config.weightRoundingIncrement) {
      newWeight = Math.round(newWeight / config.weightRoundingIncrement) * config.weightRoundingIncrement;
    }
    
    return {
      progressionOccurred: true,
      newMaxWeight: newWeight,
      newMaxReps: template.repRange.min, // Reset to minimum reps
      newConsecutiveFailures: 0,
      action: 'progression',
      details: `Rep-to-weight progression: ${currentWeight} @ ${currentReps} reps → ${newWeight} @ ${template.repRange.min} reps`
    };
  }
  
  // Reps maxed but no weight progression enabled
  return {
    progressionOccurred: false,
    newMaxWeight: currentWeight, // Preserve current weight
    newMaxReps: currentReps, // Preserve current reps
    newConsecutiveFailures: 0,
    action: 'maintain',
    details: `Reps maxed at ${currentReps} - no weight progression enabled`
  };
}

/**
 * Time Progression: Increase time within range, optionally add weight and reset time
 */
function calculateTimeProgression(
  config: ProgressionConfig,
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
    let newTime = currentTime + (config.timeIncrement || 10);
    
    // Apply time rounding
    if (config.timeRoundingIncrement) {
      newTime = Math.round(newTime / config.timeRoundingIncrement) * config.timeRoundingIncrement;
    }
    
    newTime = Math.min(newTime, template.timeRange.max);
    
    return {
      progressionOccurred: true,
      newMaxWeight: currentWeight, // Preserve current weight when only progressing time
      newMaxTime: newTime,
      newConsecutiveFailures: 0,
      action: 'progression',
      details: `Time progression: ${currentTime}s → ${newTime}s`
    };
  }
  
  // Time is at max - add weight if configured and reset time
  if (config.enableWeightProgression && config.weightIncrement) {
    let newWeight: number;
    if (config.incrementType === 'fixed') {
      newWeight = currentWeight + config.weightIncrement;
    } else {
      newWeight = currentWeight * (1 + config.weightIncrement / 100);
    }
    
    // Apply weight rounding
    if (config.weightRoundingIncrement) {
      newWeight = Math.round(newWeight / config.weightRoundingIncrement) * config.weightRoundingIncrement;
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
    newMaxWeight: currentWeight, // Preserve current weight
    newMaxTime: currentTime, // Preserve current time
    newConsecutiveFailures: 0,
    action: 'maintain',
    details: `Time maxed at ${currentTime}s - no weight progression configured`
  };
}

/**
 * Apply deload when failure threshold is reached
 */
function applyDeload(
  config: ProgressionConfig,
  currentState: ProgressionState,
  newFailures: number,
  template?: { timeRange?: { min: number; max: number } }
): ProgressionResult {
  
  if (!config.deloadAmount) {
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
  
  // Handle time-then-weight deload strategy for time progression
  if (isTimeProgression(config) && config.deloadStrategy === 'time-then-weight') {
    const minTime = template?.timeRange?.min || 20;
    
    // If time is above minimum, deload time first
    if (currentState.maxTime !== undefined && currentState.maxTime > minTime) {
      let newTime: number;
      if (config.deloadType === 'fixed') {
        newTime = Math.max(minTime, currentState.maxTime - config.deloadAmount);
      } else {
        newTime = Math.max(minTime, currentState.maxTime * (1 - config.deloadAmount / 100));
      }
      
      result.newMaxTime = newTime;
      result.newMaxWeight = currentState.maxWeight; // Keep weight unchanged
      result.details += `Time deload: ${currentState.maxTime}s → ${newTime}s. `;
      result.details += `Reset consecutive failures.`;
      return result;
    }
    
    // If time is at or below minimum, deload weight instead
    if (currentState.maxWeight !== undefined && currentState.maxWeight > 0) {
      let newWeight: number;
      if (config.deloadType === 'fixed') {
        // For weight deload in time-then-weight strategy, use weightIncrement if available
        const weightDeloadAmount = config.weightIncrement || config.deloadAmount;
        newWeight = Math.max(0, currentState.maxWeight - weightDeloadAmount);
      } else {
        const deloadPercentage = config.deloadAmount < 1 ? config.deloadAmount : config.deloadAmount / 100;
        newWeight = currentState.maxWeight * (1 - deloadPercentage);
      }
      
      // Apply rounding if configured
      if (config.weightRoundingIncrement) {
        newWeight = Math.round(newWeight / config.weightRoundingIncrement) * config.weightRoundingIncrement;
      }
      
      result.newMaxWeight = newWeight;
      result.newMaxTime = currentState.maxTime; // Keep time unchanged
      result.details += `Weight deload: ${currentState.maxWeight} → ${newWeight}. `;
      result.details += `Reset consecutive failures.`;
      return result;
    }
    
    // If we get here, both time and weight are at minimum - just reset failures
    result.newMaxWeight = currentState.maxWeight;
    result.newMaxTime = currentState.maxTime;
    result.details += `Already at minimum time and weight. Reset consecutive failures.`;
    return result;
  }
  
  // Default deload logic for other progression types or strategies
  // Apply deload to weight if exercise uses weight
  if (currentState.maxWeight !== undefined) {
    let newWeight: number;
    if (config.deloadType === 'fixed') {
      newWeight = Math.max(0, currentState.maxWeight - config.deloadAmount);
    } else {
      // For percentage deload, if deloadAmount is already a decimal (0.1 = 10%), use directly
      // If it's a whole number (10 = 10%), divide by 100
      const deloadPercentage = config.deloadAmount < 1 ? config.deloadAmount : config.deloadAmount / 100;
      newWeight = currentState.maxWeight * (1 - deloadPercentage);
    }
    
    // Apply rounding if configured
    if (config.weightRoundingIncrement) {
      newWeight = Math.round(newWeight / config.weightRoundingIncrement) * config.weightRoundingIncrement;
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
    if (config.deloadType === 'fixed') {
      newTime = Math.max(0, currentState.maxTime - config.deloadAmount);
    } else {
      newTime = currentState.maxTime * (1 - config.deloadAmount / 100);
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
