import invariant from "tiny-invariant";
import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { db } from "~/db/db";
import type { Route } from "./+types/route";
import type { GroupedWorkout } from "~/lib/utils";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const workout = await db.workouts
    .findOne({
      selector: {
        id: params.workoutId,
      },
    })
    .exec();

  invariant(workout, "workout not found");
  const sets = JSON.parse(workout.sets || "");
  return { workout: workout.toMutableJSON(), sets } as GroupedWorkout;
}

export default function Workout({ loaderData }: Route.ComponentProps) {
  const { workout, sets } = loaderData;

  console.log("workout", workout);
  console.log("sets", sets);

  return (
    <Page>
      <Header title="Workout" />
      <MainContent>Show workout data here</MainContent>
    </Page>
  );
}
