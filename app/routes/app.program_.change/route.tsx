import { Header } from "~/components/Header";
import { List } from "~/components/List";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { dbPromise } from "~/db/db";
import { defaultProgram } from "~/db/programs";
import type { Route } from "./+types/route";
import { ProgramListItem } from "./program-list-item";
import { defaultSettings } from "~/db/settings";
import { LinkBack } from "~/components/LinkBack";

export async function clientLoader() {
  const db = await dbPromise;
  const programs = await db.programs.find().exec();
  return programs ? programs.map((p) => p.toMutableJSON()) : [defaultProgram];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const programId = formData.get("programId");

  const db = await dbPromise;
  const settings = await db.settings.findOne().exec();
  await settings?.update({
    $set: {
      programId,
    },
  });
  return settings ? settings.toMutableJSON() : defaultSettings;
}

export default function ProgramChange({ loaderData }: Route.ComponentProps) {
  return (
    <Page>
      <Header title="Switch Program" left={<LinkBack to="/app/program" />} />
      <MainContent>
        <List>
          {loaderData.map((program) => (
            <ProgramListItem
              key={program.id}
              id={program.id}
              title={program.name}
              description={program.description}
              type={program.type}
              level={program.level}
            />
          ))}
        </List>
      </MainContent>
    </Page>
  );
}
