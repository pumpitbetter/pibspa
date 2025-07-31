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
import { fiveDayUpperLowerTemplatesData } from "./templates-five-day-upper-lower";

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
    
    // Weight configuration (optional for static exercises like flows)
    load: {
      type: "number", // Percentage of cached max weight (0.85 = 85%)
    },
    
    // Rep configuration (for both fixed reps and rep progression)
    repRange: {
      type: "object",
      properties: {
        min: {
          type: "number",
        },
        max: {
          type: "number",
        },
      },
      required: ["min", "max"],
      description: "Use min=max for fixed reps (e.g., {min: 5, max: 5}), or min<max for progression (e.g., {min: 6, max: 8})",
    },
    
    // Time configuration (for time progression)
    timeRange: {
      type: "object",
      properties: {
        min: {
          type: "number", // seconds
        },
        max: {
          type: "number", // seconds
        },
      },
      required: ["min", "max"],
    },
    
    // Fixed duration in seconds (for flow exercises)
    duration: {
      type: "number", // Fixed duration in seconds (for flow exercises)
    },
    
    // Workout structure (keep existing)
    amrep: {
      type: "boolean",
      default: false,
    },
    restTime: {
      type: "number", // Seconds between sets
    },
    
    // Progression configuration (optional - presence indicates progression enabled)
    progressionConfig: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["linear", "reps", "time", "none"],
        },
        progressionSets: {
          type: "array",
          items: {
            type: "number",
          },
          description: "Which set orders count for progression (e.g., [3] for only 3rd set). If null/empty, all sets count.",
        },
        enableWeightProgression: {
          type: "boolean",
          description: "For reps/time types - whether to also progress weight",
        },
        incrementType: {
          type: "string",
          enum: ["fixed", "percentage"],
        },
        weightIncrement: {
          type: "number",
          description: "Fixed lbs OR percentage for weight progression",
        },
        repsIncrement: {
          type: "number",
          description: "Rep increment for reps type progression",
        },
        timeIncrement: {
          type: "number",
          description: "Time increment in seconds for time type progression",
        },
        weightRoundingIncrement: {
          type: "number",
          description: "Rounding increment for percentage calculations (e.g., 2.5, 5, 10 lbs)",
        },
        timeRoundingIncrement: {
          type: "number",
          description: "Rounding increment for time calculations (e.g., 5, 10 seconds)",
        },
        deloadStrategy: {
          type: "string",
          enum: ["weight-only", "reps-only", "time-only", "time-then-weight", "percentage"],
        },
        deloadType: {
          type: "string",
          enum: ["fixed", "percentage"],
        },
        deloadAmount: {
          type: "number",
          description: "Fixed amount OR percentage for deload",
        },
        failureThreshold: {
          type: "number",
          description: "Consecutive failures before deload",
        },
      },
      required: ["type"],
      description: "Optional progression configuration. Presence indicates progression is enabled for this template.",
    },
  },
  required: [
    "id",
    "programId",
    "routineId", 
    "exerciseId",
    "order",
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
    await db.templates.bulkInsert(fiveDayUpperLowerTemplatesData);

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
