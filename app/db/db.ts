import {
  createRxDatabase,
  type RxDatabase,
  type RxStorage,
} from "rxdb/plugins/core";
import { addRxPlugin } from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration-schema";
import { initSettings, type SettingsCollection } from "./settings";
import { initPrograms, type ProgramsCollection } from "./programs";
import { initRoutines, type RoutinesCollection } from "./routines";
import { initExercises, type ExercisesCollection } from "./exercises";
import { initTemplates, type TemplatesCollection } from "./templates";
import { initSets, type SetsCollection } from "./sets";
import { initWorkouts, type WorkoutsCollection } from "./workout";
import { initHistory, type HistoryCollection } from "./history";
import {
  initProgressExerciseFavorites,
  type ProgressExerciseFavoritesCollection,
} from "./progress-exercise-favorites";
import {
  initProgramExercises,
  type ProgramExerciseCollection,
} from "./program-exercises";

// set by webpack as global
const mode = process.env.NODE_ENV;

// other plugins
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationPlugin);

export type MyDatabaseCollections = {
  settings: SettingsCollection;
  exercises: ExercisesCollection;
  programs: ProgramsCollection;
  routines: RoutinesCollection;
  templates: TemplatesCollection;
  workouts: WorkoutsCollection;
  sets: SetsCollection;
  history: HistoryCollection;
  progressExerciseFavorites: ProgressExerciseFavoritesCollection;
  programExercises: ProgramExerciseCollection;
};

export type MyDatabase = RxDatabase<MyDatabaseCollections>;

let storage: RxStorage<any, any> = getRxStorageDexie();

// Only initialize database if we're in browser environment
export const dbPromise = (() => {
  // Check if we're in a browser environment (client-side)
  if (typeof window === 'undefined') {
    // Server-side: return a promise that never resolves to avoid initialization
    return new Promise<MyDatabase>(() => {});
  }

  // Client-side: initialize the database
  return (async () => {
    try {
      addRxPlugin(RxDBUpdatePlugin);
      addRxPlugin(RxDBMigrationPlugin);

      let storage: RxStorage<any, any> = getRxStorageDexie();

      if (import.meta.env.DEV) {
        // in dev-mode we add the dev-mode plugin
        // which does many checks and adds full error messages
        await import("rxdb/plugins/dev-mode").then((module) =>
          addRxPlugin(module.RxDBDevModePlugin)
        );
        await import("rxdb/plugins/validate-ajv").then((module) => {
          storage = module.wrappedValidateAjvStorage({ storage });
        });
      }

      const db = await createRxDatabase<MyDatabaseCollections>({
        name: "db",
        storage,
      });

      // add collections
      await initExercises(db);
      await initSettings(db);
      await initPrograms(db);
      await initRoutines(db);
      await initTemplates(db);
      await initWorkouts(db);
      await initSets(db);
      await initHistory(db);
      await initProgressExerciseFavorites(db);
      await initProgramExercises(db);

      return db;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  })().catch((error) => {
    console.error('Unhandled database initialization error:', error);
    // Re-throw the error to maintain the promise rejection chain
    throw error;
  });
})();
