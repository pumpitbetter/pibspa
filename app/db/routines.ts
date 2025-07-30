import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
import { type MyDatabase } from "./db";
import { madcowRoutines } from "./routines-madcow";
import { five31Routines } from "./routines-five31";
import { five31HypertrophyRoutines } from "./routines-five31-hypertrophy";
import { five31TridentRoutines } from "./routines-five31-trident";
import { five31FusionRoutines } from "./routines-five31-fusion";
import { threeBy8Routines } from "./routines-threeBy8";
import { fiveBy5Routines } from "./routines-fiveBy5";
import { fiveDayUpperLowerRoutines } from "./routines-five-day-upper-lower";

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
  const count = await db.routines.count().exec();
  if (count === 0) {
    // Generate initial routines using bulk insert
    await db.routines.bulkInsert(madcowRoutines);
    await db.routines.bulkInsert(fiveBy5Routines);
    await db.routines.bulkInsert(five31Routines);
    await db.routines.bulkInsert(five31HypertrophyRoutines);
    await db.routines.bulkInsert(five31TridentRoutines);
    await db.routines.bulkInsert(five31FusionRoutines);
    await db.routines.bulkInsert(threeBy8Routines);
    await db.routines.bulkInsert(fiveDayUpperLowerRoutines);
  }

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
