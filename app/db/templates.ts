import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
import { type MyDatabase } from "./db";
import { initMadcowTemplates } from "./templates-madcow";

// workout set template
// belongs to a particular program > workout
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
    workoutId: {
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
  },
  required: ["id", "workoutId", "exerciseId", "order", "load", "reps"],
  indexes: ["workoutId"],
} as const; // <- It is important to set 'as const' to preserve the literal type

const uid = new ShortUniqueId({ length: 16 });

const schemaTyped = toTypedRxJsonSchema(templatesSchemaLiteral);

// aggregate the document type from the schema
export type templatesDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export type TemplatesDocMethods = {
  scream: (v: string) => string;
};

export type TemplatesDocument = RxDocument<
  templatesDocType,
  TemplatesDocMethods
>;

// we declare one static ORM-method for the collection
export type TemplatesCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type TemplatesCollection = RxCollection<
  templatesDocType,
  TemplatesDocMethods,
  TemplatesCollectionMethods
>;

const templatesSchema: RxJsonSchema<templatesDocType> = templatesSchemaLiteral;

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
    },
  });

  // generate initial templates
  initMadcowTemplates(db);

  // add a postInsert-hook
  db.templates.postInsert(
    function myPostInsertHook(
      this: TemplatesCollection, // own collection is bound to the scope
      docData: templatesDocType, // documents data
      doc: TemplatesDocument // RxDocument
    ) {
      console.log("insert to " + this.name + "-collection: " + doc.id);
    },
    false // not async
  );
}
