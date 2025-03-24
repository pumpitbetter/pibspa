import { db } from "~/db/db";
import type { Route } from "./+types/route";
import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { List } from "~/components/List";
import { ListItem } from "~/components/ListItem";
import { DialogWeightUnit } from "~/components/Dialog/dialog-weight-unit";
import { defaultSettings } from "~/db/settings";

export async function clientLoader() {
  const settings = await db.settings.findOne().exec();
  return settings ? settings.toMutableJSON() : defaultSettings;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const weigthUnit = formData.get("weigthUnit");
  const settings = await db.settings.findOne().exec();
  await settings?.update({
    $set: {
      weigthUnit,
    },
  });
  return settings ? settings.toMutableJSON() : defaultSettings;
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const { weigthUnit } = loaderData;
  return (
    <Page>
      <Header title="Settings" />
      <MainContent>
        <List>
          <DialogWeightUnit>
            <ListItem title="Weight Unit" content={weigthUnit} />
          </DialogWeightUnit>
        </List>
      </MainContent>
    </Page>
  );
}
