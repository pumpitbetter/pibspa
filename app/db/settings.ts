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
};

export async function initSettings(db: MyDatabase) {
  await db.addCollections({
    settings: {
      schema: settingsSchema,
      methods: settingsDocMethods,
      statics: settingsCollectionMethods,
    },
  });

  // generate initial settings
  db.settings
    .findOne()
    .exec()
    .then((doc) => {
      if (!doc) {
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
}
