import { Header } from "~/components/header";
import { List } from "~/components/list";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { dbPromise } from "~/db/db";
import { defaultProgram, type ProgramsDocType } from "~/db/programs";
import type { Route } from "./+types/route";
import { ProgramListItem } from "./program-list-item";
import { defaultSettings } from "~/db/settings";
import { LinkBack } from "~/components/link-back";
import { v7 as uuidv7 } from "uuid";

export async function clientLoader() {
  const db = await dbPromise;
  const programs = await db.programs.find().exec();
  return programs ? programs.map((p) => p.toMutableJSON()) : [defaultProgram];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const programId = formData.get("programId") as string;
  const intent = formData.get("intent");

  if (intent === "clone") {
    return await handleCloneProgram(programId);
  }

  return await handleSwitchProgram(programId);
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

//
// helper functions
//

async function handleCloneProgram(programId: string) {
  const db = await dbPromise;

  const programToClone = await db.programs.findOne(programId).exec();
  if (!programToClone) {
    throw new Response("Program not found", { status: 404 });
  }

  const settings = await db.settings.findOne().exec();
  const newProgramId = uuidv7();

  const newProgram: ProgramsDocType = {
    id: newProgramId,
    name: `${programToClone.name} (Cloned)`,
    description: programToClone.description,
    type: programToClone.type,
    level: programToClone.level,
    ownerId: settings?.clientId ?? "",
    exercises: programToClone.exercises,
  };

  const routinesToClone = await db.routines
    .find({ selector: { programId } })
    .exec();

  const routineIdMap: { [key: string]: string } = {};

  const newRoutines = routinesToClone.map((routine) => {
    const newRoutine = {
      ...routine.toJSON(),
      id: uuidv7(),
      programId: newProgramId,
    };
    routineIdMap[routine.id] = newRoutine.id;
    return newRoutine;
  });

  const templatesToClone = await db.templates
    .find({ selector: { programId } })
    .exec();
  const newTemplates = templatesToClone.map((template) => ({
    ...template.toJSON(),
    id: uuidv7(),
    programId: newProgramId,
    routineId: routineIdMap[template.routineId] ?? "",
  }));

  await db.programs.insert(newProgram);
  await db.routines.bulkInsert(newRoutines);
  await db.templates.bulkInsert(newTemplates);

  return { ok: true };
}

async function handleSwitchProgram(programId: string) {
  const db = await dbPromise;

  const settings = await db.settings.findOne().exec();
  await settings?.update({
    $set: {
      programId,
    },
  });
  return settings ? settings.toMutableJSON() : defaultSettings;
}
