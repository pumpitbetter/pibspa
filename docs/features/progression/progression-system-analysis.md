# Progression System Design Analysis

## Current State (Array-Based Approach)

The current system uses arrays of progression rules:

```typescript
progression: {
  increment: [
    { kind: "reps", value: 1 },
    { kind: "weight", value: 5 }
  ],
  decrement: [
    { kind: "reps", value: 1 },
    { kind: "weight", value: 2.5 }
  ]
}
```

## Option 1: Keep Current Array-Based System

### Pros
- **Maximum Flexibility**: Can express any combination of progression rules
- **Already Implemented**: No breaking changes needed
- **Future-Proof**: Can handle complex progression patterns we haven't thought of yet
- **Granular Control**: Each increment/decrement rule can have its own conditions

### Cons
- **Over-Engineering**: Most use cases only need simple single/double progression
- **Complex Configuration**: Users need to understand multiple rule interactions
- **Implementation Complexity**: Logic to process arrays and determine rule precedence
- **Error-Prone**: Easy to misconfigure with conflicting rules
- **UI Complexity**: Difficult to create intuitive UI for arbitrary rule arrays

## Option 2: Structured Progression Types

### Design
```typescript
type ProgressionType = 'linear' | 'double' | 'reps-only' | 'time-based' | 'time-weight';

interface ProgressionConfig {
  type: ProgressionType;
  weightIncrement: number;
  weightDecrement: number;
  repsIncrement?: number; // Only for double/reps-only
  repsDecrement?: number; // Only for double/reps-only
  timeIncrement?: number; // Only for time-based/time-weight (in seconds)
  timeDecrement?: number; // Only for time-based/time-weight (in seconds)
}
```

### Implementation Examples

**Linear Progression (weight only)**:
```typescript
progression: {
  type: 'linear',
  weightIncrement: 5,
  weightDecrement: 10
}
```

**Double Progression (reps then weight)**:
```typescript
progression: {
  type: 'double',
  weightIncrement: 5,
  weightDecrement: 10,
  repsIncrement: 1,
  repsDecrement: 1
}
```

**Reps-Only Progression (bodyweight)**:
```typescript
progression: {
  type: 'reps-only',
  weightIncrement: 0,
  weightDecrement: 0,
  repsIncrement: 1,
  repsDecrement: 2
}
```

**Time-Based Progression (isometric holds)**:
```typescript
progression: {
  type: 'time-based',
  weightIncrement: 0,
  weightDecrement: 0,
  timeIncrement: 10, // seconds
  timeDecrement: 15  // seconds
}
```

**Time-Weight Progression (weighted isometric holds)**:
```typescript
progression: {
  type: 'time-weight',
  weightIncrement: 5, // lbs
  weightDecrement: 10, // lbs
  timeIncrement: 5, // seconds
  timeDecrement: 10 // seconds
}
// With timeRange: { min: 30, max: 60 }
// Logic: Increase time until max (60s), then add weight and reset to min time (30s)
```

### Pros
- **Simplicity**: Five clear types (linear, double, reps-only,z) cover all common training programs
- **User-Friendly**: Easy to understand and configure
- **Type Safety**: TypeScript can enforce valid configurations
- **UI Friendly**: Simple dropdowns and number inputs
- **Less Error-Prone**: Constrained options prevent invalid configurations
- **Performance**: Simpler logic, faster execution
- **Maintainability**: Easier to debug and modify

### Cons
- **Less Flexible**: Cannot express exotic progression patterns
- **Breaking Change**: Requires migration of existing templates
- **Limited Future Growth**: Adding new types requires code changes

## Option 3: Hybrid Approach

Combine both approaches with a `mode` field:

```typescript
interface Progression {
  mode: 'simple' | 'advanced';
  
  // Simple mode (covers 95% of use cases)
  type?: 'linear' | 'double' | 'reps-only';
  weightIncrement?: number;
  weightDecrement?: number;
  repsIncrement?: number;
  repsDecrement?: number;
  
  // Advanced mode (for edge cases)
  increment?: ProgressionRule[];
  decrement?: ProgressionRule[];
}
```

### Pros
- **Best of Both Worlds**: Simple for common cases, flexible for edge cases
- **Gradual Migration**: Can migrate templates incrementally
- **Future-Proof**: Advanced mode available when needed

### Cons
- **Complexity**: Two systems to maintain
- **Confusion**: Users might not know which mode to use

## Implementation Complexity Analysis

### Array-Based (Current)
```typescript
function calculateProgression(template: Template, history: History[]): number {
  // Complex logic to:
  // 1. Evaluate conditions for each rule
  // 2. Determine rule precedence
  // 3. Apply multiple rules in sequence
  // 4. Handle edge cases and conflicts
}
```

### Type-Based (Proposed)
```typescript
function calculateProgression(template: Template, history: History[]): number {
  switch (template.progression.type) {
    case 'linear':
      return calculateLinearProgression(template, history);
    case 'double':
      return calculateDoubleProgression(template, history);
    case 'reps-only':
      return calculateRepsOnlyProgression(template, history);
    case 'time-based':
      return calculateTimeBasedProgression(template, history);
    case 'time-weight':
      return calculateTimeWeightProgression(template, history);
  }
}
```

## UI Configuration Comparison

### Array-Based UI
```
Progression Rules:
┌─────────────────────────────────────┐
│ [+] Add Increment Rule              │
│ ┌─────────────────────────────────┐ │
│ │ Type: [Reps ▼] Value: [1]       │ │
│ │ Condition: [Custom ▼]           │ │
│ │ [×] Remove                      │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Type: [Weight ▼] Value: [5]     │ │
│ │ Condition: [Custom ▼]           │ │
│ │ [×] Remove                      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Type-Based UI
```
Progression Type: [Double Progression ▼]
┌─────────────────────────────────────┐
│ Weight Increase: [5] lbs            │
│ Weight Decrease: [10] lbs           │
│ Rep Increase: [1] rep               │
│ Rep Decrease: [1] rep               │
└─────────────────────────────────────┘
```

## Recommendation

**Go with Option 2 (Structured Progression Types)** for these reasons:

1. **Covers Real Use Cases**: The five types (linear, double, reps-only, time-based, time-weight) cover 99% of actual training programs
2. **User Experience**: Much easier for users to understand and configure
3. **Implementation Simplicity**: Cleaner, more maintainable code
4. **Type Safety**: Better error prevention and debugging
5. **Performance**: Faster execution with simpler logic

### Migration Strategy

1. **Phase 1**: Implement new progression type system alongside current array system
2. **Phase 2**: Create migration script to convert existing templates
3. **Phase 3**: Update UI to use new system
4. **Phase 4**: Remove old array-based system (optional, could keep for advanced users)

### Hard-Coded Logic Benefits

The progression logic becomes predictable and well-tested:

```typescript
// Double progression: clear, simple, bulletproof
function calculateDoubleProgression(template: Template, history: History[]): { weight: number, reps: number } {
  const currentReps = getCurrentReps(template, history);
  const currentWeight = getCurrentWeight(template, history);
  
  if (currentReps < template.repRange.max) {
    // Increase reps
    return { weight: currentWeight, reps: currentReps + template.progression.repsIncrement };
  } else {
    // Increase weight, reset to min reps
    return { 
      weight: currentWeight + template.progression.weightIncrement, 
      reps: template.repRange.min 
    };
  }
}
```

This approach eliminates edge cases, improves predictability, and makes the system much easier to reason about.

## Time-Based Progression Examples

Time-based progressions are perfect for isometric exercises:

```typescript
// Time-based progression: clear progression for holds
function calculateTimeBasedProgression(template: Template, history: History[]): { weight: number, time: number } {
  const currentTime = getCurrentTime(template, history);
  const currentWeight = getCurrentWeight(template, history);
  
  if (lastSetWasSuccessful(history)) {
    // Increase time duration
    return { 
      weight: currentWeight, 
      time: currentTime + template.progression.timeIncrement 
    };
  } else {
    // Decrease time on failure
    return { 
      weight: currentWeight, 
      time: Math.max(currentTime - template.progression.timeDecrement, template.timeRange.min)
    };
  }
}
```

**Use Cases for Time-Based Progression:**
- Plank holds (start at 30s, add 10s each workout)
- Wall sits (start at 45s, add 15s each workout)  
- Dead hangs (start at 20s, add 5s each workout)
- Bridge holds
- L-sits
- Any isometric exercise

## Time-Weight Progression: The Ultimate Isometric Progression

This combines the best of both worlds - time progression until a threshold, then weight progression:

```typescript
// Time-weight progression: time until max, then add weight and reset time
function calculateTimeWeightProgression(template: Template, history: History[]): { weight: number, time: number } {
  const currentTime = getCurrentTime(template, history);
  const currentWeight = getCurrentWeight(template, history);
  
  if (currentTime < template.timeRange.max) {
    // Still progressing time - increase duration
    return { 
      weight: currentWeight, 
      time: currentTime + template.progression.timeIncrement 
    };
  } else {
    // Hit max time - increase weight, reset to min time
    return { 
      weight: currentWeight + template.progression.weightIncrement, 
      time: template.timeRange.min 
    };
  }
}
```

**Perfect Use Cases for Time-Weight Progression:**
- **Weighted Planks**: Progress from 30s to 60s, then add 5lbs and back to 30s
- **Weighted Wall Sits**: Progress from 45s to 90s, then add 10lbs and back to 45s
- **Weighted Dead Hangs**: Progress from 20s to 45s, then add 2.5lbs and back to 20s
- **Weighted Glute Bridges**: Hold for time with progressive loading
- **Farmer's Walks**: Fixed distance, progress time, then add weight

This creates a sustainable long-term progression for isometric exercises that would otherwise plateau when time gets impractically long.

## Other Common Progression Patterns Analysis

Let me analyze other progression patterns used in the fitness world:

### 1. **Density Progression** (More work in same time)
- **Example**: Do 100 push-ups, try to do it in less time each workout
- **Pattern**: Fixed reps/weight, decrease rest time or total time
- **Use Cases**: CrossFit, circuit training, conditioning work
- **Implementation Challenge**: Requires rest time tracking between exercises
- **Verdict**: Could be valuable but complex to implement

### 2. **Volume Progression** (More total sets)
- **Example**: Week 1: 3x5, Week 2: 4x5, Week 3: 5x5
- **Pattern**: Same weight/reps, add more sets
- **Use Cases**: German Volume Training, some periodization schemes
- **Implementation Challenge**: Changes template structure (set count)
- **Verdict**: This would require program-level changes, not exercise-level

### 3. **Range of Motion Progression** 
- **Example**: Deficit deadlifts, pin squats at different heights
- **Pattern**: Same weight/reps, increase ROM gradually
- **Use Cases**: Rehabilitation, mobility work, powerlifting accessories
- **Implementation Challenge**: ROM is equipment/setup dependent
- **Verdict**: Too equipment-specific, hard to generalize

### 4. **Tempo Progression**
- **Example**: 2-1-2-1 tempo → 3-1-3-1 tempo (slower eccentric/concentric)
- **Pattern**: Same weight/reps, change lifting speed
- **Use Cases**: Bodybuilding, strength development, rehabilitation
- **Implementation Challenge**: Requires tempo tracking and timing
- **Verdict**: Valuable but adds significant UI complexity

### 5. **Load Progression with Percentage Steps**
- **Example**: Week 1: 70%, Week 2: 75%, Week 3: 80% (of 1RM)
- **Pattern**: Predetermined percentage increases
- **Use Cases**: Powerlifting peaking, 5/3/1 variations
- **Implementation Challenge**: This is already covered by "linear" with different increment values
- **Verdict**: Already covered by existing linear progression

### 6. **Cluster Progression** 
- **Example**: 5x1 → 4x1 → 3x1 → 2x1 → 1x1 (same total reps, fewer sets)
- **Pattern**: Same total volume, change set/rep scheme
- **Use Cases**: Powerlifting, max strength training
- **Implementation Challenge**: Complex set/rep manipulation
- **Verdict**: Too specialized, program-level concern

### 7. **Mechanical Progression**
- **Example**: Incline push-ups → regular → decline → weighted
- **Pattern**: Change exercise difficulty through mechanics
- **Use Cases**: Calisthenics, bodyweight training
- **Implementation Challenge**: Requires different exercises, not just numbers
- **Verdict**: This is exercise selection, not progression within an exercise

## Conclusion: Stick with Five Types

After analyzing common progression patterns, I believe our **five types cover all the fundamental mathematical progressions**:

1. **Linear**: Weight-only progression
2. **Double**: Reps → Weight progression  
3. **Reps-Only**: Rep progression only
4. **Time-Based**: Time progression only
5. **Time-Weight**: Time → Weight progression

**Why other patterns don't need separate types:**
- **Density/Tempo**: Add too much complexity for niche use cases  
- **Volume**: Program-level concern, not exercise-level
- **ROM/Mechanical**: Exercise selection, not numerical progression
- **Percentage**: Covered by linear with different increments
- **Cluster**: Too specialized, complex set/rep schemes

The five-type system captures the **mathematical essence** of progression while remaining simple and practical.

## Linear Weight Progression Design Decisions

### Current System Analysis

**Current Approach**: Progression field on specific template sets
```typescript
// Only the "working set" has progression rules
{
  id: "squat-set-3",
  load: 1.0, // 100% working weight
  progression: { /* rules */ } // Only this set triggers progression
}
```

**Problems with Current Approach**:
- Arbitrary designation of which set triggers progression
- Inconsistent with how training actually works
- Complex to configure (which set gets progression?)

### Proposed Solution: Exercise-Level Progression

**New Approach**: Check progression after completing ALL sets for an exercise

```typescript
// Progression logic
function checkProgressionForExercise(exerciseId: string, completedSets: Set[], templates: Template[]): boolean {
  // Get all template sets for this exercise in this workout
  const exerciseTemplates = templates.filter(t => t.exerciseId === exerciseId);
  
  // Check if ALL sets met their targets
  const allSetsSuccessful = exerciseTemplates.every(template => {
    const correspondingSet = completedSets.find(s => s.templateId === template.id);
    return correspondingSet && 
           correspondingSet.liftedReps >= template.reps &&
           correspondingSet.liftedWeight >= (template.load * getCurrentMaxWeight(exerciseId));
  });
  
  return allSetsSuccessful;
}
```

### Benefits of Exercise-Level Progression

1. **Realistic**: Matches how training actually works - you progress when you complete the full exercise
2. **Simpler Configuration**: No need to designate "progression sets"
3. **Consistent Logic**: Same rule applies to all exercises
4. **Clearer Success Criteria**: All sets must be successful to progress

### Database Schema Changes

**Templates Table**: Remove progression field from individual sets
```typescript
// OLD: Progression on specific sets
{
  id: "squat-set-1",
  progression: { /* rules */ } // Remove this
}

// NEW: Progression on exercise level (in programs or separate table)
```

**Programs Table**: Add exercise-level progression rules
```typescript
{
  programId: "5x5",
  exerciseId: "barbell-squat",
  maxWeight: 225, // Current max for this exercise in this program
  progression: {
    type: 'linear',
    weightIncrement: 5,
    weightDecrement: 10
  }
}
```

## Weight Tracking: Program vs History-Based

### Current Approach: Program-Stored Max Weights
```typescript
// Programs table stores current max for each exercise
{
  programId: "5x5",
  exerciseId: "barbell-squat", 
  maxWeight: 225 // Stored in program
}
```

### Alternative: History-Based Max Weights
```typescript
// Calculate max from history
function getCurrentMaxWeight(programId: string, exerciseId: string): number {
  const history = getExerciseHistory(programId, exerciseId);
  return Math.max(...history.map(h => h.liftedWeight));
}
```

### Comparison Analysis

| Aspect | Program-Stored | History-Based |
|--------|----------------|---------------|
| **Performance** | Fast (O(1) lookup) | Slower (O(n) calculation) |
| **Data Consistency** | Can get out of sync | Always accurate |
| **Complexity** | Simple reads/writes | Complex aggregation logic |
| **Data Integrity** | Prone to bugs/drift | Self-correcting |
| **Rollback Capability** | Manual fixes needed | Automatic recalculation |
| **Cross-Program** | Isolated per program | Shared across programs |

### Recommendation: Hybrid Approach

**Best of Both Worlds**: Cache in program, validate against history

```typescript
interface ProgramExercise {
  programId: string;
  exerciseId: string;
  maxWeight: number; // Cached for performance
  lastUpdated: Date; // Track when cache was updated
}

// Update cached max when progression occurs
function updateMaxWeight(programId: string, exerciseId: string, newWeight: number) {
  // Update cached value
  updateProgramExercise(programId, exerciseId, { 
    maxWeight: newWeight, 
    lastUpdated: new Date() 
  });
  
  // Validate against history (optional integrity check)
  const historyMax = getMaxFromHistory(programId, exerciseId);
  if (Math.abs(newWeight - historyMax) > 10) {
    console.warn(`Max weight drift detected for ${exerciseId}`);
  }
}
```

### Benefits of Hybrid Approach
1. **Performance**: Fast O(1) lookups for UI
2. **Reliability**: History provides backup/validation
3. **Flexibility**: Can recalculate from history if needed
4. **Debugging**: Easy to spot inconsistencies

## Final Schema Recommendation

```typescript
// Remove progression from templates
interface Template {
  id: string;
  programId: string;
  exerciseId: string;
  order: number;
  load: number; // Percentage of max
  reps: number;
  repRange?: { min: number; max: number }; // For double progression
  timeRange?: { min: number; max: number }; // For time progressions
  // NO progression field here anymore
}

// Add exercise-level progression to programs
interface ProgramExercise {
  programId: string;
  exerciseId: string;
  maxWeight: number; // Cached current max
  lastUpdated: Date;
  progression: {
    type: 'linear' | 'double' | 'reps-only' | 'time-based' | 'time-weight';
    weightIncrement: number;
    weightDecrement: number;
    repsIncrement?: number;
    repsDecrement?: number;
    timeIncrement?: number;
    timeDecrement?: number;
  };
}
```

This approach is **cleaner, more realistic, and easier to maintain** while providing the performance and reliability needed for a production app.

## Addressing Complex Progression Scenarios

### Problem 1: Ramp Sets and Percentage-Based Loading

**Question**: How do ramp sets (like 65%, 75%, 85% of max) work with exercise-level progression?

**Answer**: The cached max weight handles this perfectly:

```typescript
// Template definition for ramp sets
[
  { exerciseId: "squat", load: 0.65, reps: 5 }, // 65% of max
  { exerciseId: "squat", load: 0.75, reps: 5 }, // 75% of max  
  { exerciseId: "squat", load: 0.85, reps: 5 }  // 85% of max
]

// Calculate actual weights
function calculateWorkoutWeights(templates: Template[], cachedMax: number) {
  return templates.map(template => ({
    ...template,
    targetWeight: Math.round(template.load * cachedMax / 2.5) * 2.5 // Round to nearest 2.5lbs
  }));
}
```

**Benefits**:
- All sets automatically scale with max weight changes
- No manual recalculation needed
- Consistent percentage relationships maintained

### Problem 2: Selective Progression Sets

**Question**: How to configure which sets count for progression (like Madcow's Monday-only progression)?

**Current Problem**: Exercise-level progression assumes ALL sets must succeed, but some programs only progress on specific workout days or specific sets.

**Solution**: Add progression configuration at the routine/day level

```typescript
interface RoutineExercise {
  routineId: string; // e.g., "madcow-monday", "madcow-wednesday"
  exerciseId: string;
  progressionEnabled: boolean; // NEW: Controls if this routine checks progression
  progressionSets?: number[]; // NEW: Which set orders count (optional)
}

// Example: Madcow configuration
[
  // Monday - progression enabled, only final set counts
  {
    routineId: "madcow-monday",
    exerciseId: "barbell-squat", 
    progressionEnabled: true,
    progressionSets: [5] // Only the 5th set (100% load) counts
  },
  // Wednesday - no progression
  {
    routineId: "madcow-wednesday",
    exerciseId: "barbell-squat",
    progressionEnabled: false // This day doesn't progress
  },
  // Friday - no progression  
  {
    routineId: "madcow-friday",
    exerciseId: "barbell-squat",
    progressionEnabled: false
  }
]
```

### Refined Progression Logic

```typescript
function checkProgressionForExercise(
  routineId: string, 
  exerciseId: string, 
  completedSets: Set[], 
  templates: Template[]
): boolean {
  // Check if progression is enabled for this routine/exercise
  const routineExercise = getRoutineExercise(routineId, exerciseId);
  if (!routineExercise.progressionEnabled) {
    return false; // No progression on this day
  }
  
  // Get templates for this exercise in this routine
  const exerciseTemplates = templates.filter(t => 
    t.routineId === routineId && t.exerciseId === exerciseId
  );
  
  // Filter to only progression sets if specified
  const progressionTemplates = routineExercise.progressionSets 
    ? exerciseTemplates.filter(t => routineExercise.progressionSets.includes(t.order))
    : exerciseTemplates; // All sets if not specified
  
  // Check if ALL progression sets met their targets
  return progressionTemplates.every(template => {
    const correspondingSet = completedSets.find(s => s.templateId === template.id);
    const targetWeight = template.load * getCachedMaxWeight(exerciseId);
    
    return correspondingSet && 
           correspondingSet.liftedReps >= template.reps &&
           correspondingSet.liftedWeight >= targetWeight;
  });
}
```

### User Configuration UI

When users create custom programs, they can configure:

```
Exercise: Squat
┌─────────────────────────────────────┐
│ Monday Workout:                     │
│ ☑ Enable progression on this day    │
│ ☑ Only final set counts for prog.   │ 
│                                     │
│ Wednesday Workout:                  │
│ ☐ Enable progression on this day    │
│                                     │
│ Friday Workout:                     │
│ ☐ Enable progression on this day    │
└─────────────────────────────────────┘
```

### Program Examples

**5x5 (Simple)**:
```typescript
// All routines progress, all sets count
{
  routineId: "5x5-workout-a",
  exerciseId: "barbell-squat",
  progressionEnabled: true
  // progressionSets: undefined = all sets count
}
```

**Madcow (Complex)**:
```typescript
// Monday: Progress on final set only
{
  routineId: "madcow-monday", 
  exerciseId: "barbell-squat",
  progressionEnabled: true,
  progressionSets: [5] // Only 5th set
}

// Wednesday/Friday: No progression
{
  routineId: "madcow-wednesday",
  exerciseId: "barbell-squat", 
  progressionEnabled: false
}
```

### What `progressionSets: [5]` Means Exactly

**Madcow Monday Squat Example**:
```typescript
// Template sets for Monday
[
  { order: 1, load: 0.5, reps: 5 },  // 50% warmup
  { order: 2, load: 0.6, reps: 5 },  // 60% warmup  
  { order: 3, load: 0.75, reps: 5 }, // 75% ramp
  { order: 4, load: 0.875, reps: 5 }, // 87.5% ramp
  { order: 5, load: 1.0, reps: 5 }   // 100% working set
]

// With progressionSets: [5], progression logic becomes:
function checkProgressionForMadcowMonday(completedSets: Set[]): boolean {
  // ONLY check set #5 (the 100% working set)
  const set5 = completedSets.find(s => s.order === 5);
  
  // Did they hit target reps and weight for ONLY this set?
  return set5 && 
         set5.liftedReps >= 5 && 
         set5.liftedWeight >= (1.0 * cachedMaxWeight);
  
  // Sets 1-4 are IGNORED for progression decisions
  // Even if you fail sets 1-4, you can still progress if set 5 succeeds
}
```

**Real Workout Scenario**:
- Set 1 (50%): ✅ Hit 5 reps
- Set 2 (60%): ✅ Hit 5 reps  
- Set 3 (75%): ❌ Only got 4 reps (tired today)
- Set 4 (87.5%): ❌ Only got 3 reps (getting fatigued)
- Set 5 (100%): ✅ Hit 5 reps (main working set)

**Result**: **Progression occurs** because only set 5 matters for Madcow!

**5/3/1 (Varied)**:
```typescript
// Week 1: Progress on AMRAP set
{
  routineId: "531-week1-day1",
  exerciseId: "barbell-squat",
  progressionEnabled: true,
  progressionSets: [3] // Only AMRAP set counts
}
```

### Additional Examples

**5x5 StrongLifts (All Sets Matter)**:
```typescript
{
  routineId: "5x5-workout-a",
  exerciseId: "barbell-squat", 
  progressionEnabled: true
  // progressionSets: undefined = ALL sets must succeed
}

// All 5 sets must hit target reps/weight to progress
// If any set fails, no progression occurs
```

**Texas Method (Multiple Critical Sets)**:
```typescript
{
  routineId: "texas-method-friday",
  exerciseId: "barbell-squat",
  progressionEnabled: true,
  progressionSets: [4, 5] // Both intensity sets must succeed
}

// Only sets 4 and 5 (the high-intensity sets) count
// Volume sets 1-3 are ignored for progression
```

## Updated Schema Design

```typescript
interface Template {
  id: string;
  programId: string;
  routineId: string; // NEW: Specific routine within program
  exerciseId: string;
  order: number;
  load: number; // Percentage of cached max
  reps: number;
  repRange?: { min: number; max: number };
  timeRange?: { min: number; max: number };
}

interface ProgramExercise {
  programId: string;
  exerciseId: string;
  maxWeight: number; // Cached max weight
  lastUpdated: Date;
  progression: ProgressionConfig;
}

interface RoutineExercise {
  routineId: string; 
  exerciseId: string;
  progressionEnabled: boolean;
  progressionSets?: number[]; // Which set orders trigger progression
}
```

This refined approach handles:
1. ✅ **Ramp sets**: Automatic scaling via cached max weights
2. ✅ **Selective progression**: Day-specific and set-specific control  
3. ✅ **Complex programs**: Madcow, 5/3/1, Texas Method, etc.
4. ✅ **User control**: Granular configuration in UI
5. ✅ **Performance**: Fast lookups with cached values

The system remains simple for basic programs while supporting the complexity needed for advanced periodization schemes.

## Supersets and Circuits Compatibility Analysis

### How Supersets Work with Our Progression System

**Superset Example**: Bench Press + Bent-Over Row
```typescript
// Template for superset A1/A2
[
  { 
    exerciseId: "barbell-bench-press", 
    order: 1,
    supersetGroup: "A1", // NEW: Grouping field
    load: 1.0, 
    reps: 8 
  },
  { 
    exerciseId: "barbell-bent-over-row", 
    order: 2,
    supersetGroup: "A2", // Paired with A1
    load: 1.0, 
    reps: 8 
  }
]

// Progression configuration (unchanged)
{
  routineId: "upper-body-day",
  exerciseId: "barbell-bench-press",
  progressionEnabled: true,
  progressionSets: [1, 3, 5] // Sets 1, 3, 5 count for progression
}
{
  routineId: "upper-body-day", 
  exerciseId: "barbell-bent-over-row",
  progressionEnabled: true,
  progressionSets: [2, 4, 6] // Sets 2, 4, 6 count for progression
}
```

### Circuit Training Compatibility

**Circuit Example**: Upper Body Circuit
```typescript
// Circuit with 4 exercises, 3 rounds
[
  // Round 1
  { exerciseId: "push-ups", order: 1, circuitGroup: "round-1", reps: 10 },
  { exerciseId: "pull-ups", order: 2, circuitGroup: "round-1", reps: 5 },
  { exerciseId: "dips", order: 3, circuitGroup: "round-1", reps: 8 },
  { exerciseId: "rows", order: 4, circuitGroup: "round-1", reps: 10 },
  
  // Round 2  
  { exerciseId: "push-ups", order: 5, circuitGroup: "round-2", reps: 10 },
  { exerciseId: "pull-ups", order: 6, circuitGroup: "round-2", reps: 5 },
  { exerciseId: "dips", order: 7, circuitGroup: "round-2", reps: 8 },
  { exerciseId: "rows", order: 8, circuitGroup: "round-2", reps: 10 },
  
  // Round 3
  { exerciseId: "push-ups", order: 9, circuitGroup: "round-3", reps: 10 },
  { exerciseId: "pull-ups", order: 10, circuitGroup: "round-3", reps: 5 },
  { exerciseId: "dips", order: 11, circuitGroup: "round-3", reps: 8 },
  { exerciseId: "rows", order: 12, circuitGroup: "round-3", reps: 10 }
]
```

### Progression Logic Remains Unchanged

**Key Insight**: Supersets and circuits are **execution patterns**, not progression patterns.

```typescript
// Progression check works exactly the same
function checkProgressionForExercise(
  routineId: string,
  exerciseId: string, 
  completedSets: Set[],
  templates: Template[]
): boolean {
  // Get all sets for this exercise (regardless of superset/circuit grouping)
  const exerciseSets = completedSets.filter(s => s.exerciseId === exerciseId);
  
  // Check progression sets as configured
  const routineExercise = getRoutineExercise(routineId, exerciseId);
  const progressionSetOrders = routineExercise.progressionSets || getAllSetOrders(exerciseId);
  
  // Same logic - did the specified sets meet targets?
  return progressionSetOrders.every(order => {
    const set = exerciseSets.find(s => s.order === order);
    return set && set.liftedReps >= set.targetReps && set.liftedWeight >= set.targetWeight;
  });
}
```

### Benefits for Supersets/Circuits

1. **Independent Progression**: Each exercise progresses independently
   - Bench press can progress while row stays the same
   - Push-ups can use double progression while pull-ups use linear

2. **Flexible Configuration**: 
   - Some exercises in a superset can progress, others don't
   - Circuit exercises can have different progression patterns

3. **Granular Control**:
   - Choose which rounds/sets count for progression
   - Different exercises can have different progression schedules

### Real-World Examples

**Antagonist Superset** (Bench + Row):
```typescript
// Both exercises progress independently
{
  exerciseId: "barbell-bench-press",
  progression: { type: 'linear', weightIncrement: 5 },
  progressionEnabled: true
}
{
  exerciseId: "barbell-bent-over-row", 
  progression: { type: 'double', weightIncrement: 5, repsIncrement: 1 },
  progressionEnabled: true
}
```

**Bodyweight Circuit**:
```typescript
// Different progression types for different exercises
{
  exerciseId: "push-ups",
  progression: { type: 'reps-only', repsIncrement: 1 },
  progressionSets: [3, 6, 9] // Only final set of each round
}
{
  exerciseId: "plank",
  progression: { type: 'time-based', timeIncrement: 10 },
  progressionSets: [12] // Only final plank
}
```

**Pre-Exhaust Superset** (Only main exercise progresses):
```typescript
// Isolation exercise doesn't progress, compound does
{
  exerciseId: "dumbbell-fly", // Pre-exhaust
  progressionEnabled: false // No progression
}
{
  exerciseId: "barbell-bench-press", // Main lift
  progression: { type: 'linear', weightIncrement: 5 },
  progressionEnabled: true
}
```

### Schema Additions for Supersets/Circuits

```typescript
interface Template {
  id: string;
  programId: string;
  routineId: string;
  exerciseId: string;
  order: number;
  load: number;
  reps: number;
  
  // NEW: Grouping fields for execution patterns
  supersetGroup?: string; // "A1", "A2", "B1", "B2", etc.
  circuitGroup?: string;  // "round-1", "round-2", etc.
  restTime?: number;      // Rest after this exercise (seconds)
  
  // Existing progression fields remain unchanged
  repRange?: { min: number; max: number };
  timeRange?: { min: number; max: number };
}
```

### UI Implications

**Superset Configuration**:
```
Exercise 1: Bench Press        [Superset: A1]
└─ Progression: ☑ Linear (+5 lbs)

Exercise 2: Bent-Over Row      [Superset: A2] 
└─ Progression: ☑ Double (5-8 reps, +5 lbs)
```

**Circuit Configuration**:
```
Circuit: Upper Body (3 rounds)
├─ Push-ups:    Progression ☑ Reps-only (+1 rep)
├─ Pull-ups:    Progression ☑ Linear (+2.5 lbs)  
├─ Dips:        Progression ☐ No progression
└─ Plank:       Progression ☑ Time-based (+10s)
```

## Conclusion: Perfect Compatibility

Our progression system works **excellently** with supersets and circuits because:

1. **Exercise-Centric Design**: Progression is per-exercise, not per-workout-structure
2. **Flexible Grouping**: Supersets/circuits are execution patterns, progression is adaptation patterns
3. **Independent Control**: Each exercise can have its own progression rules
4. **Granular Configuration**: Choose which sets/rounds count for progression

**The progression system is completely orthogonal to workout structure** - whether exercises are performed individually, in supersets, or circuits doesn't affect how progression is calculated or applied.

## Time Progression Type Consolidation Analysis

### Current Approach: Two Separate Types

**time-based**: Time progression only
**time-weight**: Time progression until threshold, then weight progression

### Proposed Approach: Single Unified Type

```typescript
type ProgressionType = 'linear' | 'double' | 'reps-only' | 'time';

interface ProgressionConfig {
  type: ProgressionType;
  weightIncrement: number;
  weightDecrement: number;
  repsIncrement?: number; // Only for double/reps-only
  repsDecrement?: number; // Only for double/reps-only
  timeIncrement?: number; // Only for time (in seconds)
  timeDecrement?: number; // Only for time (in seconds)
  
  // NEW: Controls time-only vs time-weight behavior
  enableWeightProgression?: boolean; // Default: false (time-only)
}
```

### Implementation Examples

**Time-Only Progression** (current time-based):
```typescript
progression: {
  type: 'time',
  weightIncrement: 0, // Unused when enableWeightProgression = false
  weightDecrement: 0, // Unused when enableWeightProgression = false
  timeIncrement: 10,
  timeDecrement: 15,
  enableWeightProgression: false // Time-only mode
}
```

**Time-Weight Progression** (current time-weight):
```typescript
progression: {
  type: 'time',
  weightIncrement: 5,
  weightDecrement: 10, 
  timeIncrement: 5,
  timeDecrement: 10,
  enableWeightProgression: true // Time + weight mode
}
// Still requires timeRange: { min: 30, max: 60 }
```

### Unified Logic Implementation

```typescript
function calculateTimeProgression(template: Template, history: History[]): { weight: number, time: number } {
  const currentTime = getCurrentTime(template, history);
  const currentWeight = getCurrentWeight(template, history);
  
  if (!template.progression.enableWeightProgression) {
    // TIME-ONLY MODE: Simple time progression
    if (lastSetWasSuccessful(history)) {
      return { 
        weight: currentWeight, // Weight never changes
        time: currentTime + template.progression.timeIncrement 
      };
    } else {
      return { 
        weight: currentWeight,
        time: Math.max(currentTime - template.progression.timeDecrement, template.timeRange.min)
      };
    }
  } else {
    // TIME-WEIGHT MODE: Time until max, then add weight
    if (currentTime < template.timeRange.max) {
      return { 
        weight: currentWeight, 
        time: currentTime + template.progression.timeIncrement 
      };
    } else {
      return { 
        weight: currentWeight + template.progression.weightIncrement, 
        time: template.timeRange.min 
      };
    }
  }
}
```

### Analysis: Benefits vs Drawbacks

#### Benefits of Combining

1. **Simpler Type System**: 4 types instead of 5
2. **Natural Progression Path**: Users can start time-only, then enable weight later
3. **Less Cognitive Load**: One "time" concept instead of two
4. **Cleaner UI**: Single dropdown with checkbox for weight progression
5. **Unified Implementation**: One function handles both cases

#### Drawbacks of Combining

1. **Slightly More Complex Config**: Extra boolean field to understand
2. **Conditional Logic**: Implementation has if/else branches
3. **Field Ambiguity**: Weight fields present but sometimes unused

### UI Comparison

**Current Approach** (Separate Types):
```
Progression Type: [Time-Weight Progression ▼]
┌─────────────────────────────────────┐
│ Time Increase: [5] seconds          │
│ Time Decrease: [10] seconds         │
│ Weight Increase: [5] lbs            │
│ Weight Decrease: [10] lbs           │
└─────────────────────────────────────┘
```

**Unified Approach**:
```
Progression Type: [Time Progression ▼]
┌─────────────────────────────────────┐
│ Time Increase: [5] seconds          │
│ Time Decrease: [10] seconds         │
│ ☑ Also progress weight when time maxed │
│ Weight Increase: [5] lbs            │
│ Weight Decrease: [10] lbs           │
└─────────────────────────────────────┘
```

### Recommendation: **Combine Them**

The unified approach is **clearly better** because:

1. **Natural Conceptual Model**: Time progression with optional weight addition
2. **Simpler Mental Model**: "Time progression" with a weight toggle
3. **Better User Journey**: Start simple (time-only), add complexity (+ weight) later
4. **Cleaner Type System**: 4 types is cleaner than 5
5. **Real-World Usage**: Most users start with time-only anyway

### Updated Type System

```typescript
type ProgressionType = 'linear' | 'double' | 'reps-only' | 'time';

// The four fundamental progression patterns:
// 1. linear: weight only
// 2. double: reps → weight  
// 3. reps-only: reps only
// 4. time: time only OR time → weight (configurable)
```

### Implementation Benefits

- **Single time progression function** handles both cases
- **Conditional logic** is simple and clear
- **Future extensibility**: Could add other time-based options easily
- **Consistent with double progression**: Similar concept of two-stage progression

This consolidation makes the progression system **simpler and more intuitive** while maintaining all the functionality.

## Rep Progression Type Consolidation Analysis

### Extending the Same Logic to Reps

**Current Approach**: Two separate types
- **reps-only**: Rep progression only (bodyweight exercises)
- **double**: Rep progression until max, then weight progression

**Proposed Approach**: Single unified type following the same pattern

```typescript
type ProgressionType = 'linear' | 'reps' | 'time';

interface ProgressionConfig {
  type: ProgressionType;
  weightIncrement: number;
  weightDecrement: number;
  repsIncrement?: number; // Only for reps
  repsDecrement?: number; // Only for reps
  timeIncrement?: number; // Only for time
  timeDecrement?: number; // Only for time
  
  // Controls behavior for multi-stage progressions
  enableWeightProgression?: boolean; // For both reps and time types
}
```

### Implementation Examples

**Reps-Only Progression** (current reps-only):
```typescript
progression: {
  type: 'reps',
  weightIncrement: 0, // Unused when enableWeightProgression = false
  weightDecrement: 0, // Unused when enableWeightProgression = false
  repsIncrement: 1,
  repsDecrement: 2,
  enableWeightProgression: false // Reps-only mode
}
```

**Reps-Weight Progression** (current double):
```typescript
progression: {
  type: 'reps',
  weightIncrement: 5,
  weightDecrement: 10,
  repsIncrement: 1,
  repsDecrement: 1,
  enableWeightProgression: true // Reps → weight mode
}
// Still requires repRange: { min: 5, max: 8 }
```

### Final Consolidated Type System

```typescript
type ProgressionType = 'linear' | 'reps' | 'time';

// The three fundamental progression patterns:
// 1. linear: weight only
// 2. reps: reps only OR reps → weight (configurable)
// 3. time: time only OR time → weight (configurable)
```

### UI Design for Unified Approach

**Reps Progression**:
```
Progression Type: [Rep Progression ▼]
┌─────────────────────────────────────┐
│ Rep Increase: [1] rep               │
│ Rep Decrease: [1] rep               │
│ ☑ Also progress weight when reps maxed │
│ Weight Increase: [5] lbs            │
│ Weight Decrease: [10] lbs           │
└─────────────────────────────────────┘
```

**Time Progression**:
```
Progression Type: [Time Progression ▼]
┌─────────────────────────────────────┐
│ Time Increase: [10] seconds         │
│ Time Decrease: [15] seconds         │
│ ☑ Also progress weight when time maxed │
│ Weight Increase: [5] lbs            │
│ Weight Decrease: [10] lbs           │
└─────────────────────────────────────┘
```

### Benefits of Full Consolidation

1. **Conceptual Consistency**: Same pattern for both reps and time
2. **Three Core Concepts**: Linear (weight), Reps (with optional weight), Time (with optional weight)
3. **Natural Learning Curve**: Start simple, add complexity when needed
4. **Simplified Mental Model**: All multi-stage progressions work the same way
5. **Reduced Type Complexity**: 3 types instead of 5

### Implementation Logic

```typescript
function calculateRepsProgression(template: Template, history: History[]): { weight: number, reps: number } {
  const currentReps = getCurrentReps(template, history);
  const currentWeight = getCurrentWeight(template, history);
  
  if (!template.progression.enableWeightProgression) {
    // REPS-ONLY MODE: Simple rep progression
    if (lastSetWasSuccessful(history)) {
      return { 
        weight: currentWeight, // Weight never changes
        reps: currentReps + template.progression.repsIncrement 
      };
    } else {
      return { 
        weight: currentWeight,
        reps: Math.max(currentReps - template.progression.repsDecrement, template.repRange.min)
      };
    }
  } else {
    // REPS-WEIGHT MODE: Reps until max, then add weight
    if (currentReps < template.repRange.max) {
      return { 
        weight: currentWeight, 
        reps: currentReps + template.progression.repsIncrement 
      };
    } else {
      return { 
        weight: currentWeight + template.progression.weightIncrement, 
        reps: template.repRange.min 
      };
    }
  }
}
```

### Perfect Symmetry

This creates **perfect conceptual symmetry**:

- **Linear**: Pure weight progression
- **Reps**: Rep progression (optionally → weight)  
- **Time**: Time progression (optionally → weight)

All multi-stage progressions follow the **same pattern**: progress primary metric until max, then add weight and reset primary metric.

### Real-World User Journey

**Beginner Bodyweight Training**:
1. Start with `type: 'reps'`, `enableWeightProgression: false`
2. Progress push-ups from 5 → 10 → 15 reps
3. Later enable weight progression for weighted vest/backpack
4. Now progress 5-8 reps, add weight, reset to 5 reps

**Isometric Training**:
1. Start with `type: 'time'`, `enableWeightProgression: false`  
2. Progress plank from 30s → 60s → 90s
3. Later enable weight progression for weighted planks
4. Now progress 30-60s, add weight, reset to 30s

This approach is **significantly more intuitive** and follows natural training progression patterns.

## Double Progression Deep Dive: Real-World Scenario Analysis

### Your Specific Example: Dumbbell Bench Press

**Configuration**:
```typescript
{
  exerciseId: "dumbbell-bench-press",
  progression: {
    type: 'reps',
    enableWeightProgression: true,
    weightIncrement: 5, // Per dumbbell or total? (Important consideration)
    weightDecrement: 5,
    repsIncrement: 1,
    repsDecrement: 1
  },
  repRange: { min: 6, max: 8 },
  startingWeight: 25 // lbs per dumbbell
}
```

**Progression Sequence**:
```
Week 1: 25 lbs × 6 reps → Success → Progress to 7 reps
Week 2: 25 lbs × 7 reps → Success → Progress to 8 reps  
Week 3: 25 lbs × 8 reps → Success → Add weight, reset reps
Week 4: 30 lbs × 6 reps → Success → Progress to 7 reps
Week 5: 30 lbs × 7 reps → Success → Progress to 8 reps
Week 6: 30 lbs × 8 reps → Failure → Stay at same weight/reps
Week 7: 30 lbs × 8 reps → Failure → Stay at same weight/reps  
Week 8: 30 lbs × 8 reps → Failure → DELOAD TRIGGERED (3 failures)
```

### Critical Design Questions

#### 1. Weight Increment Granularity
**For Dumbbells**: Is +5 lbs per dumbbell (10 lbs total) or +5 lbs total (2.5 lbs per dumbbell)?

```typescript
// Option A: Per dumbbell (more common)
weightIncrement: 5 // 25 → 30 per dumbbell (10 lbs total jump)

// Option B: Total weight  
weightIncrement: 5 // 50 → 55 total (2.5 per dumbbell)
```

**Recommendation**: Per dumbbell is more intuitive and matches gym equipment.

#### 2. Deload Patterns in Double Progression

**Common Deload Strategies**:

1. **Weight-Only Deload** (Most Common):
   ```
   Failure: 30 lbs × 8 reps
   Deload: 25 lbs × 6 reps (previous weight, reset reps)
   ```

2. **Rep-Only Deload**:
   ```
   Failure: 30 lbs × 8 reps  
   Deload: 30 lbs × 6 reps (same weight, reset reps)
   ```

3. **Percentage-Based Deload**:
   ```
   Failure: 30 lbs × 8 reps
   Deload: 27.5 lbs × 6 reps (90% of failed weight)
   ```

#### 3. Enhanced Progression Configuration

```typescript
interface ProgressionConfig {
  type: 'reps';
  enableWeightProgression: boolean;
  
  // Success progression - supports both fixed and percentage increments
  incrementType: 'fixed' | 'percentage';
  weightIncrement: number; // Fixed amount (e.g., 5 lbs) OR percentage (e.g., 2.5%)
  repsIncrement: number;
  
  // Rounding configuration for percentage calculations
  roundingIncrement: number; // Round to nearest X (e.g., 2.5, 5, 10)
  
  // Failure handling
  deloadStrategy: 'weight-only' | 'reps-only' | 'percentage';
  deloadType: 'fixed' | 'percentage'; // NEW: How to calculate deload amount
  deloadAmount: number; // Fixed amount OR percentage for deload
  failureThreshold: number; // Consecutive failures before deload (default: 3)
}
```

### Enhanced Progression Logic with Percentage Support

```typescript
function calculateRepsProgression(
  template: Template, 
  history: History[]
): { weight: number, reps: number } {
  const currentReps = getCurrentReps(template, history);
  const currentWeight = getCurrentWeight(template, history);
  const consecutiveFailures = getConsecutiveFailures(history);
  
  // Check for deload condition
  if (consecutiveFailures >= template.progression.failureThreshold) {
    return handleDeload(template, currentWeight, currentReps);
  }
  
  // Check for success progression
  if (lastSetWasSuccessful(history)) {
    if (!template.progression.enableWeightProgression) {
      // REPS-ONLY MODE
      return { 
        weight: currentWeight, 
        reps: currentReps + template.progression.repsIncrement 
      };
    } else {
      // DOUBLE PROGRESSION MODE
      if (currentReps < template.repRange.max) {
        // Increase reps
        return { 
          weight: currentWeight, 
          reps: currentReps + template.progression.repsIncrement 
        };
      } else {
        // Add weight, reset reps
        const newWeight = calculateNewWeight(currentWeight, template.progression);
        return { 
          weight: newWeight, 
          reps: template.repRange.min 
        };
      }
    }
  }
  
  // No change (failure but not enough for deload)
  return { weight: currentWeight, reps: currentReps };
}

function calculateNewWeight(currentWeight: number, progression: ProgressionConfig): number {
  let newWeight: number;
  
  if (progression.incrementType === 'percentage') {
    // Percentage-based increment (e.g., +2.5% of current weight)
    const increment = currentWeight * (progression.weightIncrement / 100);
    newWeight = currentWeight + increment;
  } else {
    // Fixed increment (e.g., +5 lbs)
    newWeight = currentWeight + progression.weightIncrement;
  }
  
  // Round to nearest specified increment
  return roundToNearest(newWeight, progression.roundingIncrement);
}

function handleDeload(
  template: Template, 
  currentWeight: number, 
  currentReps: number
): { weight: number, reps: number } {
  let newWeight: number;
  
  switch (template.progression.deloadStrategy) {
    case 'weight-only':
      if (template.progression.deloadType === 'percentage') {
        // Percentage-based deload (e.g., -10% of current weight)
        const reduction = currentWeight * (template.progression.deloadAmount / 100);
        newWeight = currentWeight - reduction;
      } else {
        // Fixed deload (e.g., -5 lbs)
        newWeight = currentWeight - template.progression.deloadAmount;
      }
      
      return {
        weight: roundToNearest(newWeight, template.progression.roundingIncrement),
        reps: template.repRange.min
      };
      
    case 'reps-only':
      return {
        weight: currentWeight,
        reps: template.repRange.min
      };
      
    case 'percentage':
      // Legacy support - treat as percentage deload
      newWeight = currentWeight * (template.progression.deloadAmount / 100);
      return {
        weight: roundToNearest(newWeight, template.progression.roundingIncrement),
        reps: template.repRange.min
      };
      
    default:
      return { weight: currentWeight, reps: currentReps };
  }
}

function roundToNearest(value: number, increment: number): number {
  return Math.round(value / increment) * increment;
}
```

### Your Scenario With Enhanced Design

#### Option A: Fixed Weight Increments (Traditional)
```typescript
{
  exerciseId: "dumbbell-bench-press",
  progression: {
    type: 'reps',
    enableWeightProgression: true,
    
    // Fixed increment progression
    incrementType: 'fixed',
    weightIncrement: 5, // +5 lbs per dumbbell
    repsIncrement: 1,
    roundingIncrement: 2.5, // Round to nearest 2.5 lbs
    
    // Deload configuration
    deloadStrategy: 'weight-only',
    deloadType: 'fixed',
    deloadAmount: 5, // -5 lbs per dumbbell
    failureThreshold: 3
  },
  repRange: { min: 6, max: 8 }
}
```

#### Option B: Percentage-Based Increments (Auto-Scaling)
```typescript
{
  exerciseId: "dumbbell-bench-press",
  progression: {
    type: 'reps',
    enableWeightProgression: true,
    
    // Percentage increment progression
    incrementType: 'percentage',
    weightIncrement: 2.5, // +2.5% of current weight
    repsIncrement: 1,
    roundingIncrement: 2.5, // Round to nearest 2.5 lbs
    
    // Deload configuration
    deloadStrategy: 'weight-only',
    deloadType: 'percentage',
    deloadAmount: 10, // -10% of current weight
    failureThreshold: 3
  },
  repRange: { min: 6, max: 8 }
}
```

### Progression Examples: Fixed vs Percentage

#### Fixed Increment Example:
```
Week 1: 25 lbs × 6 → 25 lbs × 7 → 25 lbs × 8 → 30 lbs × 6 (+5 lbs)
Week 4: 30 lbs × 6 → 30 lbs × 7 → 30 lbs × 8 → 35 lbs × 6 (+5 lbs)
Week 7: 35 lbs × 6 → 35 lbs × 7 → 35 lbs × 8 → 40 lbs × 6 (+5 lbs)
```

#### Percentage Increment Example (2.5%):
```
Week 1: 25 lbs × 6 → 25 lbs × 7 → 25 lbs × 8 → 27.5 lbs × 6 (+2.5 lbs, 2.5% of 25)
Week 4: 27.5 lbs × 6 → 27.5 lbs × 7 → 27.5 lbs × 8 → 30 lbs × 6 (+2.5 lbs, 2.5% rounded)
Week 7: 30 lbs × 6 → 30 lbs × 7 → 30 lbs × 8 → 32.5 lbs × 6 (+2.5 lbs, 2.5% rounded)
Week 10: 50 lbs × 6 → 50 lbs × 7 → 50 lbs × 8 → 52.5 lbs × 6 (+2.5 lbs, 2.5% rounded)
```

**Key Advantage of Percentage**: As you get stronger, the absolute increases get larger automatically!

**Complete Progression Sequence**:
```
Week 1: 25 lbs × 6 → Success → 25 lbs × 7
Week 2: 25 lbs × 7 → Success → 25 lbs × 8  
Week 3: 25 lbs × 8 → Success → 30 lbs × 6 (add weight, reset reps)
Week 4: 30 lbs × 6 → Success → 30 lbs × 7
Week 5: 30 lbs × 7 → Success → 30 lbs × 8
Week 6: 30 lbs × 8 → Failure → 30 lbs × 8 (failure count: 1)
Week 7: 30 lbs × 8 → Failure → 30 lbs × 8 (failure count: 2)
Week 8: 30 lbs × 8 → Failure → 25 lbs × 6 (deload: weight-only)
Week 9: 25 lbs × 6 → Success → 25 lbs × 7 (rebuild)
```

### Database Schema Updates

```typescript
interface ProgramExercise {
  programId: string;
  exerciseId: string;
  maxWeight: number; // Current working weight
  maxReps: number; // Current working reps (for double progression)
  lastUpdated: Date;
  consecutiveFailures: number; // Track failure count
  progression: {
    type: 'linear' | 'reps' | 'time';
    enableWeightProgression?: boolean;
    
    // Success progression
    weightIncrement: number;
    repsIncrement?: number;
    timeIncrement?: number;
    
    // Deload configuration
    deloadStrategy: 'weight-only' | 'reps-only' | 'percentage';
    deloadPercentage?: number;
    failureThreshold: number;
    weightDecrement?: number;
    repsDecrement?: number;
    timeDecrement?: number;
  };
}
```

### Answer to Your Questions

1. **Does our design support double progression?** 
   ✅ **Yes**, with the enhanced deload configuration

2. **Is weight increment configurable per exercise?**
   ✅ **Yes**, each exercise has its own `ProgramExercise` configuration

3. **What's common for deload in double progression?**
   📊 **Weight-only deload** is most common: drop weight by one increment, reset reps to minimum

4. **How many failures before deload?**
   📊 **2-3 failures** is standard, configurable per exercise

5. **Deload by dropping reps vs weight?**
   📊 **Weight drop + rep reset** is most effective for strength building

### Enhanced UI Configuration Examples

#### Fixed Increment UI:
```
Exercise: Dumbbell Bench Press
┌─────────────────────────────────────┐
│ Progression Type: [Rep Progression ▼] │
│ Rep Range: [6] to [8] reps          │
│ ☑ Also progress weight when maxed    │
│                                     │
│ Success Progression:                │
│ ├─ Rep Increase: [1] rep            │
│ ├─ Weight Type: [Fixed Amount ▼]     │
│ ├─ Weight Increase: [5] lbs         │
│ └─ Round to nearest: [2.5] lbs      │
│                                     │
│ Deload Settings:                    │
│ ├─ Trigger: [3] consecutive failures │
│ ├─ Strategy: [Weight + Reset Reps ▼] │
│ ├─ Deload Type: [Fixed Amount ▼]     │
│ └─ Weight Decrease: [5] lbs         │
└─────────────────────────────────────┘
```

#### Percentage Increment UI:
```
Exercise: Dumbbell Bench Press
┌─────────────────────────────────────┐
│ Progression Type: [Rep Progression ▼] │
│ Rep Range: [6] to [8] reps          │
│ ☑ Also progress weight when maxed    │
│                                     │
│ Success Progression:                │
│ ├─ Rep Increase: [1] rep            │
│ ├─ Weight Type: [Percentage ▼]       │
│ ├─ Weight Increase: [2.5] %         │
│ └─ Round to nearest: [2.5] lbs      │
│                                     │
│ Deload Settings:                    │
│ ├─ Trigger: [3] consecutive failures │
│ ├─ Strategy: [Weight + Reset Reps ▼] │
│ ├─ Deload Type: [Percentage ▼]       │
│ └─ Weight Decrease: [10] %          │
└─────────────────────────────────────┘
```

### Rounding Configuration Benefits

**Common Rounding Values**:
- **2.5 lbs**: Standard for most dumbbells and barbells with fractional plates
- **5 lbs**: Standard for basic home gyms without fractional plates  
- **10 lbs**: For very heavy lifts or limited equipment
- **1 lb**: For machines with fine adjustments

**Real-World Rounding Examples**:
```typescript
// 25 lbs + 2.5% = 25.625 lbs
roundToNearest(25.625, 2.5) // → 25.5 lbs
roundToNearest(25.625, 5)   // → 25 lbs  
roundToNearest(25.625, 10)  // → 30 lbs

// 37 lbs + 2.5% = 37.925 lbs  
roundToNearest(37.925, 2.5) // → 37.5 lbs
roundToNearest(37.925, 5)   // → 40 lbs
roundToNearest(37.925, 10)  // → 40 lbs
```

The enhanced design **fully supports** your dumbbell bench press scenario with realistic, configurable deload patterns!

## Time-Based Progression Analysis: Comprehensive Design Review

### Current Time Progression Design Assessment

Looking at our current design for time-based progressions, we have some gaps that need addressing:

**Current Design**:
```typescript
progression: {
  type: 'time',
  timeIncrement: 10, // seconds
  timeDecrement: 15, // seconds (for deload)
  enableWeightProgression: true, // For time → weight progression
  weightIncrement: 5,
  weightDecrement: 10
}
```

### Issues with Current Time Design

1. **No Percentage-Based Time Progression**: Unlike weight progression, we don't support percentage-based time increments
2. **Limited Deload Strategy**: Only simple time decrement, no sophisticated deload patterns
3. **Missing Time/Weight Deload Logic**: What happens when both time AND weight need to be deloaded?
4. **No Configurable Rounding for Time**: Time should also support rounding (e.g., to nearest 5 seconds)

### Enhanced Time Progression Configuration

```typescript
interface TimeProgressionConfig {
  type: 'time';
  enableWeightProgression: boolean;
  
  // Time progression - supports both fixed and percentage increments
  timeIncrementType: 'fixed' | 'percentage';
  timeIncrement: number; // Fixed seconds (e.g., 10) OR percentage (e.g., 10%)
  timeRoundingIncrement: number; // Round to nearest X seconds (e.g., 5)
  
  // Weight progression (when enableWeightProgression = true)
  weightIncrementType: 'fixed' | 'percentage';
  weightIncrement: number; // Fixed lbs OR percentage
  weightRoundingIncrement: number; // Round to nearest X lbs
  
  // Deload configuration
  deloadStrategy: 'time-only' | 'weight-only' | 'time-then-weight' | 'percentage';
  deloadTimeType: 'fixed' | 'percentage';
  deloadWeightType: 'fixed' | 'percentage';
  deloadTimeAmount: number; // Fixed seconds OR percentage for time deload
  deloadWeightAmount: number; // Fixed lbs OR percentage for weight deload
  failureThreshold: number; // Consecutive failures before deload
}
```

### Time Progression Examples

#### Fixed Time Increment (Traditional):
```typescript
{
  exerciseId: "plank-hold",
  progression: {
    type: 'time',
    enableWeightProgression: false,
    
    // Fixed time progression
    timeIncrementType: 'fixed',
    timeIncrement: 10, // +10 seconds each success
    timeRoundingIncrement: 5, // Round to nearest 5 seconds
    
    // Deload configuration
    deloadStrategy: 'time-only',
    deloadTimeType: 'fixed',
    deloadTimeAmount: 15, // -15 seconds on deload
    failureThreshold: 3
  },
  timeRange: { min: 30, max: 120 } // 30s to 2 minutes
}
```

#### Percentage-Based Time Increment:
```typescript
{
  exerciseId: "plank-hold",
  progression: {
    type: 'time',
    enableWeightProgression: false,
    
    // Percentage time progression
    timeIncrementType: 'percentage',
    timeIncrement: 10, // +10% of current time
    timeRoundingIncrement: 5, // Round to nearest 5 seconds
    
    // Deload configuration
    deloadStrategy: 'percentage',
    deloadTimeType: 'percentage',
    deloadTimeAmount: 20, // -20% of current time on deload
    failureThreshold: 3
  },
  timeRange: { min: 30, max: 300 } // 30s to 5 minutes
}
```

### Time/Weight Progression: Complete Scenario

#### Configuration for Weighted Plank:
```typescript
{
  exerciseId: "weighted-plank",
  progression: {
    type: 'time',
    enableWeightProgression: true,
    
    // Time progression (primary)
    timeIncrementType: 'fixed',
    timeIncrement: 10, // +10 seconds each success
    timeRoundingIncrement: 5, // Round to nearest 5 seconds
    
    // Weight progression (secondary, when time maxed)
    weightIncrementType: 'fixed',
    weightIncrement: 5, // +5 lbs when time maxed
    weightRoundingIncrement: 2.5, // Round to nearest 2.5 lbs
    
    // Deload configuration
    deloadStrategy: 'time-then-weight', // Try time deload first, then weight
    deloadTimeType: 'fixed',
    deloadTimeAmount: 15, // -15 seconds
    deloadWeightType: 'fixed', 
    deloadWeightAmount: 5, // -5 lbs if time deload insufficient
    failureThreshold: 3
  },
  timeRange: { min: 30, max: 60 }, // 30s to 1 minute before adding weight
  startingWeight: 0 // Start bodyweight
}
```

### Complete Weighted Plank Progression Journey

#### Phase 1: Time-Only Progression (Bodyweight)
```
Week 1: 0 lbs × 30s → Success → 0 lbs × 40s (+10s)
Week 2: 0 lbs × 40s → Success → 0 lbs × 50s (+10s)
Week 3: 0 lbs × 50s → Success → 0 lbs × 60s (+10s, hit max time)
Week 4: 0 lbs × 60s → Success → 5 lbs × 30s (add weight, reset time)
```

#### Phase 2: Time/Weight Progression (Weighted)
```
Week 5: 5 lbs × 30s → Success → 5 lbs × 40s (+10s)
Week 6: 5 lbs × 40s → Success → 5 lbs × 50s (+10s)  
Week 7: 5 lbs × 50s → Success → 5 lbs × 60s (+10s, hit max time)
Week 8: 5 lbs × 60s → Success → 10 lbs × 30s (add weight, reset time)
```

#### Phase 3: Plateau and Deload Scenarios

**Scenario A: Failure at Heavy Weight**
```
Week 12: 20 lbs × 45s → Failure → 20 lbs × 45s (failure count: 1)
Week 13: 20 lbs × 45s → Failure → 20 lbs × 45s (failure count: 2)
Week 14: 20 lbs × 45s → Failure → DELOAD TRIGGERED

// Deload Strategy: 'time-then-weight'
// First try: Reduce time by 15s
Week 15: 20 lbs × 30s (45s - 15s = 30s, back to minimum time)
```

**Scenario B: Time Deload Insufficient, Weight Deload Needed**
```
Week 15: 20 lbs × 30s → Failure → 20 lbs × 30s (failure count: 1)
Week 16: 20 lbs × 30s → Failure → 20 lbs × 30s (failure count: 2)  
Week 17: 20 lbs × 30s → Failure → DELOAD TRIGGERED AGAIN

// Time already at minimum (30s), so deload weight
Week 18: 15 lbs × 30s (20 - 5 = 15 lbs weight deload)
```

### Enhanced Time Progression Logic

```typescript
function calculateTimeProgression(
  template: Template, 
  history: History[]
): { weight: number, time: number } {
  const currentTime = getCurrentTime(template, history);
  const currentWeight = getCurrentWeight(template, history);
  const consecutiveFailures = getConsecutiveFailures(history);
  
  // Check for deload condition
  if (consecutiveFailures >= template.progression.failureThreshold) {
    return handleTimeDeload(template, currentWeight, currentTime);
  }
  
  // Check for success progression
  if (lastSetWasSuccessful(history)) {
    if (!template.progression.enableWeightProgression) {
      // TIME-ONLY MODE
      const newTime = calculateNewTime(currentTime, template.progression);
      return { 
        weight: currentWeight, 
        time: Math.min(newTime, template.timeRange.max) // Cap at max
      };
    } else {
      // TIME-WEIGHT MODE
      if (currentTime < template.timeRange.max) {
        // Still progressing time
        const newTime = calculateNewTime(currentTime, template.progression);
        return { 
          weight: currentWeight, 
          time: newTime 
        };
      } else {
        // Hit max time - add weight, reset time
        const newWeight = calculateNewWeight(currentWeight, template.progression);
        return { 
          weight: newWeight, 
          time: template.timeRange.min 
        };
      }
    }
  }
  
  // No change (failure but not enough for deload)
  return { weight: currentWeight, time: currentTime };
}

function calculateNewTime(currentTime: number, progression: TimeProgressionConfig): number {
  let newTime: number;
  
  if (progression.timeIncrementType === 'percentage') {
    // Percentage-based increment (e.g., +10% of current time)
    const increment = currentTime * (progression.timeIncrement / 100);
    newTime = currentTime + increment;
  } else {
    // Fixed increment (e.g., +10 seconds)
    newTime = currentTime + progression.timeIncrement;
  }
  
  // Round to nearest specified increment
  return roundToNearest(newTime, progression.timeRoundingIncrement);
}

function handleTimeDeload(
  template: Template, 
  currentWeight: number, 
  currentTime: number
): { weight: number, time: number } {
  switch (template.progression.deloadStrategy) {
    case 'time-only':
      return handleTimeOnlyDeload(template, currentWeight, currentTime);
      
    case 'weight-only':
      return handleWeightOnlyDeload(template, currentWeight, currentTime);
      
    case 'time-then-weight':
      return handleTimeThenWeightDeload(template, currentWeight, currentTime);
      
    case 'percentage':
      return handlePercentageDeload(template, currentWeight, currentTime);
      
    default:
      return { weight: currentWeight, time: currentTime };
  }
}

function handleTimeThenWeightDeload(
  template: Template, 
  currentWeight: number, 
  currentTime: number
): { weight: number, time: number } {
  // First try to deload time
  let newTime: number;
  
  if (template.progression.deloadTimeType === 'percentage') {
    const reduction = currentTime * (template.progression.deloadTimeAmount / 100);
    newTime = currentTime - reduction;
  } else {
    newTime = currentTime - template.progression.deloadTimeAmount;
  }
  
  newTime = roundToNearest(newTime, template.progression.timeRoundingIncrement);
  
  // If time deload gets us to minimum or below, deload weight instead
  if (newTime <= template.timeRange.min) {
    // Deload weight, keep time at current value
    let newWeight: number;
    
    if (template.progression.deloadWeightType === 'percentage') {
      const reduction = currentWeight * (template.progression.deloadWeightAmount / 100);
      newWeight = currentWeight - reduction;
    } else {
      newWeight = currentWeight - template.progression.deloadWeightAmount;
    }
    
    return {
      weight: roundToNearest(newWeight, template.progression.weightRoundingIncrement),
      time: template.timeRange.min // Reset to minimum time
    };
  }
  
  // Time deload is sufficient
  return { weight: currentWeight, time: newTime };
}
```

### Real-World Time Progression Examples

#### Percentage vs Fixed Time Progression

**Fixed +10 seconds**:
```
30s → 40s → 50s → 60s → 70s → 80s → 90s
(+10s each time, linear growth)
```

**Percentage +20%**:
```
30s → 36s → 43s → 52s → 62s → 74s → 89s
(Accelerating growth, harder at higher times)
```

#### Does Percentage Time Make Sense?

**Yes, for specific scenarios**:

1. **Conditioning Work**: Building endurance capacity scales better with percentage
2. **Rehabilitation**: Gradual percentage increases are safer
3. **Advanced Athletes**: Linear time increases become too aggressive

**Example: Dead Hang Progression**
- **Beginner**: Fixed +5s works well (20s → 25s → 30s)
- **Intermediate**: Percentage +15% scales better (60s → 69s → 79s vs 60s → 65s → 70s)

### UI Configuration for Enhanced Time Progression

```
Exercise: Weighted Plank
┌─────────────────────────────────────┐
│ Progression Type: [Time Progression ▼] │
│ Time Range: [30] to [60] seconds    │
│ ☑ Also progress weight when time maxed │
│                                     │
│ Time Progression:                   │
│ ├─ Type: [Fixed Amount ▼]            │
│ ├─ Time Increase: [10] seconds      │
│ └─ Round to nearest: [5] seconds    │
│                                     │
│ Weight Progression:                 │
│ ├─ Type: [Fixed Amount ▼]            │
│ ├─ Weight Increase: [5] lbs         │
│ └─ Round to nearest: [2.5] lbs      │
│                                     │
│ Deload Settings:                    │
│ ├─ Trigger: [3] consecutive failures │
│ ├─ Strategy: [Time then Weight ▼]    │
│ ├─ Time Deload: [15] seconds        │
│ └─ Weight Deload: [5] lbs           │
└─────────────────────────────────────┘
```

### Summary: Complete Time Progression Coverage

✅ **Fixed time increments**: +10 seconds, +15 seconds, etc.
✅ **Percentage time increments**: +10%, +20% of current time  
✅ **Time rounding**: Round to nearest 5s, 10s, etc.
✅ **Time-only progression**: Pure time increase without weight
✅ **Time → Weight progression**: Time until max, then add weight
✅ **Multiple deload strategies**: Time-only, weight-only, time-then-weight
✅ **Percentage-based deloads**: For both time and weight
✅ **Intelligent deload logic**: Falls back to weight deload when time hits minimum

The enhanced design now **comprehensively covers all time-based progression scenarios** with the same flexibility and sophistication as our weight-based progressions!

## Rep Count Tracking: Cached vs History-Based Analysis

### The Question: Where Do We Track Current Rep Counts?

For rep progression (double progression), we need to know:
- Current rep count for each exercise
- When to progress reps vs when to add weight
- How to handle deloads that affect rep counts

### Option 1: History-Based Rep Tracking (No Caching)

**How it works**:
```typescript
function getCurrentReps(programId: string, exerciseId: string): number {
  const lastWorkout = getLastWorkout(programId, exerciseId);
  const workingSets = lastWorkout.sets.filter(s => s.load === 1.0); // 100% working sets
  return Math.max(...workingSets.map(s => s.completedReps));
}
```

**Pros**:
- ✅ Always accurate (no cache drift)
- ✅ Self-correcting if user manually adjusts workout
- ✅ No additional storage needed
- ✅ Works naturally with workout editing/deletion

**Cons**:
- ❌ Slower lookups (O(n) history search)
- ❌ Complex logic to determine "current" rep count
- ❌ Difficult to handle partial workout completion
- ❌ Hard to preview next workout without calculating

### Option 2: Cached Rep Tracking (Like Weights)

**How it works**:
```typescript
interface ProgramExercise {
  programId: string;
  exerciseId: string;
  maxWeight: number; // Cached current max weight
  currentReps: number; // NEW: Cached current rep count
  currentTime?: number; // NEW: Cached current time (for time progression)
  lastUpdated: Date;
  consecutiveFailures: number;
  progression: ProgressionConfig;
}

// Update cached reps when progression occurs
function updateCurrentReps(programId: string, exerciseId: string, newReps: number) {
  updateProgramExercise(programId, exerciseId, { 
    currentReps: newReps, 
    lastUpdated: new Date() 
  });
}
```

**Pros**:
- ✅ Fast O(1) lookups for UI
- ✅ Easy to preview next workout
- ✅ Simple progression logic
- ✅ Consistent with weight caching approach

**Cons**:
- ❌ Can get out of sync with actual workout history
- ❌ Requires careful update logic
- ❌ Manual fixes needed if cache drifts
- ❌ Additional storage complexity

### Option 3: Hybrid Approach (Recommended)

**Cache with history validation**:
```typescript
interface ProgramExercise {
  programId: string;
  exerciseId: string;
  
  // Cached values for performance
  maxWeight: number;
  currentReps: number;
  currentTime?: number;
  
  // Validation tracking
  lastUpdated: Date;
  consecutiveFailures: number;
  lastWorkoutId?: string; // Track which workout these values came from
  
  progression: ProgressionConfig;
}

function getCurrentRepsWithValidation(programId: string, exerciseId: string): number {
  const cached = getCachedCurrentReps(programId, exerciseId);
  const lastWorkout = getLastWorkout(programId, exerciseId);
  
  // If workout is newer than cache, recalculate
  if (lastWorkout.date > cached.lastUpdated) {
    const actualReps = calculateRepsFromHistory(programId, exerciseId);
    
    if (actualReps !== cached.currentReps) {
      console.warn(`Rep count drift detected: cached=${cached.currentReps}, actual=${actualReps}`);
      updateCurrentReps(programId, exerciseId, actualReps);
    }
    
    return actualReps;
  }
  
  return cached.currentReps;
}
```

### Progression State Tracking Analysis

**For Double Progression, we need to track**:
1. **Current weight**: Already cached ✅
2. **Current rep count**: New requirement
3. **Position in rep range**: Derived from current reps
4. **Failure count**: Already planned ✅

**For Time Progression, we need to track**:
1. **Current weight**: Already cached ✅  
2. **Current time**: New requirement
3. **Position in time range**: Derived from current time
4. **Failure count**: Already planned ✅

### Implementation Recommendations

#### Cache Current Progression State

```typescript
interface ProgramExercise {
  programId: string;
  exerciseId: string;
  
  // Cached progression state
  maxWeight: number; // Working weight for percentage calculations
  currentReps?: number; // Current rep count (for rep progression)
  currentTime?: number; // Current time duration (for time progression)
  
  // Metadata
  lastUpdated: Date;
  lastWorkoutId: string; // Which workout these values came from
  consecutiveFailures: number;
  
  progression: ProgressionConfig;
}
```

#### Update Logic

```typescript
function completeWorkout(workoutId: string, exerciseResults: ExerciseResult[]) {
  for (const result of exerciseResults) {
    const progression = getProgressionConfig(result.exerciseId);
    
    if (progression.type === 'reps' && progression.enableWeightProgression) {
      // Double progression - update both weight and reps
      const success = checkProgressionSuccess(result);
      
      if (success) {
        if (result.completedReps < progression.repRange.max) {
          // Progress reps
          updateCurrentReps(programId, result.exerciseId, result.completedReps + 1);
        } else {
          // Progress weight, reset reps
          updateMaxWeight(programId, result.exerciseId, result.weight + progression.weightIncrement);
          updateCurrentReps(programId, result.exerciseId, progression.repRange.min);
        }
        resetFailureCount(programId, result.exerciseId);
      } else {
        incrementFailureCount(programId, result.exerciseId);
        // Check for deload threshold
      }
    }
    
    // Update metadata
    updateLastWorkout(programId, result.exerciseId, workoutId);
  }
}
```

### UI Benefits of Caching

**Workout Preview**:
```typescript
// Can instantly show next workout without history calculation
function generateNextWorkout(programId: string, routineId: string): WorkoutPreview {
  const exercises = getRoutineExercises(routineId);
  
  return exercises.map(exercise => {
    const programExercise = getProgramExercise(programId, exercise.id);
    const progression = programExercise.progression;
    
    if (progression.type === 'reps') {
      return {
        exerciseId: exercise.id,
        targetWeight: programExercise.maxWeight,
        targetReps: programExercise.currentReps, // Fast O(1) lookup
        repRange: exercise.repRange
      };
    }
    
    // Similar logic for other progression types
  });
}
```

**Progress Tracking UI**:
```typescript
// Can show current state without expensive calculations
function getProgressionStatus(programId: string, exerciseId: string): ProgressionStatus {
  const programExercise = getProgramExercise(programId, exerciseId);
  
  if (programExercise.progression.type === 'reps') {
    return {
      currentWeight: programExercise.maxWeight,
      currentReps: programExercise.currentReps,
      nextTarget: programExercise.currentReps < repRange.max 
        ? `${programExercise.currentReps + 1} reps`
        : `${programExercise.maxWeight + weightIncrement} lbs × ${repRange.min} reps`,
      progressionProgress: (programExercise.currentReps - repRange.min) / (repRange.max - repRange.min)
    };
  }
}
```

### Conclusion: Cache Current Progression State

**Recommended approach**: Cache `currentReps` and `currentTime` in `ProgramExercise` table alongside `maxWeight`.

**Benefits**:
- ✅ **Performance**: Fast UI updates and workout generation
- ✅ **Consistency**: Same pattern as weight caching
- ✅ **User Experience**: Instant workout previews and progress tracking
- ✅ **Validation**: Can detect drift and auto-correct

**Implementation**:
- Cache gets updated after each completed workout
- Include `lastWorkoutId` for validation
- Optional history validation for data integrity
- Clear update logic in workout completion flow

This maintains the performance benefits while ensuring data accuracy through validation mechanisms.
