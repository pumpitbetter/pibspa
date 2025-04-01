import { Header } from "~/components/Header";
import { List } from "~/components/List";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { db } from "~/db/db";
import { defaultProgram } from "~/db/programs";
import type { Route } from "./+types/route";
import { defaultSettings } from "~/db/settings";
import { Link } from "react-router";

export async function clientLoader() {
  const settings = await db.settings.findOne().exec();
  const program = await db.programs
    .findOne({
      selector: {
        id: settings?.program,
      },
    })
    .exec();
  return {
    program: program ? program.toMutableJSON() : defaultProgram,
  };
}

export default function Programs({ loaderData }: Route.ComponentProps) {
  const { program } = loaderData;
  return (
    <Page>
      <Header
        title={program.name}
        right={
          <Link to="change" className="text-primary">
            Change
          </Link>
        }
      />
      <MainContent>{program.description}</MainContent>
    </Page>
  );
}
