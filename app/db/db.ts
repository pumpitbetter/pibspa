import {
  createRxDatabase,
  type RxCollection,
  type RxDatabase,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb/plugins/core";

import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
} from "rxdb";

import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { addRxPlugin } from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import ShortUniqueId from "short-unique-id";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";

const uid = new ShortUniqueId({ length: 16 });

if (process.env.NODE_ENV === "development") {
  console.log("Development mode enabled");
  addRxPlugin(RxDBDevModePlugin);
}

//
// setup the types
//

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
    },
  },
  required: ["clientId", "weigthUnit"],
  //indexes: ["firstName"],
} as const; // <- It is important to set 'as const' to preserve the literal type

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

export type MyDatabaseCollections = {
  settings: SettingsCollection;
};

export type MyDatabase = RxDatabase<MyDatabaseCollections>;

//
// using the types
//

// wrap the validation around the main RxStorage
const storage = wrappedValidateAjvStorage({
  storage: getRxStorageDexie(),
});

export const db: MyDatabase = await createRxDatabase<MyDatabaseCollections>({
  name: "db",
  storage,
});

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

await db.addCollections({
  settings: {
    schema: settingsSchema,
    methods: settingsDocMethods,
    statics: settingsCollectionMethods,
  },
});

export const defaultSettings: SettingsDocType = {
  clientId: uid.rnd(),
  weigthUnit: "lbs", // <- only 'kg' or 'lbs' allowed
};

// generate initial settings
db.settings
  .findOne()
  .exec()
  .then((doc) => {
    if (!doc) {
      console.log("inserting initial settings");
      db.settings.insert(defaultSettings);
    }
  });

// add a postInsert-hook
db.settings.postInsert(
  function myPostInsertHook(
    this: SettingsCollection, // own collection is bound to the scope
    docData: SettingsDocType, // documents data
    doc: SettingsDocument // RxDocument
  ) {
    console.log("insert to " + this.name + "-collection: " + doc.clientId);
  },
  false // not async
);
