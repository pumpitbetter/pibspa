import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
import { type MyDatabase } from "./db";

// history schema
export const historySchemaLiteral = {
  title: "history schema",
  description: "describes workout history",
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
      // if the order is the same for two or more history items in a row, then it's a circuit and `sequence` is used to determine the circuit order
      type: "number",
    },
    sequence: {
      // if not a circuit, then this is null
      type: "number",
    },
    load: {
      type: "number",
    },
    targetWeight: {
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
    targetReps: {
      type: "number",
    },
    liftedWeight: {
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
    liftedReps: {
      type: "number",
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
    "targetReps",
    "targetWeight",
  ],
  indexes: ["programId"],
} as const; // <- It is important to set 'as const' to preserve the literal type

const uid = new ShortUniqueId({ length: 16 });

const schemaTyped = toTypedRxJsonSchema(historySchemaLiteral);

// aggregate the document type from the schema
export type HistoryDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export type HistoryDocMethods = {
  scream: (v: string) => string;
};

export type HistoryDocument = RxDocument<HistoryDocType, HistoryDocMethods>;

// we declare one static ORM-method for the collection
export type HistoryCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type HistoryCollection = RxCollection<
  HistoryDocType,
  HistoryDocMethods,
  HistoryCollectionMethods
>;

const historySchema: RxJsonSchema<HistoryDocType> = historySchemaLiteral;

const historyDocMethods: HistoryDocMethods = {
  scream: function (this: HistoryDocument) {
    return ""; //this.clientId + " weight units: " + this.weigthUnit;
  },
};

const historyCollectionMethods: HistoryCollectionMethods = {
  countAllDocuments: async function (this: HistoryCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

export async function initHistory(db: MyDatabase) {
  await db.addCollections({
    history: {
      schema: historySchema,
      methods: historyDocMethods,
      statics: historyCollectionMethods,
    },
  });

  // add a postInsert-hook
  await db.history.postInsert(
    function myPostInsertHook(
      this: HistoryCollection, // own collection is bound to the scope
      docData: HistoryDocType, // documents data
      doc: HistoryDocument // RxDocument
    ) {
      console.log("insert to " + this.name + "-collection: " + doc.id);
    },
    false // not async
  );
}
