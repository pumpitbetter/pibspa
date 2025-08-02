/**
 * Progression Integration Service
 * 
 * Integrates the new 4-type progression system with the existing workout queue.
 * Replaces the old array-based progression logic with the new engine.
 */

import type { MyDatabase } from "~/db/db";
import type { TemplatesDocType } from "~/db/templates";
import type { ProgramExerciseDocType } from "~/db/program-exercises";
import type { ExercisesDocType } from "~/db/exercises";
import type { SettingsDocType } from "~/db/settings";
import { 
  calculateProgression, 
  type ExercisePerformance, 
  type ProgressionState, 
  type ProgressionResult 
} from "./progression-engine";

// Weight calculation result
export interface WeightCalculation {
  weight: number;
  units: string;
  load: number; // Percentage used
  reps?: number; // Current target reps (for rep progression)
}

/**
 * Get current progression state for an exercise in a program
 */
export async function getProgressionState(
  db: MyDatabase,
  programId: string,
  exerciseId: string
): Promise<ProgressionState | null> {
  const programExercise = await db.programExercises.findOne({
    selector: { 
      programId,
      exerciseId 
    }
  }).exec();

  if (!programExercise) {
    return null;
  }

  const doc = programExercise.toMutableJSON();
  return {
    maxWeight: doc.maxWeight,
    maxReps: doc.maxReps,
    maxTime: doc.maxTime,
    consecutiveFailures: doc.consecutiveFailures,
    lastProgressionDate: doc.lastProgressionDate ? new Date(doc.lastProgressionDate) : undefined
  };
}

/**
 * Update progression state in the database
 */
export async function updateProgressionState(
  db: MyDatabase,
  programId: string,
  exerciseId: string,
  result: ProgressionResult
): Promise<void> {
  const programExercise = await db.programExercises.findOne({
    selector: { programId, exerciseId }
  }).exec();

  if (!programExercise) {
    throw new Error(`ProgramExercise not found: ${programId}-${exerciseId}`);
  }

  const updates: Partial<ProgramExerciseDocType> = {
    consecutiveFailures: result.newConsecutiveFailures,
    lastUpdated: new Date().toISOString()
  };

  if (result.progressionOccurred) {
    updates.lastProgressionDate = new Date().toISOString();
  }

  if (result.newMaxWeight !== undefined) {
    updates.maxWeight = result.newMaxWeight;
  }

  if (result.newMaxReps !== undefined) {
    updates.maxReps = result.newMaxReps;
  }

  if (result.newMaxTime !== undefined) {
    updates.maxTime = result.newMaxTime;
  }

  await programExercise.patch(updates);
}

/**
 * Calculate weight for a template based on current progression state
 */
export async function calculateTemplateWeight(
  db: MyDatabase,
  template: TemplatesDocType,
  settings: SettingsDocType,
  exercise: ExercisesDocType,
  exerciseIndex: number = 0 // How many times this exercise has been done (0 = first time, 1 = second time, etc.)
): Promise<WeightCalculation> {
  
  // Get progression state for this exercise
  const state = await getProgressionState(db, template.programId, template.exerciseId);
  
  // If no progression state exists, initialize it for this exercise
  if (!state) {
    // Initialize with default values - this should only happen once per program-exercise
    await initializeProgressionState(
      db, 
      template.programId, 
      template.exerciseId,
      100, // Default weight - you might want to make this configurable
      template.repRange?.min, // Start with min reps if we have a rep range
      undefined
    );
    
    // Get the newly created state
    const newState = await getProgressionState(db, template.programId, template.exerciseId);
    if (newState) {
      return calculateTemplateWeight(db, template, settings, exercise, exerciseIndex); // Recurse with initialized state
    }
  }
  
  // If progression state exists but doesn't have maxReps for rep progression, initialize it
  if (state && template.repRange && state.maxReps === undefined) {
    // Update the existing progression state to include maxReps
    const programExercise = await db.programExercises.findOne({
      selector: { 
        programId: template.programId,
        exerciseId: template.exerciseId 
      }
    }).exec();
    
    if (programExercise) {
      await programExercise.patch({
        maxReps: template.repRange.min
      });
      
      // Recurse with updated state
      return calculateTemplateWeight(db, template, settings, exercise, exerciseIndex);
    }
  }
  
  if (!state?.maxWeight || !template.load) {
    // No progression state or no load specified - use minimal weight
    // But still calculate target reps if we have a rep range
    let targetReps: number | undefined;
    if (template.repRange) {
      targetReps = template.repRange.min; // Start with minimum reps
    }
    
    return {
      weight: getBarWeight(exercise, settings),
      units: settings.weigthUnit || 'lbs',
      load: template.load || 0,
      reps: targetReps
    };
  }

  let baseWeight = state.maxWeight;
  let incrementsToApply = 0;

  // For linear progression, calculate increments to apply
  if (template.progressionConfig?.type === 'linear') {
    const config = template.progressionConfig;
    
    // Check if there's actual workout history (lastProgressionDate exists)
    const hasWorkoutHistory = state.lastProgressionDate !== undefined;
  
    if (!hasWorkoutHistory) {
      // No workout history - use exerciseIndex directly
      incrementsToApply = exerciseIndex;
    } else {
      // Has workout history - calculate based on progression since last update
      // This would require more complex logic to determine progression
      incrementsToApply = exerciseIndex;
    }
    
    // Apply increments to base weight
    if (incrementsToApply > 0 && config.weightIncrement) {
      baseWeight = state.maxWeight + (incrementsToApply * config.weightIncrement);
    }
  }

  // Apply load percentage to the progressed base weight
  const finalTargetWeight = baseWeight * template.load;
  const barWeight = getBarWeight(exercise, settings);
  
  // Find rounding increment - check if this template has progressionConfig, 
  // otherwise use a default rounding increment
  let roundingIncrement = 2.5; // default
  if (template.progressionConfig?.weightRoundingIncrement) {
    roundingIncrement = template.progressionConfig.weightRoundingIncrement;
  }
  
  // Round to nearest increment and ensure minimum bar weight  
  const roundedWeight = roundToIncrement(finalTargetWeight, roundingIncrement);
  const finalWeight = Math.max(roundedWeight, barWeight);

  // Calculate current target reps for rep progression
  let targetReps: number | undefined;
  if (template.repRange) {
    if (template.progressionConfig?.type === 'reps') {
      // For rep progression, use exercise index to calculate progression in the queue
      // The state.maxReps only gets updated after actual workout completion
      const repIncrement = template.progressionConfig.repsIncrement || 1;
      const baseReps = state?.maxReps || template.repRange.min;
      
      // Calculate target reps: base reps + progression from exercise appearances
      targetReps = Math.min(
        baseReps + (exerciseIndex * repIncrement),
        template.repRange.max
      );
      
    } else {
      // Standard progression: use minimum reps
      targetReps = template.repRange.min;
    }
  }

  return {
    weight: finalWeight,
    units: settings.weigthUnit || 'lbs',
    load: template.load,
    reps: targetReps
  };
}

/**
 * Process progression for an exercise after workout completion
 */
export async function processExerciseProgression(
  db: MyDatabase,
  programId: string,
  exerciseId: string,
  performance: ExercisePerformance,
  routineId: string
): Promise<ProgressionResult | null> {
  
  // Get template with progression configuration
  // First try to find a template with progression config for this exercise
  let template = await db.templates.findOne({
    selector: { 
      routineId, 
      exerciseId,
      progressionConfig: { $exists: true }
    }
  }).exec();

  // If no template with progression config found, fall back to any template
  if (!template) {
    template = await db.templates.findOne({
      selector: { routineId, exerciseId }
    }).exec();
  }

  if (!template) {
    console.warn(`No template found for ${routineId}-${exerciseId}`);
    return null;
  }

  const templateDoc = template.toMutableJSON();

  // Check if progression is configured for this template
  if (!templateDoc.progressionConfig) {
    return {
      progressionOccurred: false,
      newConsecutiveFailures: 0,
      action: 'maintain',
      details: 'No progression configuration found for this template'
    };
  }

  const config = templateDoc.progressionConfig;
  const currentState = await getProgressionState(db, programId, exerciseId);

  if (!currentState) {
    console.warn(`No progression state found for ${programId}-${exerciseId}`);
    return null;
  }

  // Template context for progression calculation
  const templateContext = {
    repRange: templateDoc.repRange,
    timeRange: templateDoc.timeRange,
    load: templateDoc.load
  };

  // Calculate progression using the new engine
  const result = calculateProgression(config, currentState, performance, templateContext);

  // Update state in database
  if (result.progressionOccurred || result.newConsecutiveFailures !== currentState.consecutiveFailures) {
    await updateProgressionState(db, programId, exerciseId, result);
  }

  return result;
}

/**
 * Check if an exercise should trigger progression based on template configuration
 */
export async function shouldTriggerProgression(
  db: MyDatabase,
  routineId: string,
  exerciseId: string,
  setOrder?: number
): Promise<boolean> {
  
  // Find template for this routine and exercise
  const template = await db.templates.findOne({
    selector: { 
      routineId,
      exerciseId 
    }
  }).exec();

  if (!template) {
    console.warn(`No template found for ${routineId}-${exerciseId}`);
    return false;
  }

  const templateDoc = template.toMutableJSON();

  // Check if progression is configured for this template
  if (!templateDoc.progressionConfig) {
    return false;
  }

  // If no specific sets are configured, all sets count
  if (!templateDoc.progressionConfig.progressionSets || templateDoc.progressionConfig.progressionSets.length === 0) {
    return true;
  }

  // If a specific set order is provided, check if it's in the progression sets
  if (setOrder !== undefined) {
    return templateDoc.progressionConfig.progressionSets.includes(setOrder);
  }

  // If no set order provided but progression sets are configured, 
  // we can't determine - default to true for safety
  return true;
}

/**
 * Initialize progression state for a new program exercise
 */
/**
 * Manually update progression state - useful for fixing missed progressions
 */
export async function manuallyUpdateProgression(
  db: MyDatabase,
  programId: string,
  exerciseId: string,
  newMaxReps?: number,
  newMaxWeight?: number
): Promise<void> {
  
  const programExercise = await db.programExercises.findOne({
    selector: { 
      programId: programId,
      exerciseId: exerciseId 
    }
  }).exec();

  if (!programExercise) {
    console.error(`No progression state found for ${programId}-${exerciseId}`);
    return;
  }

  const updates: any = {};
  if (newMaxReps !== undefined) {
    updates.maxReps = newMaxReps;
  }
  if (newMaxWeight !== undefined) {
    updates.maxWeight = newMaxWeight;
  }
  updates.lastUpdated = new Date().toISOString();

  await programExercise.patch(updates);
  console.log(`[MANUAL PROGRESSION UPDATE] ${exerciseId}:`, updates);
}

export async function initializeProgressionState(
  db: MyDatabase,
  programId: string,
  exerciseId: string,
  initialMaxWeight?: number,
  initialMaxReps?: number,
  initialMaxTime?: number
): Promise<void> {
  
  const id = `${programId}-${exerciseId}`;
  
  const programExercise: ProgramExerciseDocType = {
    id,
    programId,
    exerciseId,
    maxWeight: initialMaxWeight,
    maxReps: initialMaxReps,
    maxTime: initialMaxTime,
    consecutiveFailures: 0,
    lastUpdated: new Date().toISOString()
  };

  await db.programExercises.upsert(programExercise);
}

/**
 * Get bar weight based on exercise equipment and settings
 */
function getBarWeight(exercise: ExercisesDocType, settings: SettingsDocType): number {
  if (!exercise.equipment?.includes('barbell')) {
    return 0;
  }

  // Use user-configured barbell weight from settings
  // Fallback to 45 (lbs) or 20 (kg) if not set
  const unit = settings.weigthUnit || 'lbs';
  const barbellWeight = settings.barbellWeight;

  if (typeof barbellWeight === 'number' && barbellWeight > 0) {
    return barbellWeight;
  }

  // Fallback defaults
  return unit === 'kg' ? 20 : 45;
}

/**
 * Round weight to nearest increment
 */
function roundToIncrement(weight: number, increment: number): number {
  return Math.round(weight / increment) * increment;
}
