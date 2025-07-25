import type { RxJsonSchema, RxCollection, RxDatabase } from "rxdb";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

export const progressExerciseFavoritesSchema: RxJsonSchema<ProgressExerciseFavoritesDocType> =
  {
    title: "progress exercise favorites schema",
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
      id: {
        type: "string",
        maxLength: 100,
      },
      exerciseId: {
        type: "string",
        maxLength: 100,
      },
      createdAt: {
        type: "number",
        minimum: 0,
        maximum: new Date(2125, 1, 1).valueOf(),
        multipleOf: 1,
      },
    },
    required: ["id", "exerciseId", "createdAt"],
    indexes: ["exerciseId", "createdAt"],
  };

export type ProgressExerciseFavoritesDocType = {
  id: string;
  exerciseId: string;
  createdAt: number;
};

export const progressExerciseFavoritesDefaults: Partial<ProgressExerciseFavoritesDocType> =
  {};

export type ProgressExerciseFavoritesCollection =
  RxCollection<ProgressExerciseFavoritesDocType>;

export async function initProgressExerciseFavorites(db: RxDatabase<any>) {
  await db.addCollections({
    progressExerciseFavorites: {
      schema: progressExerciseFavoritesSchema,
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
}
