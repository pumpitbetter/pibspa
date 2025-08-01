import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
import { type MyDatabase } from "./db";
import { programsData } from "./programs-data";
import { fiveBy5 } from "./programs-fiveBy5";

export const programsSchemaLiteral = {
  title: "programs schema",
  description: "describes app programs",
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
    description: {
      type: "string",
      maxLength: 1000,
    },
    type: {
      type: "string",
      enum: ["strength", "cardio"],
      default: "strength",
    },
    level: {
      type: "string",
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    ownerId: {
      type: "string",
      maxLength: 100,
    },
  },
  required: ["id", "name", "description", "type", "level", "ownerId"],
  //indexes: ["firstName"],
} as const; // <- It is important to set 'as const' to preserve the literal type

const uid = new ShortUniqueId({ length: 16 });

const schemaTyped = toTypedRxJsonSchema(programsSchemaLiteral);

// aggregate the document type from the schema
export type ProgramsDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export type ProgramsDocMethods = {
  scream: (v: string) => string;
};

export type ProgramsDocument = RxDocument<ProgramsDocType, ProgramsDocMethods>;

// we declare one static ORM-method for the collection
export type ProgramsCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type ProgramsCollection = RxCollection<
  ProgramsDocType,
  ProgramsDocMethods,
  ProgramsCollectionMethods
>;

const programsSchema: RxJsonSchema<ProgramsDocType> = programsSchemaLiteral;

const programsDocMethods: ProgramsDocMethods = {
  scream: function (this: ProgramsDocument) {
    return ""; //this.clientId + " weight units: " + this.weigthUnit;
  },
};

const programsCollectionMethods: ProgramsCollectionMethods = {
  countAllDocuments: async function (this: ProgramsCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

export const defaultProgram = fiveBy5;

export async function initPrograms(db: MyDatabase) {
  await db.addCollections({
    programs: {
      schema: programsSchema,
      methods: programsDocMethods,
      statics: programsCollectionMethods,
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
  const count = await db.programs.count().exec();
  if (count === 0) {
    // Generate initial programs using bulk insert
    await db.programs.bulkInsert(programsData);
  }

  // add a postInsert-hook
  await db.programs.postInsert(
    function myPostInsertHook(
      this: ProgramsCollection, // own collection is bound to the scope
      docData: ProgramsDocType, // documents data
      doc: ProgramsDocument // RxDocument
    ) {
      // console.log("insert to " + this.name + "-collection: " + doc.id);
    },
    false // not async
  );
}
