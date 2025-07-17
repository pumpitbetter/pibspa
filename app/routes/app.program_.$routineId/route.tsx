import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { dbPromise } from "~/db/db";
import invariant from "tiny-invariant";
import { List } from "~/components/list";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  getBarWeight,
  getExerciseById,
  getProgramExerciseWeight,
  groupCircuitsIntoSets,
  groupIntoCircuits,
} from "~/lib/utils";
import { LinkBack } from "~/components/link-back";
import type { Route } from "./+types/route";
import { DialogRepsLoadEdit } from "./dialog-reps-load-edit";
import { DialogSetsEdit } from "./dialog-sets-edit";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Plus, MoreVertical, Trash2, Hash } from "lucide-react";
import { Link, Form } from "react-router";
import { useState } from "react";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const db = await dbPromise;
  const routine = await db.routines
    .findOne({
      selector: {
        id: params.routineId,
      },
    })
    .exec();

  invariant(routine, "routine not found");

  const templates = await db.templates
    .find({
      selector: {
        routineId: routine.id,
      },
      sort: [{ order: "asc" }, { sequence: "asc" }],
    })
    .exec();

  const program = await db.programs
    .findOne({
      selector: {
        id: routine.programId,
      },
    })
    .exec();
  invariant(program, "program not found");

  const exercises = await db.exercises.find().exec();

  const settings = await db.settings.findOne().exec();
  invariant(settings, "settings not found");

  return {
    routine: routine.toMutableJSON(),
    templates: templates ? templates.map((t) => t.toMutableJSON()) : [],
    exercises: exercises ? exercises.map((e) => e.toMutableJSON()) : [],
    program: program.toMutableJSON(),
    settings: settings.toMutableJSON(),
  };
}

type Intent = "editRoutine" | "deleteExercise" | "updateSets";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as Intent;

  switch (intent) {
    case "editRoutine": {
      await editRoutine(formData);
      break;
    }
    case "deleteExercise": {
      await deleteExercise(formData);
      break;
    }
    case "updateSets": {
      await updateSets(formData);
      break;
    }
  }

  return;
}

export default function Programoutine({ loaderData }: Route.ComponentProps) {
  const { routine, templates, exercises, program, settings } = loaderData;
  const [uiState, setUiState] = useState<{
    openDropdown: string | null;
    dialogOpen: boolean;
    dialogExerciseId: string | null;
  }>({
    openDropdown: null,
    dialogOpen: false,
    dialogExerciseId: null,
  });

  const groupedTemplates = groupCircuitsIntoSets(groupIntoCircuits(templates));

  return (
    <Page>
      <Header
        title={routine?.name}
        left={<LinkBack to="/app/program" />}
        right={
          program?.ownerId !== "system" ? (
            <Link to={`/app/program/${routine?.id}/add-exercises`}>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </Link>
          ) : null
        }
      />
      <MainContent>
        <List>
          {Object.entries(groupedTemplates).map((template) => {
            const exercise = getExerciseById({
              exercises,
              exerciseId: template[0],
            });
            return (
              <li key={template[0]} className="w-full p-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {exercise?.name ?? "Unknown Exercise"}
                      </CardTitle>
                      {program?.ownerId !== "system" && (
                        <DropdownMenu
                          open={uiState.openDropdown === template[0]}
                          onOpenChange={(open) =>
                            setUiState((prev) => ({
                              ...prev,
                              openDropdown: open ? template[0] : null,
                            }))
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => {
                                setUiState((prev) => ({
                                  ...prev,
                                  openDropdown: null,
                                  dialogOpen: true,
                                  dialogExerciseId: template[0],
                                }));
                              }}
                            >
                              <Hash className="h-4 w-4 text-on-surface-variant mr-2" />
                              Sets ({template[1].length})
                            </DropdownMenuItem>
                            <Form method="post">
                              <input
                                type="hidden"
                                name="intent"
                                value="deleteExercise"
                              />
                              <input
                                type="hidden"
                                name="exerciseId"
                                value={template[0]}
                              />
                              <DropdownMenuItem asChild>
                                <button
                                  type="submit"
                                  className="flex w-full items-center gap-2 text-on-surface-variant"
                                >
                                  <Trash2 className="h-4 w-4 text-on-surface-variant" />
                                  Delete
                                </button>
                              </DropdownMenuItem>
                            </Form>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      {/* Dialog moved outside the DropdownMenu */}
                      <DialogSetsEdit
                        exerciseId={template[0]}
                        routineId={routine.id}
                        currentSetCount={template[1].length}
                        isOpen={
                          uiState.dialogOpen &&
                          uiState.dialogExerciseId === template[0]
                        }
                        onOpenChange={(open) =>
                          setUiState((prev) => ({
                            ...prev,
                            dialogOpen: open,
                            dialogExerciseId: open ? template[0] : null,
                          }))
                        }
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {template[1].map((item) => {
                      const programExercise = program?.exercises?.find(
                        (e) => e.exerciseId === item.exerciseId
                      );
                      const barWeight = exercise
                        ? getBarWeight({
                            exercise,
                            settings,
                          })
                        : 0;
                      const weight = program?.exercises
                        ? getProgramExerciseWeight({
                            programExercises: program?.exercises,
                            exerciseId: item.exerciseId,
                            load: item.load,
                            units:
                              programExercise?.exerciseWeight?.units ||
                              settings.weigthUnit,
                            increment: 5,
                            barWeight,
                          })
                        : { value: 0, units: settings.weigthUnit };

                      const exerciseDisplay = (
                        <div className="flex gap-2 py-3">
                          <span>{item.reps} reps</span>
                          <span>x</span>
                          <span>{item.load * 100}%</span>
                          <span className="text-on-surface-variant">/</span>
                          <span className="text-on-surface-variant">
                            {weight.value}
                          </span>
                          <span className="text-on-surface-variant">
                            {programExercise?.exerciseWeight?.units}
                          </span>
                        </div>
                      );

                      return program?.ownerId !== "system" ? (
                        <DialogRepsLoadEdit
                          key={`${item.id}-${item.order}-${item.sequence}`}
                          templateId={item.id}
                          reps={item.reps}
                          load={item.load}
                        >
                          {exerciseDisplay}
                        </DialogRepsLoadEdit>
                      ) : (
                        <div key={`${item.id}-${item.order}-${item.sequence}`}>
                          {exerciseDisplay}
                        </div>
                      );
                    })}
                  </CardContent>
                  {/* <CardFooter className="flex justify-end">Footer</CardFooter> */}
                </Card>
              </li>
            );
          })}
        </List>
      </MainContent>
    </Page>
  );
}

async function editRoutine(formData: FormData) {
  const templateId = formData.get("templateId") as string;
  invariant(templateId, "templateId not found");

  const reps = Number(formData.get("reps") as string);
  const load = Number(formData.get("load") as string);

  const db = await dbPromise;

  const template = await db.templates
    .findOne({ selector: { id: templateId } })
    .exec();
  invariant(template, "template not found");

  await template.update({
    $set: {
      load: load / 100,
      reps: reps,
    },
  });
}

async function deleteExercise(formData: FormData) {
  const exerciseId = formData.get("exerciseId") as string;
  invariant(exerciseId, "exerciseId not found");

  const db = await dbPromise;

  // Delete all templates for this exercise
  await db.templates.find({ selector: { exerciseId } }).remove();
}

async function updateSets(formData: FormData) {
  const exerciseId = formData.get("exerciseId") as string;
  const setCount = Number(formData.get("setCount") as string);
  const routineId = formData.get("routineId") as string;

  invariant(exerciseId, "exerciseId not found");
  invariant(routineId, "routineId not found");
  invariant(setCount > 0, "setCount must be greater than 0");

  const db = await dbPromise;

  // Get current templates for this exercise in this routine
  const currentTemplates = await db.templates
    .find({
      selector: {
        exerciseId,
        routineId,
      },
    })
    .exec();

  const currentCount = currentTemplates.length;

  if (setCount === currentCount) {
    // No change needed
    return;
  }

  if (setCount > currentCount) {
    // Add new sets
    const setsToAdd = setCount - currentCount;
    const lastTemplate = currentTemplates[currentTemplates.length - 1];

    if (lastTemplate) {
      const newTemplates = [];
      const baseSequence = lastTemplate.sequence || 1;
      const templateData = lastTemplate.toMutableJSON();

      for (let i = 0; i < setsToAdd; i++) {
        newTemplates.push({
          id: crypto.randomUUID(),
          programId: templateData.programId,
          routineId: templateData.routineId,
          exerciseId: templateData.exerciseId,
          order: templateData.order,
          sequence: baseSequence + i + 1,
          load: templateData.load,
          reps: templateData.reps,
          progression: templateData.progression,
          amrep: templateData.amrep,
        });
      }
      await db.templates.bulkInsert(newTemplates);
    }
  } else {
    // Remove sets (remove from the end)
    const setsToRemove = currentCount - setCount;
    const templatesOrderedBySequence = currentTemplates.sort(
      (a, b) => (b.sequence || 1) - (a.sequence || 1)
    );

    for (let i = 0; i < setsToRemove; i++) {
      await templatesOrderedBySequence[i].remove();
    }
  }
}
