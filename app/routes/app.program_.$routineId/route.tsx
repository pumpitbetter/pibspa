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
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Plus, MoreVertical, Trash2 } from "lucide-react";
import { Link, Form } from "react-router";

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

type Intent = "editRoutine" | "deleteExercise";

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
  }

  return;
}

export default function Programroutine({ loaderData }: Route.ComponentProps) {
  const { routine, templates, exercises, program, settings } = loaderData;

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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Form method="post">
                              <input type="hidden" name="intent" value="deleteExercise" />
                              <input type="hidden" name="exerciseId" value={template[0]} />
                              <DropdownMenuItem asChild>
                                <button type="submit" className="flex w-full items-center gap-2 text-on-surface-variant">
                                  <Trash2 className="h-4 w-4 text-on-surface-variant" />
                                  Delete
                                </button>
                              </DropdownMenuItem>
                            </Form>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
  await db.templates
    .find({ selector: { exerciseId } })
    .remove();
}
