import { Header } from "~/components/Header";
import { List } from "~/components/List";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { db } from "~/db/db";
import { defaultProgram } from "~/db/programs";
import type { Route } from "./+types/route";
import { ProgramListItem } from "./program-list-item";

export async function clientLoader() {
  const programs = await db.programs.find().exec();
  return programs ? programs.map((p) => p.toMutableJSON()) : [defaultProgram];
}

export default function Programs({ loaderData }: Route.ComponentProps) {
  return (
    <Page>
      <Header title="Switch Program" />
      <MainContent>
        <List>
          {loaderData.map((program) => (
            <ProgramListItem
              key={program.id}
              title={program.name}
              description={program.description}
              type={program.type}
              level={program.level}
              onClick={() => {
                console.log("Program clicked:", program);
              }}
            />
          ))}
        </List>
      </MainContent>
    </Page>
  );
}
