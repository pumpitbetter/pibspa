import { describe, it, expect } from 'vitest';
import { calculateProgression, type ExercisePerformance, type ProgressionState } from './progression-engine';
import type { ProgressionConfig } from './types/progression';

/**
 * Double Progression (Time → Weight) Test Suite
 *
 * Simulates a plank exercise with double progression:
 * - Start: 20s isometric hold, 0 lbs
 * - Time progression: +10s per success, up to 60s max
 * - At 60s: add 5 lbs, reset to 20s
 * - Deload after 3 failures (time first, then weight)
 * - Rounds to nearest 2.5 lbs
 */

describe('Double Progression (Time → Weight) - Plank Exercise', () => {
  const plankConfig: ProgressionConfig = {
    type: 'time',
    incrementType: 'fixed',
    timeIncrement: 10,
    weightIncrement: 5,
    weightRoundingIncrement: 2.5,
    enableWeightProgression: true,
    deloadStrategy: 'time-then-weight',
    deloadType: 'fixed',
    deloadAmount: 10, // 10s or 5 lbs depending on what's being deloaded
    failureThreshold: 3,
  };

  const template = { 
    timeRange: { min: 20, max: 60 }, 
    load: 1.0 
  };

  function makeSuccessfulPerformance(weight: number, time: number): ExercisePerformance {
    return {
      exerciseId: 'plank',
      sets: [
        { weight, duration: time, completed: true, failed: false }
      ]
    };
  }

  function makeFailedPerformance(weight: number, time: number): ExercisePerformance {
    return {
      exerciseId: 'plank',
      sets: [
        { weight, duration: time, completed: false, failed: true }
      ]
    };
  }

  describe('Time Progression Phase', () => {
    it('should progress time from 20s to 30s on first success', () => {
      const state: ProgressionState = { 
        maxWeight: 0, 
        maxTime: 20, 
        consecutiveFailures: 0 
      };
      
      const performance = makeSuccessfulPerformance(0, 20);
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxTime).toBe(30);
      expect(result.newMaxWeight).toBe(0);
      expect(result.action).toBe('progression');
      expect(result.details).toContain('Time progression: 20s → 30s');
    });

    it('should progress time incrementally: 30s → 40s → 50s → 60s', () => {
      let state: ProgressionState = { 
        maxWeight: 0, 
        maxTime: 30, 
        consecutiveFailures: 0 
      };

      // Test each progression step
      const expectedTimes = [40, 50, 60];
      
      for (const expectedTime of expectedTimes) {
        const performance = makeSuccessfulPerformance(state.maxWeight!, state.maxTime!);
        const result = calculateProgression(plankConfig, state, performance, template);
        
        expect(result.progressionOccurred).toBe(true);
        expect(result.newMaxTime).toBe(expectedTime);
        expect(result.newMaxWeight).toBe(state.maxWeight);
        expect(result.newConsecutiveFailures).toBe(0);
        
        // Update state for next iteration
        state = {
          maxWeight: result.newMaxWeight ?? state.maxWeight,
          maxTime: result.newMaxTime,
          consecutiveFailures: result.newConsecutiveFailures
        };
      }
    });

    it('should not progress beyond 60s time limit', () => {
      const state: ProgressionState = { 
        maxWeight: 0, 
        maxTime: 60, 
        consecutiveFailures: 0 
      };
      
      const performance = makeSuccessfulPerformance(0, 60);
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxTime).toBe(20); // Reset to minimum
      expect(result.newMaxWeight).toBe(5); // Add weight
      expect(result.action).toBe('progression');
      expect(result.details).toContain('Time-weight progression');
    });
  });

  describe('Weight Progression Phase', () => {
    it('should add weight and reset time when reaching 60s', () => {
      const state: ProgressionState = { 
        maxWeight: 0, 
        maxTime: 60, 
        consecutiveFailures: 0 
      };
      
      const performance = makeSuccessfulPerformance(0, 60);
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxWeight).toBe(5);
      expect(result.newMaxTime).toBe(20);
      expect(result.action).toBe('progression');
      expect(result.details).toContain('0 @ 60s → 5 @ 20s');
    });

    it('should continue time progression at new weight level', () => {
      let state: ProgressionState = { 
        maxWeight: 5, 
        maxTime: 20, 
        consecutiveFailures: 0 
      };

      // Progress through time again with added weight
      const expectedProgressions = [
        { from: 20, to: 30, weight: 5 },
        { from: 30, to: 40, weight: 5 },
        { from: 40, to: 50, weight: 5 },
        { from: 50, to: 60, weight: 5 }
      ];

      for (const progression of expectedProgressions) {
        const performance = makeSuccessfulPerformance(progression.weight, progression.from);
        const result = calculateProgression(plankConfig, state, performance, template);
        
        expect(result.progressionOccurred).toBe(true);
        expect(result.newMaxTime).toBe(progression.to);
        expect(result.newMaxWeight).toBe(progression.weight);
        
        state = {
          maxWeight: result.newMaxWeight ?? state.maxWeight,
          maxTime: result.newMaxTime,
          consecutiveFailures: result.newConsecutiveFailures
        };
      }
    });

    it('should add more weight after reaching 60s again', () => {
      const state: ProgressionState = { 
        maxWeight: 5, 
        maxTime: 60, 
        consecutiveFailures: 0 
      };
      
      const performance = makeSuccessfulPerformance(5, 60);
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxWeight).toBe(10);
      expect(result.newMaxTime).toBe(20);
      expect(result.action).toBe('progression');
    });

    it('should round weight to nearest 2.5 lbs increment', () => {
      // Start with an odd weight that needs rounding
      const state: ProgressionState = { 
        maxWeight: 7, 
        maxTime: 60, 
        consecutiveFailures: 0 
      };
      
      const performance = makeSuccessfulPerformance(7, 60);
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.newMaxWeight! % 2.5).toBe(0);
      expect(result.newMaxWeight).toBe(12.5); // 7 + 5 = 12, rounded to 12.5
    });
  });

  describe('Failure and Deload Scenarios', () => {
    it('should track consecutive failures without deloading below threshold', () => {
      let state: ProgressionState = { 
        maxWeight: 0, 
        maxTime: 40, 
        consecutiveFailures: 0 
      };

      // First failure
      let performance = makeFailedPerformance(0, 40);
      let result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.progressionOccurred).toBe(false);
      expect(result.newConsecutiveFailures).toBe(1);
      expect(result.action).toBe('maintain');
      expect(result.newMaxTime).toBe(40); // No change

      // Second failure
      state.consecutiveFailures = result.newConsecutiveFailures;
      performance = makeFailedPerformance(0, 40);
      result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.progressionOccurred).toBe(false);
      expect(result.newConsecutiveFailures).toBe(2);
      expect(result.action).toBe('maintain');
      expect(result.newMaxTime).toBe(40); // Still no change
    });

    it('should deload time after 3 consecutive failures', () => {
      const state: ProgressionState = { 
        maxWeight: 0, 
        maxTime: 40, 
        consecutiveFailures: 2 // Already have 2 failures
      };
      
      const performance = makeFailedPerformance(0, 40);
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.action).toBe('deload');
      expect(result.newMaxTime).toBe(30); // 40 - 10
      expect(result.newMaxWeight).toBe(0); // Weight unchanged
      expect(result.newConsecutiveFailures).toBe(0); // Reset after deload
      expect(result.details).toContain('Time deload: 40s → 30s');
    });

    it('should deload weight when time is at minimum and 3 failures occur', () => {
      const state: ProgressionState = { 
        maxWeight: 10, 
        maxTime: 20, // Already at minimum time
        consecutiveFailures: 2 
      };
      
      const performance = makeFailedPerformance(10, 20);
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.action).toBe('deload');
      expect(result.newMaxWeight).toBe(5); // 10 - 5, rounded to 2.5 increment
      expect(result.newMaxTime).toBe(20); // Time stays at minimum
      expect(result.newConsecutiveFailures).toBe(0);
      expect(result.details).toContain('Weight deload: 10 → 5');
    });

    it('should not deload weight below 0', () => {
      const state: ProgressionState = { 
        maxWeight: 2.5, 
        maxTime: 20, // Already at minimum time
        consecutiveFailures: 2 
      };
      
      const performance = makeFailedPerformance(2.5, 20);
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.action).toBe('deload');
      expect(result.newMaxWeight).toBe(0); // Can't go below 0
      expect(result.newMaxTime).toBe(20); // Time stays at minimum
    });

    it('should reset consecutive failures after successful progression', () => {
      const state: ProgressionState = { 
        maxWeight: 0, 
        maxTime: 30, 
        consecutiveFailures: 2 // Had some failures
      };
      
      const performance = makeSuccessfulPerformance(0, 30);
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.progressionOccurred).toBe(true);
      expect(result.newConsecutiveFailures).toBe(0); // Reset on success
      expect(result.newMaxTime).toBe(40);
    });
  });

  describe('Edge Cases', () => {
    it('should handle starting state with no previous progression', () => {
      const state: ProgressionState = { 
        consecutiveFailures: 0 
        // No maxWeight or maxTime set
      };
      
      const performance = makeSuccessfulPerformance(0, 20);
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxTime).toBe(30); // 20 + 10
      expect(result.newMaxWeight).toBe(0);
    });

    it('should maintain state when exercise is not completed but not failed', () => {
      const state: ProgressionState = { 
        maxWeight: 5, 
        maxTime: 30, 
        consecutiveFailures: 0 
      };
      
      const performance: ExercisePerformance = {
        exerciseId: 'plank',
        sets: [
          { weight: 5, duration: 25, completed: false, failed: false } // Incomplete but not failed
        ]
      };
      
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.progressionOccurred).toBe(false);
      expect(result.action).toBe('maintain');
      expect(result.newMaxTime).toBe(30); // No change
      expect(result.newMaxWeight).toBe(5); // No change
    });

    it('should handle multiple sets with mixed results', () => {
      const state: ProgressionState = { 
        maxWeight: 0, 
        maxTime: 30, 
        consecutiveFailures: 0 
      };
      
      const performance: ExercisePerformance = {
        exerciseId: 'plank',
        sets: [
          { weight: 0, duration: 30, completed: true, failed: false },
          { weight: 0, duration: 25, completed: false, failed: true }, // One failed set
          { weight: 0, duration: 30, completed: true, failed: false }
        ]
      };
      
      const result = calculateProgression(plankConfig, state, performance, template);
      
      expect(result.progressionOccurred).toBe(false);
      expect(result.action).toBe('maintain');
      expect(result.newConsecutiveFailures).toBe(1); // Failure counted
    });
  });

  describe('Configuration Variations', () => {
    it('should work with different time increments', () => {
      const customConfig: ProgressionConfig = {
        ...plankConfig,
        timeIncrement: 5 // Smaller increment
      };
      
      const state: ProgressionState = { 
        maxWeight: 0, 
        maxTime: 20, 
        consecutiveFailures: 0 
      };
      
      const performance = makeSuccessfulPerformance(0, 20);
      const result = calculateProgression(customConfig, state, performance, template);
      
      expect(result.newMaxTime).toBe(25); // 20 + 5
    });

    it('should work with different weight increments', () => {
      const customConfig: ProgressionConfig = {
        ...plankConfig,
        weightIncrement: 2.5 // Smaller weight jump
      };
      
      const state: ProgressionState = { 
        maxWeight: 0, 
        maxTime: 60, 
        consecutiveFailures: 0 
      };
      
      const performance = makeSuccessfulPerformance(0, 60);
      const result = calculateProgression(customConfig, state, performance, template);
      
      expect(result.newMaxWeight).toBe(2.5); // 0 + 2.5
    });

    it('should work with different failure thresholds', () => {
      const customConfig: ProgressionConfig = {
        ...plankConfig,
        failureThreshold: 2 // Deload after 2 failures instead of 3
      };
      
      const state: ProgressionState = { 
        maxWeight: 0, 
        maxTime: 40, 
        consecutiveFailures: 1 // One failure already
      };
      
      const performance = makeFailedPerformance(0, 40);
      const result = calculateProgression(customConfig, state, performance, template);
      
      expect(result.action).toBe('deload'); // Should deload after 2 failures
      expect(result.newMaxTime).toBe(30);
    });
  });
});
