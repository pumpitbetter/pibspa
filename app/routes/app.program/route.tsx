import { Header } from "~/components/header";
import { List } from "~/components/list";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { dbPromise } from "~/db/db";
import { defaultProgram } from "~/db/programs";
import type { Route } from "./+types/route";
import { Link } from "react-router";
import { ListItem } from "~/components/list-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getExerciseById } from "~/lib/utils";
import { DialogWeightEdit } from "./dialog-weight-edit";
import invariant from "tiny-invariant";

export async function clientLoader() {
  const db = await dbPromise;
  const settings = await db.settings.findOne().exec();
  const program = await db.programs
    .findOne({
      selector: {
        id: settings?.programId,
      },
    })
    .exec();
  const routines = await db.routines
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
    routines: routines ? routines.map((w) => w.toMutableJSON()) : [],
    exercises: exercises ? exercises.map((e) => e.toMutableJSON()) : [],
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const programId = formData.get("programId") as string;
  invariant(programId, "Program ID is required");
  const exerciseId = formData.get("exerciseId") as string;
  invariant(exerciseId, "Exercise ID is required");
  const weight = Number(formData.get("weight") as string) ?? 0;
  const increment = Number(formData.get("increment") as string) ?? 5;

  const db = await dbPromise;
  const settings = await db.settings.findOne().exec();
  const program = await db.programs
    .findOne({
      selector: {
        id: programId,
      },
    })
    .exec();
  invariant(program, "Program not found");
  invariant(settings, "Settings not found");

  await program.modify((doc) => {
    invariant(doc.exercises, "Program has no exercises");
    const exercises = doc.exercises.map((item) => {
      if (item.exerciseId === exerciseId) {
        return {
          ...item,
          exerciseWeight: {
            value: weight,
            units: settings.weigthUnit,
          },
          increment: increment,
        };
      }
      return item;
    });
    doc.exercises = exercises;
    return doc;
  });

  return program.toMutableJSON();
}

export default function Programs({ loaderData }: Route.ComponentProps) {
  const { program, routines, exercises } = loaderData;

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
        <Tabs defaultValue="templates" className="w-full px-4">
          <TabsList className="grid w-full grid-cols-2 sticky top-[56px]">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="weights">Weights</TabsTrigger>
          </TabsList>

          {/*Templates Tab */}
          <TabsContent value="templates">
            <List>
              {routines.map((routine) => (
                <Link to={`${routine.id}`} key={routine.id}>
                  <ListItem title={routine.name} />
                </Link>
              ))}
            </List>
          </TabsContent>

          {/* Weights Tab */}
          <TabsContent value="weights">
            <List>
              {program.exercises?.map((item) => {
                const exerciseName =
                  getExerciseById({
                    exercises,
                    exerciseId: item.exerciseId,
                  })?.name ?? item.exerciseId;
                return (
                  <DialogWeightEdit
                    key={item.exerciseId}
                    exerciseId={item.exerciseId}
                    programId={program.id}
                    exerciseName={exerciseName}
                    exerciseWeight={item.exerciseWeight.value}
                    increment={item.increment ?? 5}
                  >
                    <ListItem
                      title={exerciseName}
                      content={`${item.exerciseWeight.value} ${item.exerciseWeight.units} ( +${item.increment} )`}
                    />
                  </DialogWeightEdit>
                );
              })}
            </List>
          </TabsContent>
        </Tabs>
      </MainContent>
    </Page>
  );
}
