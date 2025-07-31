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
import { updateProgressionState, getProgressionState } from "~/lib/progression-integration";
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
  const templates = await db.templates.find().exec();
  
  const programExercises = await db.programExercises
    .find({
      selector: {
        programId: settings?.programId,
      },
    })
    .exec();

  return {
    program: program ? program.toMutableJSON() : defaultProgram,
    routines: routines ? routines.map((w) => w.toMutableJSON()) : [],
    exercises: exercises ? exercises.map((e) => e.toMutableJSON()) : [],
    templates: templates ? templates.map((t) => t.toMutableJSON()) : [],
    programExercises: programExercises ? programExercises.map((pe) => pe.toMutableJSON()) : [],
    settings: settings ? settings.toMutableJSON() : { weigthUnit: 'lbs' },
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const programId = formData.get("programId") as string;
  invariant(programId, "Program ID is required");
  const exerciseId = formData.get("exerciseId") as string;
  invariant(exerciseId, "Exercise ID is required");
  const weight = Number(formData.get("weight") as string) ?? 0;

  const db = await dbPromise;
  
  // Update the progression state
  const currentState = await getProgressionState(db, programId, exerciseId);
  
  if (currentState) {
    // Update existing progression state with new max weight
    await updateProgressionState(db, programId, exerciseId, {
      progressionOccurred: false,
      newMaxWeight: weight,
      newConsecutiveFailures: currentState.consecutiveFailures,
      action: 'maintain',
      details: 'Manual weight update'
    });
  } else {
    // Create new progression state if it doesn't exist
    const programExercise = await db.programExercises.findOne({
      selector: { programId, exerciseId }
    }).exec();
    
    if (programExercise) {
      await programExercise.patch({
        maxWeight: weight,
        lastUpdated: new Date().toISOString()
      });
    }
  }

  return { success: true };
}

export default function Programs({ loaderData }: Route.ComponentProps) {
  const { program, routines, exercises, templates, programExercises, settings } = loaderData;

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
              {routines.map((routine) => {
                const routineTemplates = templates.filter(
                  (t) => t.routineId === routine.id
                );
                const exerciseNames = [
                  ...new Set(
                    routineTemplates.map((t) => {
                      return (
                        getExerciseById({
                          exercises,
                          exerciseId: t.exerciseId,
                        })?.name ?? t.exerciseId
                      );
                    })
                  ),
                ];

                return (
                  <Link to={`${routine.id}`} key={routine.id}>
                    <ListItem
                      title={routine.name}
                      content={exerciseNames.join(", ")}
                    />
                  </Link>
                );
              })}
            </List>
          </TabsContent>

          {/* Weights Tab */}
          <TabsContent value="weights">
            <List>
              {programExercises.map((item) => {
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
                    exerciseWeight={item.maxWeight || 0}
                  >
                    <ListItem
                      title={exerciseName}
                      content={`${item.maxWeight || 0} ${settings.weigthUnit || 'lbs'}`}
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
