import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { LinkBack } from "~/components/link-back";
import { dbPromise } from "~/db/db";

interface LoaderArgs {
  params: {
    exerciseId: string;
  };
}

export async function clientLoader({ params }: LoaderArgs) {
  const db = await dbPromise;
  const exerciseId = params.exerciseId;
  
  // Get the exercise details
  const exercise = await db.exercises.findOne({
    selector: { id: exerciseId }
  }).exec();

  if (!exercise) {
    throw new Response("Exercise not found", { status: 404 });
  }

  return {
    exercise: exercise.toMutableJSON(),
  };
}

interface ComponentProps {
  loaderData: {
    exercise: {
      id: string;
      name: string;
    };
  };
}

export default function ExerciseProgress({ loaderData }: ComponentProps) {
  const { exercise } = loaderData;

  return (
    <Page>
      <Header 
        title={exercise.name}
        left={<LinkBack to="/app/progress" />}
      />
      <MainContent>
        <div className="p-4 text-center text-on-surface-variant">
          <h2 className="text-lg font-semibold mb-2">Exercise Progress Details</h2>
          <p>TODO: Implement detailed progress chart and statistics for {exercise.name}</p>
        </div>
      </MainContent>
    </Page>
  );
}
