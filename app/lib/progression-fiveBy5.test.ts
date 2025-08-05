import { describe, it, expect } from 'vitest';
import { calculateProgression, type ExercisePerformance, type ProgressionState } from './progression-engine';
import type { ProgressionConfig } from './types/progression';

/**
 * 5x5 Linear Progression Test Suite
 *
 * Tests the 5x5 progression logic for squat, bench, row, ohp, and deadlift as defined in templates-fiveBy5.ts
 * - Linear weight progression (fixed increment, 5 reps per set)
 * - Deload after 3 failures
 * - Handles rounding increments
 * - Handles edge cases (overreps, manual jumps, zero weight, etc)
 */

describe('5x5 Linear Progression - Progression Tests', () => {
  // Configs from templates-fiveBy5.ts
  const squatConfig: ProgressionConfig = {
    type: 'linear',
    incrementType: 'fixed',
    weightIncrement: 5,
    weightRoundingIncrement: 2.5,
    deloadStrategy: 'percentage',
    deloadType: 'percentage',
    deloadAmount: 0.1,
    failureThreshold: 3,
  };
  const benchConfig: ProgressionConfig = {
    ...squatConfig,
    weightIncrement: 2.5,
    weightRoundingIncrement: 2.5,
  };
  const rowConfig = benchConfig;
  const ohpConfig = benchConfig;
  const deadliftConfig: ProgressionConfig = {
    ...squatConfig,
    weightIncrement: 10,
    weightRoundingIncrement: 2.5,
  };

  const template = { repRange: { min: 5, max: 5 }, load: 1.0 };

  function makePerformance(weight: number, reps: number = 5): ExercisePerformance {
    return {
      exerciseId: 'test',
      sets: Array(5).fill(0).map(() => ({ weight, reps, completed: true, failed: false }))
    };
  }

  it('should progress squat by +5 lbs each time', () => {
    let state: ProgressionState = { maxWeight: 100, consecutiveFailures: 0 };
    for (let i = 0; i < 5; i++) {
      const perf = makePerformance(state.maxWeight!);
      const result = calculateProgression(squatConfig, state, perf, template);
      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxWeight).toBe(state.maxWeight! + 5);
      state.maxWeight = result.newMaxWeight;
      state.consecutiveFailures = result.newConsecutiveFailures;
    }
  });

  it('should progress bench by +2.5 lbs each time', () => {
    let state: ProgressionState = { maxWeight: 100, consecutiveFailures: 0 };
    for (let i = 0; i < 5; i++) {
      const perf = makePerformance(state.maxWeight!);
      const result = calculateProgression(benchConfig, state, perf, template);
      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxWeight).toBe(state.maxWeight! + 2.5);
      state.maxWeight = result.newMaxWeight;
      state.consecutiveFailures = result.newConsecutiveFailures;
    }
  });

  it('should progress deadlift by +10 lbs each time', () => {
    let state: ProgressionState = { maxWeight: 200, consecutiveFailures: 0 };
    for (let i = 0; i < 3; i++) {
      const perf = makePerformance(state.maxWeight!);
      const result = calculateProgression(deadliftConfig, state, perf, template);
      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxWeight).toBe(state.maxWeight! + 10);
      state.maxWeight = result.newMaxWeight;
      state.consecutiveFailures = result.newConsecutiveFailures;
    }
  });

  it('should round weights to nearest 2.5 increment', () => {
    let state: ProgressionState = { maxWeight: 103, consecutiveFailures: 0 };
    const perf = makePerformance(state.maxWeight!);
    const result = calculateProgression(benchConfig, state, perf, template);
    expect(result.newMaxWeight! % 2.5).toBe(0);
  });

  it('should deload after 3 failures', () => {
    let state: ProgressionState = { maxWeight: 100, consecutiveFailures: 2 };
    // Fail again
    const perf: ExercisePerformance = {
      exerciseId: 'test',
      sets: Array(5).fill(0).map(() => ({ weight: 100, reps: 2, completed: false, failed: true }))
    };
    const result = calculateProgression(squatConfig, state, perf, template);
    expect(result.action).toBe('deload');
    expect(result.newMaxWeight).toBe(90); // 100 * 0.9 = 90
    expect(result.newConsecutiveFailures).toBe(0);
  });

  it('should maintain if not all sets completed', () => {
    let state: ProgressionState = { maxWeight: 100, consecutiveFailures: 0 };
    const perf: ExercisePerformance = {
      exerciseId: 'test',
      sets: [
        { weight: 100, reps: 5, completed: true, failed: false },
        { weight: 100, reps: 5, completed: true, failed: false },
        { weight: 100, reps: 4, completed: false, failed: true },
        { weight: 100, reps: 5, completed: true, failed: false },
        { weight: 100, reps: 5, completed: true, failed: false },
      ]
    };
    const result = calculateProgression(squatConfig, state, perf, template);
    expect(result.progressionOccurred).toBe(false);
    expect(result.action).toBe('maintain');
  });

  it('should handle manual jump to higher weight', () => {
    let state: ProgressionState = { maxWeight: 100, consecutiveFailures: 0 };
    const perf = makePerformance(120);
    const result = calculateProgression(squatConfig, state, perf, template);
    expect(result.progressionOccurred).toBe(true);
    expect(result.newMaxWeight).toBe(125); // 120 + 5
    expect(result.newMaxWeight! % 2.5).toBe(0);
    expect(result.newMaxWeight).toBeGreaterThan(state.maxWeight!);
  });

  it('should handle manual jump to more than 5 reps (should still just progress weight)', () => {
    let state: ProgressionState = { maxWeight: 100, consecutiveFailures: 0 };
    const perf: ExercisePerformance = {
      exerciseId: 'test',
      sets: Array(5).fill(0).map(() => ({ weight: 110, reps: 10, completed: true, failed: false }))
    };
    const result = calculateProgression(squatConfig, state, perf, template);
    expect(result.progressionOccurred).toBe(true);
    expect(result.newMaxWeight).toBe(115); // 110 + 5
    expect(result.newMaxReps).toBe(5); // always reset to 5
  });

  it('should handle zero weight scenario', () => {
    let state: ProgressionState = { maxWeight: 0, consecutiveFailures: 0 };
    const perf = makePerformance(0);
    const result = calculateProgression(squatConfig, state, perf, template);
    expect(result.progressionOccurred).toBe(true);
    expect(result.newMaxWeight).toBe(5); // 0 + 5
  });
});
