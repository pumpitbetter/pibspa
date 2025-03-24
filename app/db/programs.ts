import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
import { type MyDatabase } from "./db";

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
  },
  required: ["id", "name"],
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

export const defaultProgram: ProgramsDocType = {
  id: "five-by-five",
  name: "StrongLifts 5x5",
};

export async function initPrograms(db: MyDatabase) {
  await db.addCollections({
    programs: {
      schema: programsSchema,
      methods: programsDocMethods,
      statics: programsCollectionMethods,
    },
  });

  // generate initial programs
  db.programs
    .findOne()
    .exec()
    .then((doc) => {
      if (!doc) {
        db.programs.insert(defaultProgram);
      }
    });

  // add a postInsert-hook
  db.programs.postInsert(
    function myPostInsertHook(
      this: ProgramsCollection, // own collection is bound to the scope
      docData: ProgramsDocType, // documents data
      doc: ProgramsDocument // RxDocument
    ) {
      console.log("insert to " + this.name + "-collection: " + doc.id);
    },
    false // not async
  );
}
