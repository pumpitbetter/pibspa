# Pump It Better - Configuration and Standards

## 🔒 SECURITY POLICY - READ FIRST

**⚠️ CRITICAL: NEVER include actual secrets, credentials, or sensitive data in .md files!**

- ❌ **NO real Apple Developer credentials** (Team ID, Apple ID, etc.)
- ❌ **NO app-specific passwords or API keys**
- ❌ **NO certificate hashes or private identifiers**
- ❌ **NO email addresses or personal information**
- ✅ **Reference `.env` variables instead** (e.g., "see `TEAM_ID` in `.env`")
- ✅ **Use placeholder examples** (e.g., `ABCD123456` for Team ID)

**Rationale**: All `.md` files are committed to git and become public. Use `.env` file for secrets (gitignored).

**For AI Assistants**: When working with this project, always reference `.env` variables instead of including actual values in any documentation files. Never suggest or include real credentials in code examples or documentation.

---

## Project Overview

PumpItBetter is a modern fitness tracking app built with React Router v7, Vite, and RxDB. It features a comprehensive exercise database, multiple training programs, and a 4-type progression system.

## Development Philosophy

### New App Principles ⚡

**BREAKING CHANGES PREFERRED** - This is a new app without existing users or data.

✅ **No Backward Compatibility** - Remove old patterns entirely rather than maintaining dual systems  
✅ **No Legacy Support** - Delete legacy code completely instead of deprecating  
✅ **Clean Architecture** - Favor smaller, focused code over complex migration logic  
✅ **Modern Patterns Only** - Use latest design patterns without fallbacks  
✅ **Breaking Schema Changes** - Make direct database changes rather than gradual migrations  
✅ **Simplified Code** - Choose cleaner implementations over compatibility layers

**When in doubt, choose the simpler solution that breaks existing patterns.**

## Current Architecture

### 4-Type Progression System

The app uses a modern **4-type progression system** that replaces all legacy progression logic:

1. **Linear Progression**: Direct weight increases (e.g., +5 lbs every session)
2. **Rep Progression**: Target reps → weight increase when achieved  
3. **Time Progression**: Duration targets → weight/time increase
4. **No Progression**: Static exercises (warm-ups, stretches)

#### Key Collections

- **`programExercises`**: Progression state and configuration per exercise
- **`templates`**: Workout structure with rep/time ranges
- **`exercises`**: Exercise master data with flow support
- **`history`**: Workout performance tracking

#### Progression Data Flow

1. **Queue Generation**: `enhanceTemplatesWithProgression()` calculates weights from progression state
2. **Workout Execution**: Performance tracked in history
3. **Completion**: `processWorkoutProgression()` analyzes performance and updates progression state
4. **Next Workout**: Updated weights based on new progression state

## Development Standards

### Utility Scripts

- **Location**: Use `/tmp` for all temporary utility scripts
- **Cleanup**: Always delete temp scripts after use (`rm /tmp/script-name.js`)
- **Rationale**: Keeps the codebase clean and prevents accumulation of one-off scripts

### Unified Progression System

The app uses a **unified double progression system** that handles all progression types through a single algorithm. This approach simplifies configuration and code maintenance while maintaining full flexibility.

#### How It Works

**All exercises use the same progression logic**:

- If current reps < max reps → progress reps
- If current reps = max reps → progress weight, reset to min reps

**Configuration Examples**:

**Linear Progression** (weight only):

```typescript
{
  repRange: { min: 5, max: 5 }, // Same min/max = no rep progression
  progression: {
    increment: [{ kind: 'weight', value: 5 }]
  }
}
```

**Double Progression** (reps then weight):

```typescript
{
  repRange: { min: 5, max: 8 }, // Rep range allows progression
  progression: {
    increment: [
      { kind: 'reps', value: 1 },
      { kind: 'weight', value: 5 }
    ]
  }
}
```

**Rep-Only Progression** (bodyweight exercises):

```typescript
{
  repRange: { min: 8, max: 15 }, // Wide rep range
  progression: {
    increment: [
      { kind: 'reps', value: 1 },
      { kind: 'weight', value: 0 } // No weight progression
    ]
  }
}
```

#### Benefits of Unified Approach

1. **Simplified Code**: Single progression algorithm handles all cases
2. **Flexible Configuration**: Any progression pattern through `repRange` settings
3. **Backward Compatible**: Existing linear progression works by setting `min = max`
4. **Consistent Logic**: No need for type checking or separate code paths
5. **Easy to Understand**: One system to learn and maintain

#### History-Based Rep Progression

**Architecture Decision**: Use history-based rep progression instead of storing current reps in the program schema.

**Benefits**:

- Programs remain lightweight (only track weight)
- Complete progression history is maintained
- More accurate progression based on actual performance
- Supports complex progression rules and conditions

**Helper Functions**:

- `getCurrentReps()`: Calculates target reps based on history and rep range
- `getLastExerciseHistory()`: Retrieves most recent completed set for an exercise

**Completed**:

- ✅ Updated templates schema to require array format for increment/decrement
- ✅ Converted all template files to use array format
- ✅ Removed legacy single-object progression support
- ✅ Created helper functions for array-based progression logic
- ✅ Updated route files to use helper functions
- ✅ Implemented realistic deloading logic
- ✅ Added history-based rep progression helper functions
- ✅ Updated queue route to calculate target reps based on history for double progression
- ✅ Added progression type field and rep range support to templates
- ✅ Updated workout completion logic to handle double progression
- ✅ Fixed TypeScript compilation issues with template creation

**Pending**:

- [ ] Add more double progression exercises to templates
- [ ] Test double progression workflow end-to-end
- [ ] Add deloading logic for failed attempts
- [ ] Consider adding rep progression visualization in the UI

### Database Schema Changes

**Templates** (`app/db/templates.ts`):

- `increment` and `decrement` are now always arrays of progression rules
- Each rule has `kind`, `value`, and optional `condition` properties

**Sets** (`app/db/sets.ts`):

- Removed legacy support for single increment/decrement objects
- All progression rules use array format consistently

**History** (`app/db/history.ts`):

- Already supports `targetReps` and `liftedReps` for tracking progression
- Used as source of truth for calculating current rep targets

### Deloading Logic

**Realistic Deloading Values**:

- Heavy leg exercises (squat, deadlift): 10 lbs
- Upper body compound: 5 lbs
- Accessories: 2.5 lbs

**Double Progression Deloading**:

1. First attempt: Reduce reps by 1 (if above minimum)
2. If at minimum reps: Reduce weight by appropriate amount
3. Reset to minimum reps when weight is reduced

### File Organization

**Core Files**:

- `app/db/templates-*.ts`: Program templates with progression rules
- `app/lib/progression-helpers.ts`: Progression calculation utilities
- `app/routes-spa/app_.workouts_.$workoutId/route.tsx`: Workout completion logic
- `app/routes-spa/app.queue/route.tsx`: Workout generation with target calculation
- `app/routes-ssr/_index.tsx`: SSR marketting page entry point

**Template Files**:
All template files now use consistent array-based progression format.

## iOS Development and Build Configuration

### Bundle Identifier Requirements

**CRITICAL: The bundle identifier MUST remain as `com.pumpitbetter.app`**

- ❌ Do NOT change the `.app` suffix even if Tauri warns about conflicts with macOS application bundle extensions
- ✅ This is a required configuration for this specific project
- ✅ Ignore Tauri warnings about `.app` suffix conflicts with macOS bundle extensions
- The bundle identifier is used in:
  - `src-tauri/tauri.conf.json` (identifier field)
  - `.env` file (BUNDLE_ID variable)
  - Apple Developer portal app registration
  - iOS provisioning profiles

### Apple Developer Configuration

**⚠️ SECURITY WARNING: NEVER include actual secrets in .md files - these are committed to git!**

**All sensitive credentials are stored in `.env` file (gitignored):**
- **Team ID**: Reference `TEAM_ID` variable in `.env` file
- **Apple ID**: Reference `APPLE_ID` variable in `.env` file  
- **App Name**: Reference `APP_NAME` variable in `.env` file
- **Bundle ID**: Reference `BUNDLE_ID` variable in `.env` file (DO NOT CHANGE)
- **App-Specific Password**: Reference `APP_SPECIFIC_PASSWORD` variable in `.env` file

**Cross-reference with `.env` file structure:**
```properties
APPLE_ID="your-apple-id@email.com"
APP_SPECIFIC_PASSWORD="your-app-password"
TEAM_ID="YOUR_TEAM_ID"
BUNDLE_ID="com.pumpitbetter.app"
APP_NAME="Pump It Better"
```

### iOS Device Information

- **Physical device UDID**: Reference development device UDID (stored securely, not in git)
- Device needs to be registered in Apple Developer portal for development builds
- For TestFlight/App Store builds, device registration is not required
- Use App Store distribution signing for TestFlight builds

### Build Configuration

- **React Router**: SPA mode (ssr: false)
- **Tauri**: iOS target with development team (see `TEAM_ID` in `.env`)
- **Fastlane**: Configured for iOS beta builds and TestFlight distribution

## Recent Changes

### 2025-08-05: Progression Engine & Test Suite

**Major Refactor: New Progression Engine**
- Created comprehensive progression engine (`app/lib/progression-engine.ts`) supporting:
  - Linear progression (5x5, Madcow)
  - Rep progression (5-8 reps → weight increase)
  - Time progression (duration-based)
  - Manual override detection and handling
- Implemented robust test suites for all progression types:
  - `progression.test.ts`: 5-Day Upper Lower (rep progression)
  - `progression-fiveBy5.test.ts`: 5x5 linear progression
  - `progression-madcow.test.ts`: Madcow ramping sets
- Fixed manual jump handling: respects user performance over current state
- Added deload logic after consecutive failures
- Supports weight rounding increments (2.5 lbs, 5 lbs)

**Template Schema Updates**
- Converted `reps: X` → `repRange: { min: X, max: X }` in template files
- Updated `template-531-trident.ts` for consistency
- All templates now use unified repRange format

**UI Improvements**
- Fixed edge-to-edge footer positioning in workout view
- Improved ActiveInfoPane layout and positioning

**Integration with Queue System**
- `processWorkoutProgression()` now uses new progression engine
- Maintains backward compatibility with existing database structure
- Workout completion triggers progression calculations automatically

### 2024-01-XX: Double Progression Implementation

- Implemented history-based rep progression for double progression exercises
- Updated queue route to calculate target reps based on workout history
- Added double progression handler in workout completion logic
- Fixed TypeScript issues with template array format requirements
- Ensured all template creation uses consistent array-based progression format

### CSS styling
- first check if you can use existing components from `app/components`
- second consider if we could import any components from shadcn at https://ui.shadcn.com/docs/components
- use Tailwind CSS theme defined in `app/app.css` which loosely follows Material Design 3 colors but create Tailwind classes
- design for both dark and light mode
- design responsive layouts using Tailwind's grid and flex utilities for all screen sizes
- otherwise use utility-first classes from Tailwind CSS for consistent styling

### Code Structure
- never edit anything in `app/routes` since that folder gets wiped on `npm run dev:ssr` or `npm run dev:spa`

### Code Quality Standards

- All TypeScript compilation must be error-free
- Use helper functions for progression logic rather than inline calculations
- Document complex progression rules with comments
- Test progression logic with realistic scenarios
- **Comprehensive test coverage**: All progression types must have corresponding test suites
- **Manual override support**: Progression engine must handle user manual jumps in weight/reps
- **Template consistency**: All templates use `repRange` format, not legacy `reps` format

### Git Commit Guidelines
- use guidelines from `docs/GIT_CONVENTIONS.md`

