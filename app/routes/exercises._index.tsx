import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { prisma } from "~/lib/db/prisma";

export const meta: MetaFunction = () => {
  return [
    { title: "Exercises - PumpItBetter" },
    { name: "description", content: "Browse all available exercises" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Fetch all default exercises from the database
    const exercises = await prisma.exercise.findMany({
      where: {
        isDefault: true,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        muscleGroups: true,
        equipment: true,
        instructions: true,
      },
    });

    return { exercises };
  } catch (error) {
    console.error('Database error:', error);
    // Return empty array if database is not available
    return { exercises: [] };
  }
};

type Exercise = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  muscleGroups: string[];
  equipment: string | null;
  instructions: string | null;
};

export default function Exercises() {
  const { exercises } = useLoaderData<typeof loader>();

  const exercisesByCategory = exercises.reduce((acc: Record<string, Exercise[]>, exercise: Exercise) => {
    const category = exercise.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-on-surface mb-4">Exercise Library</h1>
          <p className="text-xl text-on-surface-variant">
            Browse our comprehensive collection of exercises
          </p>
        </div>

        {exercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏋️‍♂️</div>
            <h2 className="text-2xl font-bold text-on-surface mb-4">
              No exercises available
            </h2>
            <p className="text-on-surface-variant mb-8">
              The database might not be set up yet or no exercises have been added.
            </p>
            <div className="bg-surface-container rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold mb-2">To set up the database:</h3>
              <ol className="text-left text-sm space-y-1">
                <li>1. Run <code className="bg-outline-variant px-1 rounded">./scripts/setup-database.sh</code></li>
                <li>2. Or manually: <code className="bg-outline-variant px-1 rounded">npm run docker:up</code></li>
                <li>3. Then: <code className="bg-outline-variant px-1 rounded">npm run db:push && npm run db:seed</code></li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(exercisesByCategory).map(([category, categoryExercises]) => (
              <section key={category}>
                <h2 className="text-2xl font-bold text-on-surface mb-6 capitalize">
                  {category} Exercises
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(categoryExercises as Exercise[]).map((exercise: Exercise) => (
                    <div
                      key={exercise.id}
                      className="bg-surface-container rounded-xl shadow-lg p-6 border border-outline-variant hover:shadow-xl transition-shadow"
                    >
                      <h3 className="text-xl font-bold text-on-surface mb-3">
                        {exercise.name}
                      </h3>
                      
                      {exercise.description && (
                        <p className="text-on-surface-variant mb-4">
                          {exercise.description}
                        </p>
                      )}
                      
                      <div className="space-y-2">
                        {exercise.equipment && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-on-surface">Equipment:</span>
                            <span className="text-sm text-on-surface-variant capitalize">
                              {exercise.equipment}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-on-surface">Muscles:</span>
                          <div className="flex flex-wrap gap-1">
                            {exercise.muscleGroups.slice(0, 3).map((muscle: string) => (
                              <span
                                key={muscle}
                                className="text-xs bg-primary-container text-on-primary-container px-2 py-1 rounded-full capitalize"
                              >
                                {muscle.replace('_', ' ')}
                              </span>
                            ))}
                            {exercise.muscleGroups.length > 3 && (
                              <span className="text-xs text-on-surface-variant">
                                +{exercise.muscleGroups.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {exercise.instructions && (
                        <details className="mt-4">
                          <summary className="text-sm font-medium text-primary cursor-pointer">
                            View Instructions
                          </summary>
                          <p className="text-sm text-on-surface-variant mt-2">
                            {exercise.instructions}
                          </p>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a 
            href="/"
            className="text-primary hover:text-primary-container font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}