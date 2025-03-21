import { db, defaultSettings } from "~/db/db";
import type { Route } from "./+types/route";
import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";

export async function clientLoader() {
  const settings = await db.settings.findOne().exec();
  return settings ? settings.toMutableJSON() : defaultSettings;
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const { clientId, weigthUnit } = loaderData;
  return (
    <Page>
      <Header title="Settings" />
      <MainContent>
        Client {clientId} is using weight unit: {weigthUnit}
      </MainContent>
    </Page>
  );
}
