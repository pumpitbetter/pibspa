import { createRxDatabase, type RxDatabase } from "rxdb/plugins/core";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { addRxPlugin } from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { initSettings, type SettingsCollection } from "./settings";

if (process.env.NODE_ENV === "development") {
  console.log("Development mode enabled");
  addRxPlugin(RxDBDevModePlugin);
}

// other plugins
addRxPlugin(RxDBUpdatePlugin);

export type MyDatabaseCollections = {
  settings: SettingsCollection;
};

export type MyDatabase = RxDatabase<MyDatabaseCollections>;

// wrap the validation around the main RxStorage
const storage = wrappedValidateAjvStorage({
  storage: getRxStorageDexie(),
});

export const db: MyDatabase = await createRxDatabase<MyDatabaseCollections>({
  name: "db",
  storage,
});

await initSettings(db);
