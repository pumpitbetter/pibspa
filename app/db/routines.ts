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

  // Madcow routines
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

  //
  // Five31 routines
  //

  // Week 1
  await db.routines.insertIfNotExists({
    id: "531-1",
    programId: "531",
    name: "Day 1",
    order: 1,
  });

  await db.routines.insertIfNotExists({
    id: "531-2",
    programId: "531",
    name: "Day 2",
    order: 2,
  });

  await db.routines.insertIfNotExists({
    id: "531-3",
    programId: "531",
    name: "Day 3",
    order: 3,
  });

  await db.routines.insertIfNotExists({
    id: "531-4",
    programId: "531",
    name: "Day 4",
    order: 4,
  });

  // Week 2
  await db.routines.insertIfNotExists({
    id: "531-5",
    programId: "531",
    name: "Day 5",
    order: 5,
  });

  await db.routines.insertIfNotExists({
    id: "531-6",
    programId: "531",
    name: "Day 6",
    order: 6,
  });

  await db.routines.insertIfNotExists({
    id: "531-7",
    programId: "531",
    name: "Day 7",
    order: 7,
  });

  await db.routines.insertIfNotExists({
    id: "531-8",
    programId: "531",
    name: "Day 8",
    order: 8,
  });

  // Week 3
  await db.routines.insertIfNotExists({
    id: "531-9",
    programId: "531",
    name: "Day 9",
    order: 9,
  });

  await db.routines.insertIfNotExists({
    id: "531-10",
    programId: "531",
    name: "Day 10",
    order: 10,
  });

  await db.routines.insertIfNotExists({
    id: "531-11",
    programId: "531",
    name: "Day 11",
    order: 11,
  });

  await db.routines.insertIfNotExists({
    id: "531-12",
    programId: "531",
    name: "Day 12",
    order: 12,
  });

  // Week 4
  await db.routines.insertIfNotExists({
    id: "531-13",
    programId: "531",
    name: "Day 13",
    order: 13,
  });

  await db.routines.insertIfNotExists({
    id: "531-14",
    programId: "531",
    name: "Day 14",
    order: 14,
  });

  await db.routines.insertIfNotExists({
    id: "531-15",
    programId: "531",
    name: "Day 15",
    order: 15,
  });

  await db.routines.insertIfNotExists({
    id: "531-16",
    programId: "531",
    name: "Day 16",
    order: 16,
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
