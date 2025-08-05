import { describe, it, expect, beforeEach } from 'vitest';
import { 
  calculateProgression, 
  type ExercisePerformance, 
  type ProgressionState, 
  type ProgressionResult 
} from './progression-engine';
import type { ProgressionConfig } from './types/progression';

/**
 * Unit tests for 5-Day Upper Lower Split Program Progression
 * 
 * Tests the progression logic for all exercises in the program:
 * - Rep progression for compound movements (5-8 reps)
 * - Weight progression when max reps reached
 * - Failure handling and deload logic
 * - Multiple progression scenarios over time
 */

describe('5-Day Upper Lower Split - Progression Tests', () => {
  
  // Common progression configs based on the actual template data
  const repProgressionConfig: ProgressionConfig = {
    type: 'reps',
    incrementType: 'fixed',
    repsIncrement: 1,
    weightIncrement: 5, // When transitioning to weight progression
    weightRoundingIncrement: 5,
    deloadStrategy: 'percentage',
    deloadType: 'percentage',
    deloadAmount: 0.1, // 10% deload
    failureThreshold: 3,
    enableWeightProgression: true, // Enable weight progression when max reps reached
    progressionSets: [3] // Only the 3rd set counts for progression
  };

  const weightProgressionConfig: ProgressionConfig = {
    type: 'linear',
    incrementType: 'fixed',
    weightIncrement: 5,
    weightRoundingIncrement: 5,
    deloadStrategy: 'percentage',
    deloadType: 'percentage',
    deloadAmount: 0.1,
    failureThreshold: 3,
    progressionSets: [3]
  };

  const lightWeightProgressionConfig: ProgressionConfig = {
    type: 'linear',
    incrementType: 'fixed',
    weightIncrement: 2.5,
    weightRoundingIncrement: 2.5,
    deloadStrategy: 'percentage',
    deloadType: 'percentage',
    deloadAmount: 0.1,
    failureThreshold: 3,
    progressionSets: [3]
  };

  describe('Barbell Squat (Upper Days) - Rep Progression', () => {
    const template = { repRange: { min: 5, max: 8 }, load: 1.0 };

    it('should progress reps when completing target reps successfully', () => {
      const currentState: ProgressionState = {
        maxWeight: 150,
        maxReps: 5,
        consecutiveFailures: 0
      };

      const performance: ExercisePerformance = {
        exerciseId: 'barbell-squat',
        sets: [
          { weight: 150, reps: 5, completed: true, failed: false },
          { weight: 150, reps: 5, completed: true, failed: false },
          { weight: 150, reps: 5, completed: true, failed: false } // Progression set
        ]
      };

      const result = calculateProgression(repProgressionConfig, currentState, performance, template);

      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxReps).toBe(6);
      expect(result.newMaxWeight).toBe(150); // Weight stays same
      expect(result.action).toBe('progression');
      expect(result.newConsecutiveFailures).toBe(0);
    });

    it('should progress weight and reset reps when reaching max reps', () => {
      const currentState: ProgressionState = {
        maxWeight: 150,
        maxReps: 8, // At max reps
        consecutiveFailures: 0
      };

      const performance: ExercisePerformance = {
        exerciseId: 'barbell-squat',
        sets: [
          { weight: 150, reps: 8, completed: true, failed: false },
          { weight: 150, reps: 8, completed: true, failed: false },
          { weight: 150, reps: 8, completed: true, failed: false } // Max reps achieved
        ]
      };

      const result = calculateProgression(repProgressionConfig, currentState, performance, template);

      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxWeight).toBe(155); // +5 lbs
      expect(result.newMaxReps).toBe(5); // Reset to min reps
      expect(result.action).toBe('progression');
      expect(result.details).toContain('weight progression');
    });

    it('should handle partial rep completion without progression', () => {
      const currentState: ProgressionState = {
        maxWeight: 150,
        maxReps: 6,
        consecutiveFailures: 0
      };

      const performance: ExercisePerformance = {
        exerciseId: 'barbell-squat',
        sets: [
          { weight: 150, reps: 6, completed: true, failed: false },
          { weight: 150, reps: 6, completed: true, failed: false },
          { weight: 150, reps: 4, completed: true, failed: false } // Failed to hit target
        ]
      };

      const result = calculateProgression(repProgressionConfig, currentState, performance, template);

      expect(result.progressionOccurred).toBe(false);
      expect(result.newMaxReps).toBe(6); // No change
      expect(result.newMaxWeight).toBe(150); // No change
      expect(result.action).toBe('maintain');
    });

    it('should increment failures and eventually deload after 3 failures', () => {
      const currentState: ProgressionState = {
        maxWeight: 150,
        maxReps: 6,
        consecutiveFailures: 2 // Already had 2 failures
      };

      const performance: ExercisePerformance = {
        exerciseId: 'barbell-squat',
        sets: [
          { weight: 150, reps: 6, completed: true, failed: false },
          { weight: 150, reps: 6, completed: true, failed: false },
          { weight: 150, reps: 3, completed: false, failed: true } // Failed set
        ]
      };

      const result = calculateProgression(repProgressionConfig, currentState, performance, template);

      expect(result.action).toBe('deload');
      expect(result.newMaxWeight).toBe(135); // 150 * 0.9 = 135
      expect(result.newConsecutiveFailures).toBe(0); // Reset after deload
      expect(result.details).toContain('deload');
    });

    it('should respect a manual jump in reps and weight', () => {
      const currentState: ProgressionState = {
        maxWeight: 150,
        maxReps: 5,
        consecutiveFailures: 0
      };
      const performance: ExercisePerformance = {
        exerciseId: 'barbell-squat',
        sets: [
          { weight: 160, reps: 8, completed: true, failed: false },
          { weight: 160, reps: 8, completed: true, failed: false },
          { weight: 160, reps: 8, completed: true, failed: false }
        ]
      };
      const template = { repRange: { min: 5, max: 8 }, load: 1.0 };
      const result = calculateProgression(repProgressionConfig, currentState, performance, template);

      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxWeight).toBe(165);  // Should progress to 165lbs (+5)
      expect(result.newMaxReps).toBe(5);     // Should reset to min reps
      expect(result.action).toBe('progression');
    });

    it('should treat a manual jump to more than max reps as weight progression', () => {
      const currentState: ProgressionState = {
        maxWeight: 150,
        maxReps: 5,
        consecutiveFailures: 0
      };
      const performance: ExercisePerformance = {
        exerciseId: 'barbell-squat',
        sets: [
          { weight: 160, reps: 12, completed: true, failed: false },
          { weight: 160, reps: 12, completed: true, failed: false },
          { weight: 160, reps: 12, completed: true, failed: false }
        ]
      };
      const template = { repRange: { min: 5, max: 8 }, load: 1.0 };
      const result = calculateProgression(repProgressionConfig, currentState, performance, template);

      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxWeight).toBe(165);  // Should progress to 165lbs (+5)
      expect(result.newMaxReps).toBe(5);     // Should reset to min reps
      expect(result.action).toBe('progression');
    });
  });

  describe('Barbell Bench Press (Upper Days) - Rep Progression', () => {
    const template = { repRange: { min: 5, max: 8 }, load: 1.0 };

    it('should follow same progression pattern as squat', () => {
      const currentState: ProgressionState = {
        maxWeight: 135,
        maxReps: 7,
        consecutiveFailures: 0
      };

      const performance: ExercisePerformance = {
        exerciseId: 'barbell-bench-press',
        sets: [
          { weight: 135, reps: 7, completed: true, failed: false },
          { weight: 135, reps: 7, completed: true, failed: false },
          { weight: 135, reps: 7, completed: true, failed: false }
        ]
      };

      const result = calculateProgression(repProgressionConfig, currentState, performance, template);

      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxReps).toBe(8);
      expect(result.newMaxWeight).toBe(135);
    });

    it('should progress to weight progression when hitting 8 reps', () => {
      const currentState: ProgressionState = {
        maxWeight: 135,
        maxReps: 8,
        consecutiveFailures: 0
      };

      const performance: ExercisePerformance = {
        exerciseId: 'barbell-bench-press',
        sets: [
          { weight: 135, reps: 8, completed: true, failed: false },
          { weight: 135, reps: 8, completed: true, failed: false },
          { weight: 135, reps: 8, completed: true, failed: false }
        ]
      };

      const result = calculateProgression(repProgressionConfig, currentState, performance, template);

      expect(result.newMaxWeight).toBe(140); // +5 lbs
      expect(result.newMaxReps).toBe(5); // Reset to min
    });
  });

  describe('Cable Lateral Raises - Linear Weight Progression', () => {
    const template = { repRange: { min: 12, max: 15 }, load: 1.0 };

    it('should progress weight when completing all reps successfully', () => {
      const currentState: ProgressionState = {
        maxWeight: 20,
        consecutiveFailures: 0
      };

      const performance: ExercisePerformance = {
        exerciseId: 'cable-lateral-raise',
        sets: [
          { weight: 20, reps: 15, completed: true, failed: false },
          { weight: 20, reps: 15, completed: true, failed: false },
          { weight: 20, reps: 15, completed: true, failed: false }
        ]
      };

      const result = calculateProgression(lightWeightProgressionConfig, currentState, performance, template);

      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxWeight).toBe(22.5); // +2.5 lbs for accessories
      expect(result.action).toBe('progression');
    });

    it('should not progress if failing to complete target reps', () => {
      const currentState: ProgressionState = {
        maxWeight: 20,
        consecutiveFailures: 0
      };

      const performance: ExercisePerformance = {
        exerciseId: 'cable-lateral-raise',
        sets: [
          { weight: 20, reps: 15, completed: true, failed: false },
          { weight: 20, reps: 14, completed: true, failed: false },
          { weight: 20, reps: 12, completed: true, failed: false } // Below target
        ]
      };

      const result = calculateProgression(lightWeightProgressionConfig, currentState, performance, template);

      expect(result.progressionOccurred).toBe(false);
      expect(result.newMaxWeight).toBe(20); // No change
      expect(result.action).toBe('maintain');
    });
  });

  describe('Romanian Deadlift (Lower Days) - Rep Progression', () => {
    const template = { repRange: { min: 8, max: 12 }, load: 1.0 };
    
    const rdlProgressionConfig: ProgressionConfig = {
      ...repProgressionConfig,
      repsIncrement: 1,
      weightIncrement: 10, // Heavier increment for deadlift variation
      progressionSets: [3]
    };

    it('should progress through rep range 8->9->10->11->12', () => {
      const scenarios = [
        { startReps: 8, expectedReps: 9 },
        { startReps: 9, expectedReps: 10 },
        { startReps: 10, expectedReps: 11 },
        { startReps: 11, expectedReps: 12 }
      ];

      scenarios.forEach(({ startReps, expectedReps }) => {
        const currentState: ProgressionState = {
          maxWeight: 185,
          maxReps: startReps,
          consecutiveFailures: 0
        };

        const performance: ExercisePerformance = {
          exerciseId: 'romanian-deadlift',
          sets: [
            { weight: 185, reps: startReps, completed: true, failed: false },
            { weight: 185, reps: startReps, completed: true, failed: false },
            { weight: 185, reps: startReps, completed: true, failed: false }
          ]
        };

        const result = calculateProgression(rdlProgressionConfig, currentState, performance, template);

        expect(result.progressionOccurred).toBe(true);
        expect(result.newMaxReps).toBe(expectedReps);
        expect(result.newMaxWeight).toBe(185);
      });
    });

    it('should progress weight when completing 12 reps', () => {
      const currentState: ProgressionState = {
        maxWeight: 185,
        maxReps: 12,
        consecutiveFailures: 0
      };

      const performance: ExercisePerformance = {
        exerciseId: 'romanian-deadlift',
        sets: [
          { weight: 185, reps: 12, completed: true, failed: false },
          { weight: 185, reps: 12, completed: true, failed: false },
          { weight: 185, reps: 12, completed: true, failed: false }
        ]
      };

      const result = calculateProgression(rdlProgressionConfig, currentState, performance, template);

      expect(result.newMaxWeight).toBe(195); // +10 lbs
      expect(result.newMaxReps).toBe(8); // Reset to min
    });
  });

  describe('Multi-Workout Progression Simulation', () => {
    it('should simulate realistic 8-week progression for squat', () => {
      let currentState: ProgressionState = {
        maxWeight: 150,
        maxReps: 5,
        consecutiveFailures: 0
      };

      const template = { repRange: { min: 5, max: 8 }, load: 1.0 };
      const progressionLog: string[] = [];

      // Simulate 16 workouts (8 weeks, 2x per week)
      for (let workout = 1; workout <= 16; workout++) {
        // Simulate successful completion of target reps
        const performance: ExercisePerformance = {
          exerciseId: 'barbell-squat',
          sets: [
            { weight: currentState.maxWeight!, reps: currentState.maxReps!, completed: true, failed: false },
            { weight: currentState.maxWeight!, reps: currentState.maxReps!, completed: true, failed: false },
            { weight: currentState.maxWeight!, reps: currentState.maxReps!, completed: true, failed: false }
          ]
        };

        const result = calculateProgression(repProgressionConfig, currentState, performance, template);
        
        if (result.progressionOccurred) {
          currentState = {
            maxWeight: result.newMaxWeight ?? currentState.maxWeight,
            maxReps: result.newMaxReps ?? currentState.maxReps,
            consecutiveFailures: result.newConsecutiveFailures
          };
        }

        progressionLog.push(
          `Workout ${workout}: ${currentState.maxWeight}lbs x ${currentState.maxReps} reps`
        );
      }

      // After 16 successful workouts, should have progressed significantly
      expect(currentState.maxWeight).toBeGreaterThan(150);
      expect(progressionLog.length).toBe(16);
      
      // Should have gone through multiple weight progressions
      // Starting at 150x5, should progress: 5->6->7->8 (then +5lbs, back to 5)
      // Then 155x5->6->7->8 (then +5lbs, back to 5), etc.
      console.log('8-Week Squat Progression:');
      progressionLog.forEach(log => console.log(log));
    });

    it('should handle mixed success/failure scenario', () => {
      let currentState: ProgressionState = {
        maxWeight: 185,
        maxReps: 7,
        consecutiveFailures: 0
      };

      const template = { repRange: { min: 5, max: 8 }, load: 1.0 };

      // Workout 1: Success - should progress to 8 reps
      let performance: ExercisePerformance = {
        exerciseId: 'barbell-bench-press',
        sets: [
          { weight: 185, reps: 7, completed: true, failed: false },
          { weight: 185, reps: 7, completed: true, failed: false },
          { weight: 185, reps: 7, completed: true, failed: false }
        ]
      };

      let result = calculateProgression(repProgressionConfig, currentState, performance, template);
      currentState.maxReps = result.newMaxReps ?? currentState.maxReps;
      expect(currentState.maxReps).toBe(8);

      // Workout 2: Success at 8 reps - should progress weight to 190, reps to 5
      performance.sets.forEach(set => set.reps = 8);
      result = calculateProgression(repProgressionConfig, currentState, performance, template);
      currentState.maxWeight = result.newMaxWeight ?? currentState.maxWeight;
      currentState.maxReps = result.newMaxReps ?? currentState.maxReps;
      expect(currentState.maxWeight).toBe(190);
      expect(currentState.maxReps).toBe(5);

      // Workout 3: Failure at new weight - should increment failures
      performance.sets.forEach(set => {
        set.weight = 190;
        set.reps = 3;
        set.failed = true;
      });
      result = calculateProgression(repProgressionConfig, currentState, performance, template);
      currentState.consecutiveFailures = result.newConsecutiveFailures;
      expect(currentState.consecutiveFailures).toBe(1);

      // Workout 4: Another failure - 2 failures total
      result = calculateProgression(repProgressionConfig, currentState, performance, template);
      currentState.consecutiveFailures = result.newConsecutiveFailures;
      expect(currentState.consecutiveFailures).toBe(2);

      // Workout 5: Third failure - should trigger deload
      result = calculateProgression(repProgressionConfig, currentState, performance, template);
      expect(result.action).toBe('deload');
      expect(result.newMaxWeight).toBe(170); // 190 * 0.9 = 171, rounded to 170 (5lb increment)
      expect(result.newConsecutiveFailures).toBe(0);
    });
  });

  describe('Edge Cases and Error Conditions', () => {
    it('should handle missing progression config gracefully', () => {
      const noProgressionConfig: ProgressionConfig = {
        type: 'none'
      };

      const currentState: ProgressionState = {
        maxWeight: 100,
        maxReps: 10,
        consecutiveFailures: 0
      };

      const performance: ExercisePerformance = {
        exerciseId: 'static-exercise',
        sets: [
          { weight: 100, reps: 10, completed: true, failed: false }
        ]
      };

      const result = calculateProgression(noProgressionConfig, currentState, performance, {});

      expect(result.progressionOccurred).toBe(false);
      expect(result.action).toBe('maintain');
      expect(result.details).toContain('no progression');
    });

    it('should handle zero weight scenarios', () => {
      const currentState: ProgressionState = {
        maxWeight: 0,
        maxReps: 10,
        consecutiveFailures: 0
      };

      const performance: ExercisePerformance = {
        exerciseId: 'bodyweight-exercise',
        sets: [
          { weight: 0, reps: 10, completed: true, failed: false },
          { weight: 0, reps: 10, completed: true, failed: false },
          { weight: 0, reps: 10, completed: true, failed: false }
        ]
      };

      const result = calculateProgression(repProgressionConfig, currentState, performance, { repRange: { min: 8, max: 12 } });

      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxReps).toBe(11); // Should still progress reps
    });

    it('should handle progression sets correctly', () => {
      const configWithSpecificSets: ProgressionConfig = {
        ...repProgressionConfig,
        progressionSets: [2, 3] // Only sets 2 and 3 count
      };

      const currentState: ProgressionState = {
        maxWeight: 100,
        maxReps: 6,
        consecutiveFailures: 0
      };

      // First set fails but second and third succeed
      const performance: ExercisePerformance = {
        exerciseId: 'test-exercise',
        sets: [
          { weight: 100, reps: 3, completed: false, failed: true }, // Doesn't count
          { weight: 100, reps: 6, completed: true, failed: false }, // Counts
          { weight: 100, reps: 6, completed: true, failed: false }  // Counts
        ]
      };

      const result = calculateProgression(configWithSpecificSets, currentState, performance, { repRange: { min: 5, max: 8 } });

      expect(result.progressionOccurred).toBe(true); // Should progress because sets 2&3 succeeded
      expect(result.newMaxReps).toBe(7);
    });
  });
});
