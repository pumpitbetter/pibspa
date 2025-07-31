/**
 * Example Integration with Existing Queue Route
 * 
 * Shows how to replace the existing progression logic in app/routes/app.queue/route.tsx
 * with the new 4-type progression system.
 */

import type { Route } from "../routes/app.queue/+types/route";
import { dbPromise } from "~/db/db";
import { 
  enhanceTemplatesWithProgression,
  groupCircuitsIntoSets,
  processWorkoutProgression,
  type WorkoutPerformance
} from "~/lib/queue-integration";

// Example loader function that replaces existing queue logic
export async function loader({ request }: Route.LoaderArgs) {
  const db = await dbPromise;
  const url = new URL(request.url);
  const routineId = url.searchParams.get("routineId");
  
  if (!routineId) {
    throw new Response("Routine ID required", { status: 400 });
  }

  // Get templates (existing logic)
  const templates = await db.templates.find({
    selector: { routineId }
  }).exec();

  const templateDocs = templates.map(t => t.toMutableJSON());

  // NEW: Enhance templates with progression-calculated weights
  const enhancedTemplates = await enhanceTemplatesWithProgression(db, templateDocs);

  // NEW: Group into circuits using enhanced template structure
  const workoutGroups = groupCircuitsIntoSets(enhancedTemplates);

  return {
    routineId,
    workoutGroups,
    enhancedTemplates // For debugging/inspection
  };
}

// Example action function for workout completion
export async function action({ request }: Route.ActionArgs) {
  const db = await dbPromise;
  const formData = await request.formData();
  
  const programId = formData.get("programId") as string;
  const workoutData = JSON.parse(formData.get("workoutData") as string);
  
  // Convert workout data to progression format
  const workoutPerformances: WorkoutPerformance[] = workoutData.exercises.map((exercise: any) => ({
    exerciseId: exercise.exerciseId,
    sets: exercise.sets.map((set: any) => ({
      weight: set.weight,
      reps: set.reps,
      duration: set.duration,
      completed: set.completed,
      rpe: set.rpe
    })),
    completed: exercise.completed
  }));

  // NEW: Process progression using the new system
  const progressionResults = await processWorkoutProgression(
    db,
    programId,
    workoutPerformances
  );

  // Return results for UI feedback
  return {
    success: true,
    progressionResults: Array.from(progressionResults.entries()).map(([exerciseId, result]) => ({
      exerciseId,
      ...result
    }))
  };
}

/**
 * Key Integration Points for Existing Code:
 * 
 * 1. Replace old progression functions:
 *    - `progressProgramExercise` → `enhanceTemplatesWithProgression`
 *    - `getProgramExerciseWeight` → `getCurrentExerciseWeight`
 *    - Workout completion logic → `processWorkoutProgression`
 * 
 * 2. Use enhanced template structure:
 *    - Access calculated weights via `template.calculatedWeight`
 *    - Circuit grouping via `groupCircuitsIntoSets`
 *    - Exercise data available via `template.exercise`
 * 
 * 3. Migration Strategy:
 *    - Update imports to use new integration utilities
 *    - Replace function calls with new equivalents
 *    - Update component props to use enhanced template structure
 *    - Test progression calculations match expected behavior
 *    - Add progression state initialization for new programs
 * 
 * 4. Example Template Access:
 *    ```typescript
 *    // OLD way
 *    const weight = await getProgramExerciseWeight(db, programId, exerciseId, load);
 *    
 *    // NEW way  
 *    const enhancedTemplates = await enhanceTemplatesWithProgression(db, templates);
 *    const weight = enhancedTemplates[0].calculatedWeight.weight;
 *    ```
 * 
 * 5. Example Progression Processing:
 *    ```typescript
 *    // OLD way
 *    await progressProgramExercise(db, programId, exerciseId, performanceData);
 *    
 *    // NEW way
 *    const results = await processWorkoutProgression(db, programId, workoutPerformances);
 *    ```
 */
