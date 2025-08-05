import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import { type MyDatabase } from "./db";

export const workoutsSchemaLiteral = {
  title: "workouts schema",
  description: "describes program workouts",
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
    name: {
      type: "string",
    },
    startedAt: {
      type: "number",
      minimum: new Date(2025, 1, 1).valueOf(),
      maximum: new Date(2125, 1, 1).valueOf(),
      multipleOf: 1,
    },
    finishedAt: {
      type: ["number", "null"],
      default: null,
    },
  },
  required: ["id", "programId", "name", "startedAt"],
  indexes: ["programId", "startedAt"],
} as const; // <- It is important to set 'as const' to preserve the literal type



const schemaTyped = toTypedRxJsonSchema(workoutsSchemaLiteral);

// aggregate the document type from the schema
export type WorkoutsDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export type WorkoutsDocMethods = {
  scream: (v: string) => string;
};

export type WorkoutsDocument = RxDocument<WorkoutsDocType, WorkoutsDocMethods>;

// we declare one static ORM-method for the collection
export type WorkoutsCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type WorkoutsCollection = RxCollection<
  WorkoutsDocType,
  WorkoutsDocMethods,
  WorkoutsCollectionMethods
>;

const workoutsSchema: RxJsonSchema<WorkoutsDocType> = workoutsSchemaLiteral;

const workoutsDocMethods: WorkoutsDocMethods = {
  scream: function (this: WorkoutsDocument) {
    return ""; //this.clientId + " weight units: " + this.weigthUnit;
  },
};

const workoutsCollectionMethods: WorkoutsCollectionMethods = {
  countAllDocuments: async function (this: WorkoutsCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

export async function initWorkouts(db: MyDatabase) {
  await db.addCollections({
    workouts: {
      schema: workoutsSchema,
      methods: workoutsDocMethods,
      statics: workoutsCollectionMethods,
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
  await db.workouts.postInsert(
    function myPostInsertHook(
      this: WorkoutsCollection, // own collection is bound to the scope
      docData: WorkoutsDocType, // documents data
      doc: WorkoutsDocument // RxDocument
    ) {
      console.log("insert to " + this.name + "-collection: " + doc.id);
    },
    false // not async
  );
}
