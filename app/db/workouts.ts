import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
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
    name: {
      type: "string",
    },
    order: {
      type: "number",
    },
  },
  required: ["id", "programId", "name", "order"],
  indexes: ["programId"],
} as const; // <- It is important to set 'as const' to preserve the literal type

const uid = new ShortUniqueId({ length: 16 });

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
    },
  });

  // generate initial workouts
  db.workouts.insertIfNotExists({
    id: "madcow-workout-1",
    programId: "madcow",
    name: "Workout A",
    order: 1,
  });

  db.workouts.insertIfNotExists({
    id: "madcow-workout-2",
    programId: "madcow",
    name: "Workout B",
    order: 2,
  });

  db.workouts.insertIfNotExists({
    id: "madcow-workout-3",
    programId: "madcow",
    name: "Workout C",
    order: 3,
  });

  // add a postInsert-hook
  db.workouts.postInsert(
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
