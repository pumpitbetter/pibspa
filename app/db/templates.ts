import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
import { type MyDatabase } from "./db";
import { madcowTemplatesData } from "./templates-madcow";
import { fiveBy5TemplatesData } from "./templates-fiveBy5";
import { threeBy8TemplatesData } from "./templates-threeBy8";
import { five31TemplatesData, init531Templates } from "./templates-531";
import {
  five31HypertrophyTemplatesData,
  init531HypertrophyTemplates,
} from "./template-531-hypertrophy";
import {
  five31TridentTemplatesData,
  init531TridentTemplates,
} from "./template-531-trident";
import { init531FusionTemplates } from "./template-531-fusion";

// routine set template
// belongs to a particular program > routine
export const templatesSchemaLiteral = {
  title: "templates schema",
  description: "describes program templates",
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
    exerciseId: {
      type: "string",
      maxLength: 100,
    },
    order: {
      // if the order is the same for two or more template items in a row, then it's a circuit and `sequence` is used to determine the circuit order
      type: "number",
    },
    sequence: {
      // if not a circuit, then this is null
      type: "number",
    },
    load: {
      type: "number",
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
        increment: {
          type: "object",
          properties: {
            value: {
              type: "number",
            },
            kind: {
              type: "string",
              enum: ["weight", "seconds"],
            },
            type: {
              type: "string",
              enum: ["absolute", "percentage"],
            },
            frequency: {
              type: "number",
            },
          },
        },
        decrement: {
          type: "object",
          properties: {
            value: {
              type: "number",
            },
            kind: {
              type: "string",
              enum: ["weight", "seconds"],
            },
            type: {
              type: "string",
              enum: ["absolute", "percentage"],
            },
            frequency: {
              type: "number",
            },
          },
        },
      },
    },
  },
  required: [
    "id",
    "programId",
    "routineId",
    "exerciseId",
    "order",
    "load",
    "reps",
  ],
  indexes: ["programId"],
} as const; // <- It is important to set 'as const' to preserve the literal type

const uid = new ShortUniqueId({ length: 16 });

const schemaTyped = toTypedRxJsonSchema(templatesSchemaLiteral);

// aggregate the document type from the schema
export type TemplatesDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export type TemplatesDocMethods = {
  scream: (v: string) => string;
};

export type TemplatesDocument = RxDocument<
  TemplatesDocType,
  TemplatesDocMethods
>;

// we declare one static ORM-method for the collection
export type TemplatesCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type TemplatesCollection = RxCollection<
  TemplatesDocType,
  TemplatesDocMethods,
  TemplatesCollectionMethods
>;

const templatesSchema: RxJsonSchema<TemplatesDocType> = templatesSchemaLiteral;

const templatesDocMethods: TemplatesDocMethods = {
  scream: function (this: TemplatesDocument) {
    return ""; //this.clientId + " weight units: " + this.weigthUnit;
  },
};

const templatesCollectionMethods: TemplatesCollectionMethods = {
  countAllDocuments: async function (this: TemplatesCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

export async function initTemplates(db: MyDatabase) {
  await db.addCollections({
    templates: {
      schema: templatesSchema,
      methods: templatesDocMethods,
      statics: templatesCollectionMethods,
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

  // Seed initial data if collection is empty (proper RxDB pattern)
  const count = await db.templates.count().exec();
  if (count === 0) {
    // Use bulk insert for converted templates (better performance)
    await db.templates.bulkInsert(madcowTemplatesData);
    await db.templates.bulkInsert(fiveBy5TemplatesData);
    await db.templates.bulkInsert(threeBy8TemplatesData);
    await db.templates.bulkInsert(five31TemplatesData);
    await db.templates.bulkInsert(five31HypertrophyTemplatesData);
    await db.templates.bulkInsert(five31TridentTemplatesData);

    // 5/3/1 Fusion uses dynamic generation, so we keep the function call
    await init531FusionTemplates(db);

    const totalCount = await db.templates.count().exec();
    console.log(`Templates initialized: ${totalCount} total records`);
  }

  // add a postInsert-hook
  await db.templates.postInsert(
    function myPostInsertHook(
      this: TemplatesCollection, // own collection is bound to the scope
      docData: TemplatesDocType, // documents data
      doc: TemplatesDocument // RxDocument
    ) {
      // console.log("insert to " + this.name + "-collection: " + doc.id);
    },
    false // not async
  );
}
