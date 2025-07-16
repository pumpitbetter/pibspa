import { Header } from "~/components/header";
import { List } from "~/components/list";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { dbPromise } from "~/db/db";
import { defaultProgram } from "~/db/programs";
import type { Route } from "./+types/route";
import { ProgramListItem } from "./program-list-item";
import { defaultSettings } from "~/db/settings";
import { LinkBack } from "~/components/link-back";
import { ulid } from "ulid";

export async function clientLoader() {
  const db = await dbPromise;
  const programs = await db.programs.find().exec();
  return programs ? programs.map((p) => p.toMutableJSON()) : [defaultProgram];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const programId = formData.get("programId") as string;
  const intent = formData.get("intent");

  const db = await dbPromise;

  if (intent === "clone") {
    const programToClone = await db.programs.findOne(programId).exec();
    if (!programToClone) {
      throw new Response("Program not found", { status: 404 });
    }

    const settings = await db.settings.findOne().exec();
    const newProgramId = ulid();

    const newProgram = {
      ...programToClone.toJSON(),
      id: newProgramId,
      name: `${programToClone.name} (Cloned)`,
      ownerId: settings?.clientId,
    };

    const routinesToClone = await db.routines
      .find({ selector: { programId } })
      .exec();
    const newRoutines = routinesToClone.map((routine) => ({
      ...routine.toJSON(),
      id: ulid(),
      programId: newProgramId,
    }));

    const templatesToClone = await db.templates
      .find({ selector: { programId } })
      .exec();
    const newTemplates = templatesToClone.map((template) => ({
      ...template.toJSON(),
      id: ulid(),
      programId: newProgramId,
      routineId:
        newRoutines.find((r) => r.name === template.routineId)?.id ?? "",
    }));

    await db.programs.insert(newProgram);
    await db.routines.bulkInsert(newRoutines);
    await db.templates.bulkInsert(newTemplates);

    return { ok: true };
  }

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
