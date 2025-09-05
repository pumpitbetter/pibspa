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
  
  // Get all unique exercises used in this program's templates
  const programTemplates = templates.filter(t => t.programId === settings?.programId);
  const uniqueExerciseIds = [...new Set(programTemplates.map(t => t.exerciseId))];
  
  // Get progression states for all exercises used in the program
  const programExercises = await Promise.all(
    uniqueExerciseIds.map(async (exerciseId) => {
      const progressionState = await db.programExercises.findOne({
        selector: { 
          programId: settings?.programId,
          exerciseId 
        }
      }).exec();
      
      return {
        exerciseId,
        maxWeight: progressionState?.maxWeight || 0,
        maxReps: progressionState?.maxReps || 0,
        maxTime: progressionState?.maxTime || 0,
        consecutiveFailures: progressionState?.consecutiveFailures || 0,
        lastUpdated: progressionState?.lastUpdated || new Date().toISOString(),
      };
    })
  );

  // Sort exercises by name for consistent display
  const sortedProgramExercises = programExercises.sort((a, b) => {
    const exerciseA = exercises.find(e => e.id === a.exerciseId);
    const exerciseB = exercises.find(e => e.id === b.exerciseId);
    const nameA = exerciseA?.name || a.exerciseId;
    const nameB = exerciseB?.name || b.exerciseId;
    return nameA.localeCompare(nameB);
  });

  return {
    program: program ? program.toMutableJSON() : defaultProgram,
    routines: routines ? routines.map((w) => w.toMutableJSON()) : [],
    exercises: exercises ? exercises.map((e) => e.toMutableJSON()) : [],
    templates: templates ? templates.map((t) => t.toMutableJSON()) : [],
    programExercises: sortedProgramExercises,
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
  
  // Update the progression state using the new system
  const currentState = await getProgressionState(db, programId, exerciseId);
  
  if (currentState) {
    // For manual weight updates, we need to clear lastProgressionDate to indicate
    // this is user-set data, not progression earned through workout completion
    await updateProgressionState(db, programId, exerciseId, {
      progressionOccurred: false,
      newMaxWeight: weight,
      newConsecutiveFailures: currentState.consecutiveFailures,
      action: 'maintain',
      details: 'Manual weight update',
      clearProgressionDate: true // Add flag to clear progression date
    });
  } else {
    // Initialize new progression state if it doesn't exist
    await db.programExercises.upsert({
      id: `${programId}-${exerciseId}`,
      programId,
      exerciseId,
      maxWeight: weight,
      consecutiveFailures: 0,
      lastUpdated: new Date().toISOString()
    });
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
              {programExercises.length > 0 ? (
                programExercises.map((item) => {
                  const exerciseName =
                    getExerciseById({
                      exercises,
                      exerciseId: item.exerciseId,
                    })?.name ?? item.exerciseId;
                  
                  const displayWeight = item.maxWeight || 0;
                  const hasProgressionData = item.maxWeight > 0 || item.maxReps > 0 || item.maxTime > 0;
                  
                  return (
                    <DialogWeightEdit
                      key={item.exerciseId}
                      exerciseId={item.exerciseId}
                      programId={program.id}
                      exerciseName={exerciseName}
                      exerciseWeight={displayWeight}
                    >
                      <ListItem
                        title={exerciseName}
                        content={hasProgressionData 
                          ? `${displayWeight} ${settings.weigthUnit || 'lbs'}`
                          : `Not set - ${settings.weigthUnit || 'lbs'}`
                        }
                      />
                    </DialogWeightEdit>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No exercises found in this program
                </div>
              )}
            </List>
          </TabsContent>
        </Tabs>
      </MainContent>
    </Page>
  );
}
