import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";
import { db } from "~/db/db";
import type { Route } from "./+types/route";
import invariant from "tiny-invariant";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const workout = await db.workouts
    .findOne({
      selector: {
        id: params.workoutId,
      },
    })
    .exec();

  invariant(workout, "Workout not found");

  return {
    workout: workout.toMutableJSON(),
  };
}

export default function ProgramWorkout({ loaderData }: Route.ComponentProps) {
  const { workout } = loaderData;
  return (
    <Page>
      <Header title={workout?.name} />
      <MainContent>Main content for workout...</MainContent>
    </Page>
  );
}
