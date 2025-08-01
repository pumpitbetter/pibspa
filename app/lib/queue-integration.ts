/**
 * Queue Integration Utilities
 * 
 * Replaces existing queue progression logic with the new 4-type progression system.
 * Maintains compatibility with existing generateWorkoutsFromRoutines workflow.
 */

import type { MyDatabase } from "~/db/db";
import type { TemplatesDocType } from "~/db/templates";
import type { ExercisesDocType } from "~/db/exercises";
import type { SettingsDocType } from "~/db/settings";
import type { SetsDocType } from "~/db/sets";
import { 
  calculateTemplateWeight,
  processExerciseProgression,
  getProgressionState,
  type WeightCalculation 
} from "./progression-integration";
export type { WeightCalculation } from "./progression-integration";
import type { ExercisePerformance } from "./progression-engine";

/**
 * Enhanced template with calculated weight for workout generation
 */
export interface EnhancedTemplate extends TemplatesDocType {
  calculatedWeight: WeightCalculation;
  exercise: ExercisesDocType;
}

/**
 * Workout performance data for progression calculation
 */
export interface WorkoutPerformance {
  exerciseId: string;
  sets: Array<{
    weight?: number;
    reps?: number;
    duration?: number; // seconds
    completed: boolean;
    rpe?: number;
  }>;
  completed: boolean;
}

/**
 * Replace the old progressProgramExercise function
 * Calculates weights for templates using new progression system
 */
export async function enhanceTemplatesWithProgression(
  db: MyDatabase,
  templates: TemplatesDocType[],
  workoutIndex: number = 0, // 0 = current workout, 1 = next workout, etc.
  exerciseProgressionIndices?: Map<string, number> // Optional exercise-specific indices
): Promise<EnhancedTemplate[]> {
  
  const settings = await db.settings.findOne().exec();
  if (!settings) {
    throw new Error("Settings not found");
  }

  const enhanced: EnhancedTemplate[] = [];
  
  // Group templates by exercise to handle progression per exercise
  const templatesByExercise = new Map<string, TemplatesDocType[]>();
  for (const template of templates) {
    if (!templatesByExercise.has(template.exerciseId)) {
      templatesByExercise.set(template.exerciseId, []);
    }
    templatesByExercise.get(template.exerciseId)!.push(template);
  }

  // Calculate progression per exercise, then apply to all templates
  const progressionIndices = new Map<string, number>();
  const exerciseProgressionConfigs = new Map<string, any>();

  for (const [exerciseId, exerciseTemplates] of templatesByExercise) {
    // Store the progression index for this exercise
    const progressionIndex = exerciseProgressionIndices?.get(exerciseId) ?? workoutIndex;
    progressionIndices.set(exerciseId, progressionIndex);
    
    // Find any template with progressionConfig to share with all templates of this exercise
    const templateWithProgression = exerciseTemplates.find(t => t.progressionConfig);
    if (templateWithProgression?.progressionConfig) {
      exerciseProgressionConfigs.set(exerciseId, templateWithProgression.progressionConfig);
    }
  }

  // Now enhance all templates, calculating weight individually for each template
  for (const template of templates) {
    // Get exercise data
    const exercise = await db.exercises.findOne({
      selector: { id: template.exerciseId }
    }).exec();

    if (!exercise) {
      console.warn(`Exercise not found: ${template.exerciseId}`);
      continue;
    }

    // Get the progression index for this exercise
    const progressionIndex = progressionIndices.get(template.exerciseId) ?? workoutIndex;
    
    // Create a template with shared progression config if this template doesn't have one
    let templateForCalculation = template;
    if (!template.progressionConfig && exerciseProgressionConfigs.has(template.exerciseId)) {
      templateForCalculation = {
        ...template,
        progressionConfig: exerciseProgressionConfigs.get(template.exerciseId)
      };
    }

    // Calculate weight for THIS specific template (with its own load)
    const calculatedWeight = await calculateTemplateWeight(
      db,
      templateForCalculation,
      settings.toMutableJSON(),
      exercise.toMutableJSON(),
      progressionIndex
    );

    enhanced.push({
      ...template,
      calculatedWeight,
      exercise: exercise.toMutableJSON()
    });
  }

  return enhanced;
}

/**
 * Replace the old getProgramExerciseWeight function
 * Gets current weight for an exercise based on progression state
 */
export async function getCurrentExerciseWeight(
  db: MyDatabase,
  programId: string,
  exerciseId: string,
  load: number = 1.0
): Promise<WeightCalculation> {
  
  const settings = await db.settings.findOne().exec();
  const exercise = await db.exercises.findOne({
    selector: { id: exerciseId }
  }).exec();

  if (!settings || !exercise) {
    throw new Error("Required data not found");
  }

  // Create a minimal template for weight calculation
  const template: TemplatesDocType = {
    id: `temp-${programId}-${exerciseId}`,
    programId,
    routineId: programId, // Use programId as routineId for temporary template
    exerciseId,
    load,
    repRange: { min: 1, max: 1 },
    order: 0,
    sequence: 0
  };

  return await calculateTemplateWeight(
    db,
    template,
    settings.toMutableJSON(),
    exercise.toMutableJSON()
  );
}

/**
 * Process workout completion and trigger progression
 * Replaces the progression logic in workout completion handlers
 */
export async function processWorkoutProgression(
  db: MyDatabase,
  programId: string,
  routineId: string,
  workoutPerformances: WorkoutPerformance[]
): Promise<Map<string, { progressionOccurred: boolean; description: string }>> {
  
  const results = new Map<string, { progressionOccurred: boolean; description: string }>();

  for (const performance of workoutPerformances) {
    if (!performance.completed) {
      continue; // Skip incomplete exercises
    }

    try {
      // Convert workout performance to progression engine format
      const exercisePerformance = convertWorkoutToExercisePerformance(performance);
      
      // Process progression
      const result = await processExerciseProgression(
        db,
        programId,
        performance.exerciseId,
        exercisePerformance,
        routineId
      );

      if (result) {
        results.set(performance.exerciseId, {
          progressionOccurred: result.progressionOccurred,
          description: result.details
        });
      } else {
        results.set(performance.exerciseId, {
          progressionOccurred: false,
          description: "No progression configuration found"
        });
      }

    } catch (error) {
      console.error(`Error processing progression for ${performance.exerciseId}:`, error);
      results.set(performance.exerciseId, {
        progressionOccurred: false,
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  return results;
}

/**
 * Get circuit information for grouping (maintains existing functionality)
 */
export function getCircuitInfo(template: TemplatesDocType): { 
  isCircuit: boolean; 
  circuitId: string | null; 
  position: number 
} {
  
  // Circuit detection based on order and sequence fields
  const sequence = template.sequence || 0;
  const isCircuit = sequence > 0;
  const circuitId = isCircuit ? `circuit-${template.order}` : null;
  const position = sequence;

  return {
    isCircuit,
    circuitId,
    position
  };
}

/**
 * Enhanced circuit grouping that maintains existing behavior
 */
export function groupCircuitsIntoSets(
  enhancedTemplates: EnhancedTemplate[]
): Array<{
  id: string;
  type: 'single' | 'circuit';
  templates: EnhancedTemplate[];
}> {
  
  const groups: Array<{
    id: string;
    type: 'single' | 'circuit';
    templates: EnhancedTemplate[];
  }> = [];

  // Group by order (circuit groups)
  const orderGroups = new Map<number, EnhancedTemplate[]>();
  
  for (const template of enhancedTemplates) {
    const order = template.order;
    if (!orderGroups.has(order)) {
      orderGroups.set(order, []);
    }
    orderGroups.get(order)!.push(template);
  }

  // Convert groups to circuit/single format
  for (const [order, templates] of orderGroups) {
    // Sort by sequence within the group
    templates.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
    
    const isCircuit = templates.some(t => (t.sequence || 0) > 0);
    
    groups.push({
      id: isCircuit ? `circuit-${order}` : `single-${order}`,
      type: isCircuit ? 'circuit' : 'single',
      templates
    });
  }

  // Sort groups by order
  groups.sort((a, b) => {
    const aOrder = a.templates[0]?.order || 0;
    const bOrder = b.templates[0]?.order || 0;
    return aOrder - bOrder;
  });

  return groups;
}

/**
 * Helper function to convert workout performance to exercise performance
 */
function convertWorkoutToExercisePerformance(
  workoutPerformance: WorkoutPerformance
): ExercisePerformance {
  
  return {
    exerciseId: workoutPerformance.exerciseId,
    sets: workoutPerformance.sets.map(set => ({
      weight: set.weight,
      reps: set.reps,
      duration: set.duration,
      completed: set.completed,
      failed: !set.completed
    }))
  };
}
