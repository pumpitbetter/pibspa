import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
import { type MyDatabase } from "./db";
import { exercisesData } from "./exercises-data";

export const exercisesSchemaLiteral = {
  title: "exercises schema",
  description: "describes app exercises",
  version: 0,
  keyCompression: false,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100, // <- the primary key must have set maxLength
    },
    name: {
      type: "string",
    },
    type: {
      type: "string",
      enum: ["strength", "cardio", "mobility", "stretching"],
      maxLength: 20,
    },
    track: {
      type: "array",
      items: {
        type: "string",
        enum: ["weight", "time", "distance"],
      },
    },
    equipment: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "barbell",
          "dumbbell",
          "ezbar",
          "kettlebell",
          "band",
          "machine",
          "bodyweight",
          "treadmill",
          "bike",
          "elliptical",
          "rower",
          "stairmaster",
          "jumprope",
          "squatrack",
          "flatbench",
          "inclinebench",
          "pullupbar",
          "dipbar",
          "medicineball",
          "sled",
          "battlerope",
          "tire",
          "other",
          "none",
        ],
      },
    },
    tags: {
      type: "array",
      items: {
        type: "string",
        enum: ["compound", "isolation", "primary"],
      },
    },
  },
  required: ["id", "name", "type", "track", "equipment"],
  indexes: ["type"],
} as const; // <- It is important to set 'as const' to preserve the literal type

const uid = new ShortUniqueId({ length: 16 });

const schemaTyped = toTypedRxJsonSchema(exercisesSchemaLiteral);

// aggregate the document type from the schema
export type ExercisesDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export type ExercisesDocMethods = {
  scream: (v: string) => string;
};

export type ExercisesDocument = RxDocument<
  ExercisesDocType,
  ExercisesDocMethods
>;

// we declare one static ORM-method for the collection
export type ExercisesCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type ExercisesCollection = RxCollection<
  ExercisesDocType,
  ExercisesDocMethods,
  ExercisesCollectionMethods
>;

const exercisesSchema: RxJsonSchema<ExercisesDocType> = exercisesSchemaLiteral;

const exercisesDocMethods: ExercisesDocMethods = {
  scream: function (this: ExercisesDocument) {
    return ""; //this.clientId + " weight units: " + this.weigthUnit;
  },
};

const exercisesCollectionMethods: ExercisesCollectionMethods = {
  countAllDocuments: async function (this: ExercisesCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

export async function initExercises(db: MyDatabase) {
  await db.addCollections({
    exercises: {
      schema: exercisesSchema,
      methods: exercisesDocMethods,
      statics: exercisesCollectionMethods,
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

  // Check if we need to seed initial data (only on first run)
  const count = await db.exercises.count().exec();
  if (count === 0) {
    // Generate initial exercises using bulk insert
    await db.exercises.bulkInsert(exercisesData);
  }

  // add a postInsert-hook
  await db.exercises.postInsert(
    function myPostInsertHook(
      this: ExercisesCollection, // own collection is bound to the scope
      docData: ExercisesDocType, // documents data
      doc: ExercisesDocument // RxDocument
    ) {
      // console.log("insert to " + this.name + "-collection: " + doc.id);
    },
    false // not async
  );
}
