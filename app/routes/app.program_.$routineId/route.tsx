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

export default function Programroutine({ loaderData }: Route.ComponentProps) {
  const { routine, templates, exercises, program, settings } = loaderData;

  const groupedTemplates = groupCircuitsIntoSets(groupIntoCircuits(templates));

  return (
    <Page>
      <Header title={routine?.name} left={<LinkBack to="/app/program" />} />
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
                    <CardTitle>
                      {exercise?.name ?? "Unknown Exercise"}
                    </CardTitle>
                    {/* <CardDescription>Description</CardDescription> */}
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
                      return (
                        <div
                          key={`${item.id}-${item.order}-${item.sequence}`}
                          className="flex gap-2 py-3"
                        >
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
