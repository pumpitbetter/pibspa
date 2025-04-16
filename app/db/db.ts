import { createRxDatabase, type RxDatabase } from "rxdb/plugins/core";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { addRxPlugin } from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { initSettings, type SettingsCollection } from "./settings";
import { initPrograms, type ProgramsCollection } from "./programs";
import { initRoutines, type RoutinesCollection } from "./routines";
import { initExercises, type ExercisesCollection } from "./exercises";
import { initTemplates, type TemplatesCollection } from "./templates";
import { initSets, type SetsCollection } from "./sets";
import { initWorkouts, type WorkoutsCollection } from "./workout";
import { initHistory, type HistoryCollection } from "./history";

if (process.env.NODE_ENV === "development") {
  console.log("Development mode enabled");
  addRxPlugin(RxDBDevModePlugin);
}

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

// wrap the validation around the main RxStorage
const storage = wrappedValidateAjvStorage({
  storage: getRxStorageDexie(),
});

export let db: MyDatabase;

(async () => {
  db = await createRxDatabase<MyDatabaseCollections>({
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
})();
