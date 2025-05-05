import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
import { type MyDatabase } from "./db";

export const routinesSchemaLiteral = {
  title: "routines schema",
  description: "describes program routines",
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

const schemaTyped = toTypedRxJsonSchema(routinesSchemaLiteral);

// aggregate the document type from the schema
export type RoutinesDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export type RoutinesDocMethods = {
  scream: (v: string) => string;
};

export type RoutinesDocument = RxDocument<RoutinesDocType, RoutinesDocMethods>;

// we declare one static ORM-method for the collection
export type RoutinesCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type RoutinesCollection = RxCollection<
  RoutinesDocType,
  RoutinesDocMethods,
  RoutinesCollectionMethods
>;

const routinesSchema: RxJsonSchema<RoutinesDocType> = routinesSchemaLiteral;

const routinesDocMethods: RoutinesDocMethods = {
  scream: function (this: RoutinesDocument) {
    return ""; //this.clientId + " weight units: " + this.weigthUnit;
  },
};

const routinesCollectionMethods: RoutinesCollectionMethods = {
  countAllDocuments: async function (this: RoutinesCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

export async function initRoutines(db: MyDatabase) {
  await db.addCollections({
    routines: {
      schema: routinesSchema,
      methods: routinesDocMethods,
      statics: routinesCollectionMethods,
    },
  });

  // generate initial routines
  await db.routines.insertIfNotExists({
    id: "madcow-routine-1",
    programId: "madcow",
    name: "Routine A",
    order: 1,
  });

  await db.routines.insertIfNotExists({
    id: "madcow-routine-2",
    programId: "madcow",
    name: "Routine B",
    order: 2,
  });

  await db.routines.insertIfNotExists({
    id: "madcow-routine-3",
    programId: "madcow",
    name: "Routine C",
    order: 3,
  });

  // add a postInsert-hook
  await db.routines.postInsert(
    function myPostInsertHook(
      this: RoutinesCollection, // own collection is bound to the scope
      docData: RoutinesDocType, // documents data
      doc: RoutinesDocument // RxDocument
    ) {
      // console.log("insert to " + this.name + "-collection: " + doc.id);
    },
    false // not async
  );
}
