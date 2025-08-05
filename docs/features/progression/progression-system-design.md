# Progression System Design

## Overview

A three-type progression system that covers all common training patterns with configurable increment types (fixed/percentage), intelligent deload strategies, and comprehensive failure handling.

## Core Progression Types

### 1. Linear Progression
**Pure weight progression**
- Increment: Fixed amount or percentage of current weight
- Use cases: Starting Strength, StrongLifts 5x5, basic strength training

### 2. Rep Progression  
**Rep progression with optional weight progression**
- Primary: Increase reps within a range
- Secondary: Add weight and reset reps when range is maxed
- Use cases: Bodyweight training, double progression, hypertrophy training

### 3. Time Progression
**Time progression with optional weight progression**  
- Primary: Increase time duration within a range
- Secondary: Add weight and reset time when range is maxed
- Use cases: Isometric holds, endurance training, weighted static exercises

### 4. No Progression (Static)
**No progression tracking - static parameters**
- Parameters remain constant across all sessions
- Use cases: Flow exercises, mobility routines, cardio sequences, YouTube videos, meditation/breathing exercises

## Configuration Schema

```typescript
interface ProgressionConfig {
  type: 'linear' | 'reps' | 'time' | 'none';
  
  // Which sets count for progression (optional - if not specified, all sets count)
  progressionSets?: number[]; // e.g., [3] for only 3rd set
  
  // Multi-stage progression control (not applicable for 'none' type)
  enableWeightProgression?: boolean; // For reps/time types
  
  // Increment configuration (not applicable for 'none' type)
  incrementType?: 'fixed' | 'percentage';
  weightIncrement?: number; // Fixed lbs OR percentage
  repsIncrement?: number; // For reps type
  timeIncrement?: number; // For time type (seconds)
  
  // Rounding (for percentage calculations)
  weightRoundingIncrement?: number; // 2.5, 5, 10 lbs
  timeRoundingIncrement?: number; // 5, 10 seconds
  
  // Deload configuration (not applicable for 'none' type)
  deloadStrategy?: 'weight-only' | 'reps-only' | 'time-only' | 'time-then-weight' | 'percentage';
  deloadType?: 'fixed' | 'percentage';
  deloadAmount?: number; // Fixed amount OR percentage
  failureThreshold?: number; // Consecutive failures before deload
}
```

## Database Schema

### Templates
```typescript
interface Template {
  id: string;
  programId: string;
  routineId: string;
  exerciseId: string;
  order: number; // Workout sequence order
  sequence?: number; // Circuit/superset sequence (when order is shared)
  load?: number; // Percentage of cached max weight (optional for static exercises)
  repRange?: { min: number; max: number }; // For both fixed reps (min=max) and rep progression
  timeRange?: { min: number; max: number }; // For both fixed time (min=max) and time progression  
  duration?: number; // Fixed duration in seconds (for flow exercises)
  restTime?: number; // Seconds between sets
  amrep?: boolean; // As many reps as possible
  
  // Progression configuration (optional - presence indicates progression enabled)
  progressionConfig?: ProgressionConfig;
}
```

**Rep Configuration:**
- **Fixed reps**: Use `repRange: { min: 5, max: 5 }` for "5 reps exactly"
- **Rep progression**: Use `repRange: { min: 6, max: 8 }` for "6-8 reps, progress when you hit 8"
- **Consistency**: Always use `repRange`, never a separate `reps` field

**Time Configuration:**
- **Fixed time**: Use `timeRange: { min: 30, max: 30 }` for "30 seconds exactly"  
- **Time progression**: Use `timeRange: { min: 30, max: 60 }` for "30-60 seconds, progress when you hit 60"
- **Consistency**: Always use `timeRange`, never a separate `time` field

**Circuit/Superset Logic:**
- **Same `order`** = Circuit/Superset (exercises performed back-to-back)
- **`sequence`** = Order within the circuit (1, 2, 3, etc.)
- **Different `order`** = Sequential exercises with rest between
- **Superset** = Circuit of 2 exercises
- **Circuit** = Circuit of 3+ exercises
```

### Program Exercise State
```typescript
interface ProgramExercise {
  programId: string;
  exerciseId: string;
  maxWeight?: number; // Cached current max (optional for static exercises)
  maxReps?: number; // Current working reps (for rep progression)
  maxTime?: number; // Current working time (for time progression)
  lastUpdated?: Date; // Optional for static exercises
  consecutiveFailures?: number; // Optional for static exercises
}
```

**Key Changes from Original Design:**
- **Progression configuration moved to templates**: Each template can have its own `progressionConfig`
- **No separate program-exercises progression config**: Eliminates the problem of same exercise used differently
- **Self-contained templates**: Progression rules are defined where they're used
- **Simplified control**: Presence of `progressionConfig` indicates progression is enabled

## Progression Examples

### Linear Progression (Weight Only)
```typescript
// Traditional strength training
{
  type: 'linear',
  incrementType: 'fixed',
  weightIncrement: 5, // +5 lbs each success
  weightRoundingIncrement: 2.5,
  deloadStrategy: 'weight-only',
  deloadType: 'percentage',
  deloadAmount: 10, // -10% on deload
  failureThreshold: 3
}
```

### Rep Progression (Double Progression)
```typescript
// Dumbbell bench press: 6-8 reps, then add weight
{
  type: 'reps',
  enableWeightProgression: true,
  incrementType: 'fixed',
  weightIncrement: 5, // +5 lbs per dumbbell
  repsIncrement: 1,
  weightRoundingIncrement: 2.5,
  deloadStrategy: 'weight-only',
  deloadType: 'fixed',
  deloadAmount: 5, // -5 lbs on deload
  failureThreshold: 3
}
// With repRange: { min: 6, max: 8 }
```

### Time Progression (Weighted Isometrics)
```typescript
// Weighted plank: 30-60s, then add weight
{
  type: 'time',
  enableWeightProgression: true,
  incrementType: 'fixed',
  timeIncrement: 10, // +10 seconds
  weightIncrement: 5, // +5 lbs when time maxed
  timeRoundingIncrement: 5,
  weightRoundingIncrement: 2.5,
  deloadStrategy: 'time-then-weight',
  deloadType: 'fixed',
  deloadAmount: 15, // -15 seconds, then -5 lbs if needed
  failureThreshold: 3
}
// With timeRange: { min: 30, max: 60 }
```

### No Progression (Static Exercises)
```typescript
// YouTube flow video or mobility routine
{
  type: 'none'
  // No other configuration needed
  // Exercise parameters remain constant
}
// Template would have: duration: 600 (10 minutes), videoUrl: "https://youtube.com/..."
```

## Key Design Principles

### 1. Template-Level Progression
- Progression configuration is defined per template, not per exercise globally
- Enables same exercise to have different progression rules in different contexts
- **Main lift**: Barbell squat with linear progression
- **Accessory**: Same barbell squat with no progression (static weight)
- Eliminates complexity of program-level exercise configuration

### 2. Cached Max Weights
- Current max weights stored in ProgramExercise table for O(1) performance
- Templates use percentage-based loading (load: 0.85 = 85% of max)
- All ramp sets automatically scale when max changes

### 3. Simplified Progression Control
- **Presence of `progressionConfig`** = progression enabled for this template
- **Absence of `progressionConfig`** = no progression (static exercise)
- **`progressionSets` within config** = which specific sets trigger progression
- No separate boolean flags needed

### 4. Flexible Increment Types
- **Fixed**: Traditional approach (+5 lbs, +10 seconds)
- **Percentage**: Auto-scaling approach (+2.5% weight, +15% time)
- **Rounding**: Configurable to match available equipment

### 5. Intelligent Deload Strategies
- **weight-only**: Drop weight, maintain reps/time
- **reps-only**: Drop reps, maintain weight  
- **time-only**: Drop time, maintain weight
- **time-then-weight**: Try time deload first, fall back to weight
- **percentage**: Percentage-based deloads for any metric

## Progression Flow Examples

### Double Progression Flow
```
Week 1: 25 lbs × 6 reps → Success → 25 lbs × 7 reps
Week 2: 25 lbs × 7 reps → Success → 25 lbs × 8 reps
Week 3: 25 lbs × 8 reps → Success → 30 lbs × 6 reps (add weight, reset reps)
Week 4: 30 lbs × 6 reps → Success → 30 lbs × 7 reps
...
Week 8: 30 lbs × 8 reps → Failure (3 times) → 25 lbs × 6 reps (deload)
```

### Time-Weight Progression Flow
```
Week 1: 0 lbs × 30s → Success → 0 lbs × 40s
Week 2: 0 lbs × 40s → Success → 0 lbs × 50s  
Week 3: 0 lbs × 50s → Success → 0 lbs × 60s
Week 4: 0 lbs × 60s → Success → 5 lbs × 30s (add weight, reset time)
Week 5: 5 lbs × 30s → Success → 5 lbs × 40s
...
Week 12: 15 lbs × 45s → Failure (3 times) → 15 lbs × 30s (time deload)
Week 13: 15 lbs × 30s → Failure (3 times) → 10 lbs × 30s (weight deload)
```

## Advanced Features

### Complex Program Support
- **Madcow**: Only Monday final set triggers progression
- **5/3/1**: Only AMRAP sets count for progression  
- **Texas Method**: Multiple specific sets must succeed
- **Ramp Sets**: All sets automatically scale with max changes

### Supersets & Circuits
- Progression is per-exercise, not per-workout-structure
- Each exercise in superset/circuit can have different progression rules
- **Circuit/Superset Detection**: Same `order` value + different `sequence` values
- Execution patterns don't affect progression calculations

**Example Circuit:**
```typescript
// A1: Bench Press
{ order: 1, sequence: 1, exerciseId: "bench-press" }
// A2: Barbell Row  
{ order: 1, sequence: 2, exerciseId: "barbell-row" }
// A3: Overhead Press
{ order: 1, sequence: 3, exerciseId: "overhead-press" }

// B1: Next exercise
{ order: 2, sequence: 1, exerciseId: "squat" }
```

### Percentage-Based Calculations
- Both progression and deload support percentage calculations
- Configurable rounding handles real-world equipment constraints
- Auto-scaling helps with long-term progression sustainability

## Implementation Considerations

### Performance
- Cached max weights provide O(1) lookups
- History validation ensures data integrity
- Minimal database queries for progression calculations

### Flexibility  
- Three types cover 99% of training programs
- Fixed/percentage options handle beginner to advanced needs
- Deload strategies match real-world training practices

### Maintainability
- Simple, predictable progression logic
- Clear separation of concerns (progression vs execution patterns)
- Type-safe configuration prevents invalid setups

## Implementation Strategy

Since the app is pre-release, we can implement the new progression system with breaking changes for maximum simplicity:

1. **Direct Implementation**: Replace existing array-based progression system entirely
2. **Clean Database Schema**: Update all tables to new structure without migration concerns
3. **Simplified Logic**: No backward compatibility code or legacy system support
4. **Fresh Start**: Redesign progression calculation from scratch for clarity

## Implementation Status (Updated 2025-08-05)

### ✅ COMPLETED: New Progression Engine

The 4-type progression system has been **fully implemented** with a comprehensive progression engine:

**Core Engine**: `app/lib/progression-engine.ts`
- Linear progression (5x5, Madcow)
- Rep progression (5-8 reps → weight increase)
- Time progression (duration-based)
- Manual override detection and handling
- Deload logic after consecutive failures
- Weight rounding increments support

**Comprehensive Test Coverage**:
- `progression.test.ts`: 5-Day Upper Lower (rep progression) - 17 tests
- `progression-fiveBy5.test.ts`: 5x5 linear progression - 9 tests  
- `progression-madcow.test.ts`: Madcow ramping sets - 12 tests

**Integration**: 
- `processWorkoutProgression()` uses new engine for workout completion
- Maintains backward compatibility with existing database structure
- Automatic progression calculations on workout finish

**Schema Updates**:
- All templates converted to `repRange: { min: X, max: X }` format
- Removed legacy `reps: X` format throughout codebase
- UI improvements for edge-to-edge layout consistency

### 🔄 MIGRATION STATUS: From Design to Implementation

The implemented system differs from the original design document:

**Original Design**: Template-level progression configuration
**Current Implementation**: Uses existing program-exercises progression state + new calculation engine

**Benefits of Current Approach**:
- ✅ No breaking database changes required
- ✅ Maintains existing user data and program structure  
- ✅ Progressive enhancement of existing system
- ✅ Full backward compatibility during development

**Key Implementation Decisions**:
- Progression configuration remains in program-exercises table
- Templates define rep/time ranges, progression rules come from program state
- New engine calculates progression based on performance vs current state
- Manual override support allows users to jump ahead in weight/reps

This pragmatic approach achieved **full functionality** without requiring database migrations or breaking existing programs.
