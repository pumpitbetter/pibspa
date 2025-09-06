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

const mode = process.env.NODE_ENV;

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

export const dbPromise = (async () => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    if (mode === "development") {
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
    console.error("Database initialization failed:", error);
    return null;
  }
})();
