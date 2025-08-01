/**
 * Program Exercise Schema - RxDB Schema
 * 
 * Tracks progression state and configuration for each exercise within a program.
 * Uses the established RxDB pattern from the existing codebase.
 */

import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDocument,
  type RxJsonSchema,
} from "rxdb";
import { type MyDatabase } from "./db";

export const programExerciseSchemaLiteral = {
  title: "program exercise schema",
  description: "tracks progression state and configuration for exercises within programs",
  version: 0,
  keyCompression: false,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100, // Format: `${programId}-${exerciseId}`
    },
    programId: {
      type: "string",
      maxLength: 50,
    },
    exerciseId: {
      type: "string", 
      maxLength: 50,
    },
    
    // Cached progression state (optional for static exercises)
    maxWeight: {
      type: "number",
    },
    maxReps: {
      type: "number",
    },
    maxTime: {
      type: "number", // seconds
    },
    
    // Progression tracking
    consecutiveFailures: {
      type: "number",
      default: 0,
    },
    lastProgressionDate: {
      type: "string", // ISO date string
      format: "date-time",
    },
    lastUpdated: {
      type: "string", // ISO date string
      format: "date-time",
    },
  },
  required: ["id", "programId", "exerciseId", "consecutiveFailures", "lastUpdated"],
  indexes: ["programId", "exerciseId"],
} as const;

const schemaTyped = toTypedRxJsonSchema(programExerciseSchemaLiteral);

// aggregate the document type from the schema
export type ProgramExerciseDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export type ProgramExerciseDocMethods = {
  // Helper method to get current max for a specific progression type
  getCurrentMax: (progressionType: 'linear' | 'reps' | 'time') => number | undefined;
};

export type ProgramExerciseDocument = RxDocument<
  ProgramExerciseDocType,
  ProgramExerciseDocMethods
>;

export type ProgramExerciseCollectionMethods = {
  // Find all exercises for a program
  findByProgram: (programId: string) => Promise<ProgramExerciseDocument[]>;
  // Find specific exercise configuration
  findByProgramAndExercise: (programId: string, exerciseId: string) => Promise<ProgramExerciseDocument | null>;
};

export type ProgramExerciseCollection = RxCollection<
  ProgramExerciseDocType,
  ProgramExerciseDocMethods,
  ProgramExerciseCollectionMethods
>;

const programExerciseSchema: RxJsonSchema<ProgramExerciseDocType> = programExerciseSchemaLiteral;

const programExerciseDocMethods: ProgramExerciseDocMethods = {
  getCurrentMax: function (this: ProgramExerciseDocument, progressionType: 'linear' | 'reps' | 'time') {
    switch (progressionType) {
      case 'linear':
        return this.maxWeight;
      case 'reps':
        return this.maxReps;
      case 'time':
        return this.maxTime;
      default:
        return undefined;
    }
  },
};

const programExerciseCollectionMethods: ProgramExerciseCollectionMethods = {
  findByProgram: async function (this: ProgramExerciseCollection, programId: string) {
    return await this.find({
      selector: { programId }
    }).exec();
  },
  findByProgramAndExercise: async function (this: ProgramExerciseCollection, programId: string, exerciseId: string) {
    const doc = await this.findOne({
      selector: { 
        programId,
        exerciseId
      }
    }).exec();
    return doc;
  },
};

export async function initProgramExercises(db: MyDatabase) {
  await db.addCollections({
    programExercises: {
      schema: programExerciseSchema,
      methods: programExerciseDocMethods,
      statics: programExerciseCollectionMethods,
    },
  });

  // Initialize data if collection is empty
  const existingCount = await db.programExercises.count().exec();
  if (existingCount === 0) {
    const { init531FusionProgramExercises } = await import("./program-exercises-531-fusion");
    await init531FusionProgramExercises(db);
  }
}
