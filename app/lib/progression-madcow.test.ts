import { describe, it, expect } from 'vitest';
import { calculateProgression, type ExercisePerformance, type ProgressionState } from './progression-engine';
import type { ProgressionConfig } from './types/progression';

/**
 * Madcow 5x5 Progression Test Suite
 *
 * Simulates the progression logic for Madcow 5x5 as defined in templates-madcow.ts
 * - Linear weight progression (fixed increment, 5 reps per set)
 * - Deload after 3 failures
 * - Handles rounding increments
 * - Handles edge cases (manual jumps, overreps, zero weight, etc)
 */

describe('Madcow 5x5 - Progression Tests', () => {
  it('should only progress if the top (last) set is completed in ramping sets', () => {
    let state: ProgressionState = { maxWeight: 100, consecutiveFailures: 0 };
    // Ramping sets: 80, 90, 95, 98, 100 (top set)
    const perf = {
      exerciseId: 'barbell-squat',
      sets: [
        { weight: 80, reps: 5, completed: true, failed: false },
        { weight: 90, reps: 5, completed: true, failed: false },
        { weight: 95, reps: 5, completed: true, failed: false },
        { weight: 98, reps: 5, completed: true, failed: false },
        { weight: 100, reps: 5, completed: true, failed: false }, // top set
      ]
    };
    const result = calculateProgression(squatConfig, state, perf, template5);
    expect(result.progressionOccurred).toBe(true);
    expect(result.newMaxWeight).toBe(105); // 100 + 5
  });

  it('should NOT progress if the top (last) set is failed in ramping sets', () => {
    let state: ProgressionState = { maxWeight: 100, consecutiveFailures: 0 };
    // Ramping sets: 80, 90, 95, 98, 100 (top set failed)
    const perf = {
      exerciseId: 'barbell-squat',
      sets: [
        { weight: 80, reps: 5, completed: true, failed: false },
        { weight: 90, reps: 5, completed: true, failed: false },
        { weight: 95, reps: 5, completed: true, failed: false },
        { weight: 98, reps: 5, completed: true, failed: false },
        { weight: 100, reps: 4, completed: false, failed: true }, // top set failed
      ]
    };
    const result = calculateProgression(squatConfig, state, perf, template5);
    expect(result.progressionOccurred).toBe(false);
    expect(result.newMaxWeight).toBe(100); // no change
    expect(result.action).toBe('maintain');
  });
  // Configs from templates-madcow.ts
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
  const dipsConfig: ProgressionConfig = {
    ...squatConfig,
    weightIncrement: 5,
    weightRoundingIncrement: 2.5,
  };
  const kneeRaiseConfig: ProgressionConfig = {
    type: 'reps',
    incrementType: 'fixed',
    repsIncrement: 1,
    enableWeightProgression: true,
    weightIncrement: 5,
    weightRoundingIncrement: 2.5,
    deloadStrategy: 'percentage',
    deloadType: 'percentage',
    deloadAmount: 0.1,
    failureThreshold: 3,
  };

  const template5 = { repRange: { min: 5, max: 5 }, load: 1.0 };
  const template8 = { repRange: { min: 8, max: 8 }, load: 1.0 };
  const templateKneeRaise = { repRange: { min: 3, max: 10 }, load: 1.0 };

  function makePerformance(weight: number, reps: number = 5, sets: number = 5): ExercisePerformance {
    return {
      exerciseId: 'test',
      sets: Array(sets).fill(0).map(() => ({ weight, reps, completed: true, failed: false }))
    };
  }

  it('should progress squat by +5 lbs each time', () => {
    let state: ProgressionState = { maxWeight: 100, consecutiveFailures: 0 };
    for (let i = 0; i < 5; i++) {
      const perf = makePerformance(state.maxWeight!);
      const result = calculateProgression(squatConfig, state, perf, template5);
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
      const result = calculateProgression(benchConfig, state, perf, template5);
      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxWeight).toBe(state.maxWeight! + 2.5);
      state.maxWeight = result.newMaxWeight;
      state.consecutiveFailures = result.newConsecutiveFailures;
    }
  });

  it('should progress dips by +5 lbs each time (8 reps)', () => {
    let state: ProgressionState = { maxWeight: 50, consecutiveFailures: 0 };
    for (let i = 0; i < 3; i++) {
      const perf = makePerformance(state.maxWeight!, 8, 3);
      const result = calculateProgression(dipsConfig, state, perf, template8);
      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxWeight).toBe(state.maxWeight! + 5);
      state.maxWeight = result.newMaxWeight;
      state.consecutiveFailures = result.newConsecutiveFailures;
    }
  });

  it('should progress knee raise reps up to 10, then add weight and reset reps', () => {
    let state: ProgressionState = { maxWeight: 0, maxReps: 3, consecutiveFailures: 0 };
    for (let reps = 3; reps < 10; reps++) {
      const perf = makePerformance(state.maxWeight!, reps, 3);
      const result = calculateProgression(kneeRaiseConfig, state, perf, templateKneeRaise);
      expect(result.progressionOccurred).toBe(true);
      expect(result.newMaxReps).toBe(reps + 1 <= 10 ? reps + 1 : 3);
      state.maxReps = result.newMaxReps;
      state.maxWeight = result.newMaxWeight ?? state.maxWeight;
      state.consecutiveFailures = result.newConsecutiveFailures;
    }
    // Now at 10 reps, next should add weight and reset reps
    const perf = makePerformance(state.maxWeight!, 10, 3);
    const result = calculateProgression(kneeRaiseConfig, state, perf, templateKneeRaise);
    expect(result.progressionOccurred).toBe(true);
    expect(result.newMaxWeight).toBe(5);
    expect(result.newMaxReps).toBe(3);
  });

  it('should round weights to nearest 2.5 increment', () => {
    let state: ProgressionState = { maxWeight: 103, consecutiveFailures: 0 };
    const perf = makePerformance(state.maxWeight!);
    const result = calculateProgression(benchConfig, state, perf, template5);
    expect(result.newMaxWeight! % 2.5).toBe(0);
  });

  it('should deload after 3 failures', () => {
    let state: ProgressionState = { maxWeight: 100, consecutiveFailures: 2 };
    // Fail again
    const perf: ExercisePerformance = {
      exerciseId: 'test',
      sets: Array(5).fill(0).map(() => ({ weight: 100, reps: 2, completed: false, failed: true }))
    };
    const result = calculateProgression(squatConfig, state, perf, template5);
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
    const result = calculateProgression(squatConfig, state, perf, template5);
    expect(result.progressionOccurred).toBe(false);
    expect(result.action).toBe('maintain');
  });

  it('should handle manual jump to higher weight', () => {
    let state: ProgressionState = { maxWeight: 100, consecutiveFailures: 0 };
    const perf = makePerformance(120);
    const result = calculateProgression(squatConfig, state, perf, template5);
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
    const result = calculateProgression(squatConfig, state, perf, template5);
    expect(result.progressionOccurred).toBe(true);
    expect(result.newMaxWeight).toBe(115); // 110 + 5
    expect(result.newMaxReps).toBe(5); // always reset to 5
  });

  it('should handle zero weight scenario', () => {
    let state: ProgressionState = { maxWeight: 0, consecutiveFailures: 0 };
    const perf = makePerformance(0);
    const result = calculateProgression(squatConfig, state, perf, template5);
    expect(result.progressionOccurred).toBe(true);
    expect(result.newMaxWeight).toBe(5); // 0 + 5
  });
});
