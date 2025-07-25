# RxDB Migration Setup

This file documents the RxDB migration setup and how to add future migrations.

## How Migrations Work

- Each collection schema has a `version` field starting at 0
- Migration strategies are defined for version transitions (1, 2, 3, etc.)
- **Version 0 schemas do NOT need migration strategies** - they are the initial schema
- Migration strategies are for transforming existing documents when upgrading schema versions
- Initial data seeding is handled via `count === 0` checks after collection creation

## Current Collections (All Version 0)

All collections are currently at version 0 and have **no active migration strategies**:

- **exercises**: Uses `bulkInsert` for initial seed data (count === 0)
- **programs**: Uses `bulkInsert` for initial seed data (count === 0)
- **routines**: Uses `bulkInsert` for initial seed data (count === 0)
- **templates**: Uses `bulkInsert` for efficient template seeding (count === 0)
- **settings**: Creates default settings on first run (count === 0)
- **sets**: No initial seeding needed
- **workouts**: No initial seeding needed
- **history**: No initial seeding needed
- **progressExerciseFavorites**: No initial seeding needed

## Migration Strategy Pattern

### Version 0 (Current)

```typescript
export async function initCollection(db: MyDatabase) {
  await db.addCollections({
    collection: {
      schema: collectionSchema, // version: 0
      methods: collectionDocMethods,
      statics: collectionCollectionMethods,
      // No migration strategies needed for version 0
      // When you need to migrate to version 1, uncomment and modify:
      /*
      migrationStrategies: {
        // Version 1: Example migration from version 0 to 1
        1: async function (oldDoc: any) {
          // Transform old document to new schema
          // Example: oldDoc.newField = 'defaultValue';
          return oldDoc;
        },
      },
      */
    },
  });

  // Initial data seeding (only for version 0)
  const count = await db.collection.count().exec();
  if (count === 0) {
    // Seed initial data here
  }
}
```

## Adding a New Migration

When you need to change a schema, follow these steps:

### Step 1: Update the schema version

```typescript
export const exampleSchemaLiteral = {
  title: "example schema",
  version: 1, // Increment from 0 to 1
  // ... add new fields or modify existing ones
  properties: {
    // ... existing fields
    newField: {
      type: "string",
      default: "defaultValue",
    },
  },
};
```

### Step 2: Uncomment and add migration strategy

```typescript
export async function initExample(db: MyDatabase) {
  await db.addCollections({
    example: {
      schema: exampleSchema, // now version: 1
      methods: exampleDocMethods,
      statics: exampleCollectionMethods,
      // Now migration strategies are required!
      migrationStrategies: {
        // Version 1: Migration from version 0 to 1
        1: async function (oldDoc: any) {
          // Transform old document to new schema
          oldDoc.newField = "defaultValue"; // Add new field
          return oldDoc;
        },
      },
    },
  });

  // Note: No count === 0 seeding needed for version 1+
  // Data already exists from version 0
}
```

### Step 3: Handle additional versions

For version 2, 3, etc., add more migration strategies:

```typescript
migrationStrategies: {
  1: async function (oldDoc: any) {
    // 0 -> 1 migration
    oldDoc.newField = 'defaultValue';
    return oldDoc;
  },
  2: async function (oldDoc: any) {
    // 1 -> 2 migration
    oldDoc.anotherField = calculateValue(oldDoc);
    return oldDoc;
  },
},
```

## Important Notes

- **Never remove migration strategies** - they're needed for users upgrading from older versions
- **Migration strategies are cumulative** - a user going from version 0 to version 2 will run migrations 1 AND 2
- **Test migrations thoroughly** - data corruption can occur if migrations fail
- **Initial seeding only happens once** at version 0 - don't add seeding to migration strategies
  return {
  ...oldDoc,
  newField: 'default value', // Add new fields
  // Remove or transform existing fields as needed
  };
  },
  }
  ```

  ```

3. **Test the migration** by:
   - Creating a database with the old schema
   - Adding some test data
   - Updating to the new schema version
   - Verifying data migrates correctly

## Example Migration Scenarios

### Adding a New Field

```typescript
// Version 1 migration: Add 'category' field to exercises
1: async function (oldDoc: any) {
  return {
    ...oldDoc,
    category: oldDoc.type === 'strength' ? 'resistance' : 'cardio'
  };
}
```

### Renaming a Field

```typescript
// Version 1 migration: Rename 'weigthUnit' to 'weightUnit'
1: async function (oldDoc: any) {
  return {
    ...oldDoc,
    weightUnit: oldDoc.weigthUnit, // Copy to new field name
    weigthUnit: undefined // Remove old field
  };
}
```

### Changing Field Type

```typescript
// Version 1 migration: Convert string array to object array
1: async function (oldDoc: any) {
  return {
    ...oldDoc,
    tags: oldDoc.tags.map((tag: string) => ({ name: tag, active: true }))
  };
}
```

## Best Practices

1. **Always increment version numbers** - never skip versions
2. **Test migrations thoroughly** before deploying
3. **Keep migration logic simple** - complex transforms should be broken into multiple versions
4. **Document breaking changes** in migration comments
5. **Consider data validation** after migrations complete
6. **Backup important data** before running migrations in production

## Seeding vs Migrations

- **Seeding**: Only runs when collection is empty (first time setup)
- **Migrations**: Run automatically when schema version changes
- **Both**: Can be combined - use version 0 for initial seeding, higher versions for schema changes

## Template Seeding Refactor (COMPLETED)

**Status**: ✅ Completed - All template seeding now uses efficient `bulkInsert`

### What was changed:

- **Madcow Templates**: Converted to `madcowTemplatesData` array with bulkInsert
- **FiveBy5 Templates**: Converted to `fiveBy5TemplatesData` array with bulkInsert
- **ThreeBy8 Templates**: Converted to `threeBy8TemplatesData` array with bulkInsert
- **5/3/1 Templates**: Converted to `five31TemplatesData` array with bulkInsert
- **5/3/1 Hypertrophy Templates**: Converted to `five31HypertrophyTemplatesData` array with bulkInsert
- **5/3/1 Trident Templates**: Converted to `five31TridentTemplatesData` array with bulkInsert
- **5/3/1 Fusion Templates**: Uses dynamic generation but already has efficient bulkInsert

### Performance improvements:

- Replaced slow `insertIfNotExists` loops with single `bulkInsert` operations
- Reduced template seeding time from ~several seconds to ~milliseconds
- All template data is now pre-defined in typed arrays for better maintainability

### Files updated:

- `templates-madcow.ts` - Now exports `madcowTemplatesData`
- `templates-fiveBy5.ts` - Now exports `fiveBy5TemplatesData`
- `templates-threeBy8.ts` - Now exports `threeBy8TemplatesData`
- `templates-531.ts` - Now exports `five31TemplatesData`
- `template-531-hypertrophy.ts` - Now exports `five31HypertrophyTemplatesData`
- `template-531-trident.ts` - Now exports `five31TridentTemplatesData`
- `template-531-fusion.ts` - Already optimized with bulkInsert
- `templates.ts` - Updated to use all new data arrays with bulkInsert
