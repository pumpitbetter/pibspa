import { Header } from "~/components/Header";
import { List } from "~/components/List";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { db } from "~/db/db";
import { defaultProgram } from "~/db/programs";
import type { Route } from "./+types/route";
import { Link } from "react-router";
import { ListItem } from "~/components/ListItem";

export async function clientLoader() {
  const settings = await db.settings.findOne().exec();
  const program = await db.programs
    .findOne({
      selector: {
        id: settings?.programId,
      },
    })
    .exec();
  const workouts = await db.workouts
    .find({
      selector: {
        programId: settings?.programId,
      },
      sort: [{ order: "asc" }],
    })
    .exec();

  return {
    program: program ? program.toMutableJSON() : defaultProgram,
    workouts: workouts ? workouts.map((w) => w.toMutableJSON()) : [],
  };
}

export default function Programs({ loaderData }: Route.ComponentProps) {
  const { program, workouts } = loaderData;
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
      <MainContent>
        <List>
          {workouts.map((workout) => (
            <Link to={`${workout.id}`} key={workout.id}>
              <ListItem title={workout.name} />
            </Link>
          ))}
        </List>
      </MainContent>
    </Page>
  );
}
