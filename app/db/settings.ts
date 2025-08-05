import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
import { type MyDatabase } from "./db";

export const settingsSchemaLiteral = {
  title: "settings schema",
  description: "describes app settings",
  version: 0,
  keyCompression: false,
  primaryKey: "clientId",
  type: "object",
  properties: {
    clientId: {
      type: "string",
      maxLength: 100, // <- the primary key must have set maxLength
    },
    weigthUnit: {
      type: "string", // <- only 'kg' or 'lbs' allowed
      enum: ["kg", "lbs"],
      default: "lbs",
    },
    barbellWeight: {
      type: "number",
      default: 45,
    },
    ezbarWeight: {
      type: "number",
      default: 20,
    },
    plates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          weight: {
            type: "number",
          },
          count: {
            type: "number",
          },
        },
        required: ["weight", "count"],
      },
    },
    programId: {
      // current program id
      type: "string",
      maxLength: 100,
      default: "sl5x5",
    },
  },
  required: ["clientId", "weigthUnit"],
  //indexes: ["firstName"],
} as const; // <- It is important to set 'as const' to preserve the literal type

const uid = new ShortUniqueId({ length: 16 });

const schemaTyped = toTypedRxJsonSchema(settingsSchemaLiteral);

// aggregate the document type from the schema
export type SettingsDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export type SettingsDocMethods = {
  scream: (v: string) => string;
};

export type SettingsDocument = RxDocument<SettingsDocType, SettingsDocMethods>;

// we declare one static ORM-method for the collection
export type SettingsCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type SettingsCollection = RxCollection<
  SettingsDocType,
  SettingsDocMethods,
  SettingsCollectionMethods
>;

const settingsSchema: RxJsonSchema<SettingsDocType> = settingsSchemaLiteral;

const settingsDocMethods: SettingsDocMethods = {
  scream: function (this: SettingsDocument) {
    return this.clientId + " weight units: " + this.weigthUnit;
  },
};

const settingsCollectionMethods: SettingsCollectionMethods = {
  countAllDocuments: async function (this: SettingsCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
};

export const defaultSettings: SettingsDocType = {
  clientId: uid.rnd(),
  weigthUnit: "lbs", // <- only 'kg' or 'lbs' allowed
  barbellWeight: 45,
  ezbarWeight: 20,
  plates: [
    { weight: 2.5, count: 2 },
    { weight: 5, count: 2 },
    { weight: 10, count: 4 },
    { weight: 25, count: 2 },
    { weight: 35, count: 2 },
    { weight: 45, count: 4 },
  ],
  programId: "5x5",
};

export async function initSettings(db: MyDatabase) {
  await db.addCollections({
    settings: {
      schema: settingsSchema,
      methods: settingsDocMethods,
      statics: settingsCollectionMethods,
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
  const count = await db.settings.count().exec();
  if (count === 0) {
    // Generate initial settings
    await db.settings.insert(defaultSettings);
  }

  // add a postInsert-hook
  await db.settings.postInsert(
    function myPostInsertHook(
      this: SettingsCollection, // own collection is bound to the scope
      docData: SettingsDocType, // documents data
      doc: SettingsDocument // RxDocument
    ) {
      // console.log("insert to " + this.name + "-collection: " + doc.clientId);
    },
    false // not async
  );
}
