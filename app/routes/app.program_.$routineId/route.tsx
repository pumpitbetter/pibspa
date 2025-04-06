import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { db } from "~/db/db";
import invariant from "tiny-invariant";
import { List } from "~/components/List";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getExerciseById } from "~/lib/utils";
import { LinkBack } from "~/components/LinkBack";
import type { Route } from "./+types/route";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
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

  const exercises = await db.exercises.find().exec();

  return {
    routine: routine.toMutableJSON(),
    templates: templates ? templates.map((t) => t.toMutableJSON()) : [],
    exercises: exercises ? exercises.map((e) => e.toMutableJSON()) : [],
  };
}

export default function Programroutine({ loaderData }: Route.ComponentProps) {
  const { routine, templates, exercises } = loaderData;

  const groupIntoCircuits = (
    array: typeof templates
  ): Record<string, typeof templates> => {
    const groupedArray = array.reduce((acc, template) => {
      const order = template.order;
      if (!acc[order]) {
        acc[order] = [];
      }
      acc[order].push(template);
      acc[order].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
      return acc;
    }, {} as Record<string, typeof templates>);
    return groupedArray;
  };

  const groupIntoSets = (
    groupedTemplates: Record<string, typeof templates>
  ): Record<string, typeof templates> => {
    return Object.entries(groupedTemplates).reduce(
      (acc, [order, templates]) => {
        templates.forEach((template) => {
          const exerciseId = template.exerciseId;
          if (!acc[exerciseId]) {
            acc[exerciseId] = [];
          }
          acc[exerciseId].push(template);
        });
        return acc;
      },
      {} as Record<string, typeof templates>
    );
  };

  const groupedTemplates = groupIntoSets(groupIntoCircuits(templates));

  return (
    <Page>
      <Header title={routine?.name} left={<LinkBack to="/app/program" />} />
      <MainContent>
        <List>
          {Object.entries(groupedTemplates).map((template) => (
            <li key={template[0]} className="w-full p-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {getExerciseById({ exercises, exerciseId: template[0] })
                      ?.name ?? "Unknown Exercise"}
                  </CardTitle>
                  {/* <CardDescription>Description</CardDescription> */}
                </CardHeader>
                <CardContent>
                  {template[1].map((item) => {
                    return (
                      <div
                        key={`${item.id}-${item.order}-${item.sequence}`}
                        className="flex gap-2"
                      >
                        <span>{item.reps} reps</span>
                        <span>x</span>
                        <span>{item.load * 100}%</span>
                      </div>
                    );
                  })}
                </CardContent>
                {/* <CardFooter className="flex justify-end">Footer</CardFooter> */}
              </Card>
            </li>
          ))}
        </List>
      </MainContent>
    </Page>
  );
}
