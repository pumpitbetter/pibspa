import { getDb } from "~/db/db";
import type { Route } from "./+types/route";
import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { List } from "~/components/List";
import { ListItem } from "~/components/ListItem";
import { DialogWeightUnit } from "~/routes/app.settings/dialog-weight-unit";
import { defaultSettings } from "~/db/settings";
import { DialogBarbellWeight } from "./dialog-barbell-weight";
import { DialogEzBarWeight } from "./dialog-ezbar-weight";
import { Link } from "react-router";

export async function clientLoader() {
  const db = await getDb();
  const settings = await db.settings.findOne().exec();
  return settings ? settings.toMutableJSON() : defaultSettings;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "editWeightUnit":
      return await editWeightUnit(formData);
    case "editBarbellWeight":
      return await editBarbellWeight(formData);
    case "editEzBarWeight":
      return await editEzBarWeight(formData);
    default:
      throw new Error("Unknown intent");
  }
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const { weigthUnit, barbellWeight, ezbarWeight, plates } = loaderData;

  // reduce plates to a string
  const platesString = plates
    ?.sort((a, b) => b.weight - a.weight) // sort by descending weight
    .map((plate) => `${plate.count}x${plate.weight}`)
    .join(", ");

  return (
    <Page>
      <Header title="Settings" />
      <MainContent>
        <List>
          <DialogWeightUnit>
            <ListItem title="Weight Unit" content={weigthUnit} />
          </DialogWeightUnit>
          <DialogBarbellWeight>
            <ListItem title="Barbell Weight" content={String(barbellWeight)} />
          </DialogBarbellWeight>
          <DialogEzBarWeight>
            <ListItem title="EZ Bar Weight" content={String(ezbarWeight)} />
          </DialogEzBarWeight>
          <Link to="/app/settings/plates">
            <ListItem title="Plates" content={platesString} />
          </Link>
        </List>
      </MainContent>
    </Page>
  );
}

async function editWeightUnit(formData: FormData) {
  const weigthUnit = formData.get("weigthUnit");
  const db = await getDb();
  const settings = await db.settings.findOne().exec();
  await settings?.update({
    $set: {
      weigthUnit,
    },
  });
  return settings ? settings.toMutableJSON() : defaultSettings;
}

async function editBarbellWeight(formData: FormData) {
  const barbellWeight = Number(formData.get("barbellWeight"));
  const db = await getDb();
  const settings = await db.settings.findOne().exec();
  await settings?.update({
    $set: {
      barbellWeight: barbellWeight,
    },
  });
  return settings ? settings.toMutableJSON() : defaultSettings;
}

async function editEzBarWeight(formData: FormData) {
  const ezbarlWeight = Number(formData.get("ezbarWeight"));
  const db = await getDb();
  const settings = await db.settings.findOne().exec();
  await settings?.update({
    $set: {
      ezbarWeight: ezbarlWeight,
    },
  });
  return settings ? settings.toMutableJSON() : defaultSettings;
}
