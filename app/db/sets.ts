import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
import { type MyDatabase } from "./db";

// routine set schema
// belongs to a particular program > routine
export const setsSchemaLiteral = {
  title: "sets schema",
  description: "describes program sets",
  version: 0,
  keyCompression: false,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100, // <- the primary key must have set maxLength
    },
    programId: {
      type: "string",
      maxLength: 100,
    },
    routineId: {
      type: "string",
      maxLength: 100,
    },
    workoutId: {
      type: "string",
      maxLength: 100,
    },
    exerciseId: {
      type: "string",
      maxLength: 100,
    },
    order: {
      // if the order is the same for two or more set items in a row, then it's a circuit and `sequence` is used to determine the circuit order
      type: "number",
    },
    sequence: {
      // if not a circuit, then this is null
      type: "number",
    },
    load: {
      type: "number",
    },
    weight: {
      type: "object",
      properties: {
        value: {
          type: "number", // max weight for the exercise
        },
        units: {
          type: "string",
          enum: ["kg", "lbs"],
        },
      },
      required: ["value", "units"],
    },
    reps: {
      type: "number",
    },
    amrep: {
      type: "boolean",
      default: false,
    },
    progression: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["linear", "double", "percentage"],
        },
        increment: {
          type: "array",
          items: {
            type: "object",
            properties: {
              value: {
                type: "number",
              },
              kind: {
                type: "string",
                enum: ["weight", "seconds", "reps"],
              },
              type: {
                type: "string",
                enum: ["absolute", "percentage"],
              },
              frequency: {
                type: "number",
              },
              condition: {
                type: "string",
              },
            },
            required: ["value", "kind", "type", "frequency"],
          },
        },
        decrement: {
          type: "array",
          items: {
            type: "object",
            properties: {
              value: {
                type: "number",
              },
              kind: {
                type: "string",
                enum: ["weight", "seconds", "reps"],
              },
              type: {
                type: "string",
                enum: ["absolute", "percentage"],
              },
              frequency: {
                type: "number",
              },
              condition: {
                type: "string",
              },
            },
            required: ["value", "kind", "type", "frequency"],
          },
        },
      },
    },
    completed: {
      type: "boolean",
      default: false,
    },
  },
  required: [
    "id",
    "programId",
    "routineId",
    "workoutId",
    "exerciseId",
    "order",
    "load",
    "reps",
  ],
  indexes: ["programId"],
} as const; // <- It is important to set 'as const' to preserve the literal type

const uid = new ShortUniqueId({ length: 16 });

const schemaTyped = toTypedRxJsonSchema(setsSchemaLiteral);

// aggregate the document type from the schema
export type SetsDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export type SetsDocMethods = {
  scream: (v: string) => string;
};

export type SetsDocument = RxDocument<SetsDocType, SetsDocMethods>;

// we declare one static ORM-method for the collection
export type SetsCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type SetsCollection = RxCollection<
  SetsDocType,
  SetsDocMethods,
  SetsCollectionMethods
>;

const setsSchema: RxJsonSchema<SetsDocType> = setsSchemaLiteral;

const setsDocMethods: SetsDocMethods = {
  scream: function (this: SetsDocument) {
    return ""; //this.clientId + " weight units: " + this.weigthUnit;
  },
};

const setsCollectionMethods: SetsCollectionMethods = {
  countAllDocuments: async function (this: SetsCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

export async function initSets(db: MyDatabase) {
  await db.addCollections({
    sets: {
      schema: setsSchema,
      methods: setsDocMethods,
      statics: setsCollectionMethods,
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

  // add a postInsert-hook
  await db.sets.postInsert(
    function myPostInsertHook(
      this: SetsCollection, // own collection is bound to the scope
      docData: SetsDocType, // documents data
      doc: SetsDocument // RxDocument
    ) {
      // console.log("insert to " + this.name + "-collection: " + doc.id);
    },
    false // not async
  );
}
