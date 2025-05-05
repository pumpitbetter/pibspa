import {
  createRxDatabase,
  type RxDatabase,
  type RxStorage,
} from "rxdb/plugins/core";
import { addRxPlugin } from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { initSettings, type SettingsCollection } from "./settings";
import { initPrograms, type ProgramsCollection } from "./programs";
import { initRoutines, type RoutinesCollection } from "./routines";
import { initExercises, type ExercisesCollection } from "./exercises";
import { initTemplates, type TemplatesCollection } from "./templates";
import { initSets, type SetsCollection } from "./sets";
import { initWorkouts, type WorkoutsCollection } from "./workout";
import { initHistory, type HistoryCollection } from "./history";

// set by webpack as global
const mode = process.env.NODE_ENV;

// other plugins
addRxPlugin(RxDBUpdatePlugin);

export type MyDatabaseCollections = {
  settings: SettingsCollection;
  exercises: ExercisesCollection;
  programs: ProgramsCollection;
  routines: RoutinesCollection;
  templates: TemplatesCollection;
  workouts: WorkoutsCollection;
  sets: SetsCollection;
  history: HistoryCollection;
};

export type MyDatabase = RxDatabase<MyDatabaseCollections>;

let storage: RxStorage<any, any> = getRxStorageDexie();

export const dbPromise = (async () => {
  // import dev-mode plugins
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

  // add collections
  await initExercises(db);
  await initSettings(db);
  await initPrograms(db);
  await initRoutines(db);
  await initTemplates(db);
  await initWorkouts(db);
  await initSets(db);
  await initHistory(db);

  return db;
})();
