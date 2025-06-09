import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import ShortUniqueId from "short-unique-id";
import { type MyDatabase } from "./db";
import { threeBy8 } from "./programs-threeBy8";
import { fiveBy5 } from "./programs-fiveBy5";
import { madcow } from "./programs-madcow";
import { five31 } from "./programs-five31";
import { five31Hypertrophy } from "./programs-five31-hypertrophy";
import { five31Trident } from "./programs-five31-trident";
import { Square } from "lucide-react";
import { five31Fusion } from "./programs-five31-fusion";

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
    exercises: {
      type: "array",
      items: {
        type: "object",
        properties: {
          exerciseId: {
            type: "string",
            maxLength: 100,
          },
          duration: {
            type: "number",
            description: "duration in seconds",
          },
          exerciseWeight: {
            type: "object",
            properties: {
              value: {
                type: "number", // max weight for the exercise
              },
              units: {
                type: "string",
                enum: ["kg", "lbs"],
              },
            },
            required: ["value", "units"],
          },
        },
        required: ["exerciseId", "exerciseWeight"],
      },
      default: [],
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

export const defaultProgram = fiveBy5;

export async function initPrograms(db: MyDatabase) {
  await db.addCollections({
    programs: {
      schema: programsSchema,
      methods: programsDocMethods,
      statics: programsCollectionMethods,
    },
  });

  // generate initial programs
  await db.programs.insertIfNotExists(fiveBy5);
  await db.programs.insertIfNotExists(threeBy8);
  await db.programs.insertIfNotExists(madcow);
  await db.programs.insertIfNotExists(five31);
  await db.programs.insertIfNotExists(five31Hypertrophy);
  await db.programs.insertIfNotExists(five31Trident);
  await db.programs.insertIfNotExists(five31Fusion);

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
