import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { db } from "~/db/db";
import { defaultProgram } from "~/db/programs";
import type { Route } from "./+types/route";

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
  const exercises = await db.exercises.find().exec();

  return {
    program: program ? program.toMutableJSON() : defaultProgram,
    workouts: workouts ? workouts.map((w) => w.toMutableJSON()) : [],
    exercises: exercises ? exercises.map((e) => e.toMutableJSON()) : [],
  };
}

export default function Queue({ loaderData }: Route.ComponentProps) {
  const { program, workouts, exercises } = loaderData;
  return (
    <Page>
      <Header title={program.name} />
      <MainContent>This is a queue of upcoming program workouts.</MainContent>
    </Page>
  );
}
