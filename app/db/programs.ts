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
  },
  required: ["id", "name", "description", "type", "level"],
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

const ss1: ProgramsDocType = {
  id: "ss1",
  name: "Starting Strength - Phase 1",
  description:
    "A beginner strength program that emphasizes rapid progression by increasing weight every workout through three sets of five reps of key compound lifts like squats, bench press, and deadlifts.",
  type: "strength",
  level: "beginner",
};

const sl5x5: ProgramsDocType = {
  id: "sl5x5",
  name: "StrongLifts 5x5",
  description:
    "A beginner strength program that emphasizes rapid progression by increasing weight every workout through five sets of five reps of key compound lifts like squats, bench press, and deadlifts.",
  type: "strength",
  level: "beginner",
};

const madcow: ProgramsDocType = {
  id: "madcow",
  name: "Madcow 5x5",
  description:
    "An intermediate strength program with weekly progression increasing weight of compound lifts like squats, bench press, and deadlifts.",
  type: "strength",
  level: "intermediate",
};

const w531bbb: ProgramsDocType = {
  id: "w531bbb",
  name: "Wendler 5/3/1 - Boring But Big",
  description:
    "An intermediate strength program with progression increasing weight of compound lifts every 4 week cycle.",
  type: "strength",
  level: "intermediate",
};

export const defaultProgram = sl5x5;

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
        db.programs.insert(sl5x5);
        db.programs.insert(ss1);
        db.programs.insert(madcow);
        db.programs.insert(w531bbb);
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
