import { useState } from "react";
import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { List } from "~/components/list";
import { ListItem } from "~/components/list-item";
import { dbPromise } from "~/db/db";
import { useNavigate } from "react-router";
import type { Route } from "./+types/route";
import { Heart } from "lucide-react";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const db = await dbPromise;

  // Get all exercises
  const exercises = await db.exercises.find().exec();

  // Get all completed history entries
  const historyEntries = await db.history
    .find({
      selector: {
        completed: true,
        liftedWeight: { $exists: true },
      },
    })
    .exec();

  // Get all progress exercise favorites
  const favorites = await db.progressExerciseFavorites.find().exec();
  const favoriteExerciseIds = new Set(
    favorites.map((fav) => fav.toMutableJSON().exerciseId)
  );

  // Get all workouts to access their dates
  const workouts = await db.workouts.find().exec();
  const workoutMap = new Map<string, any>();
  workouts.forEach((workout) => {
    const workoutData = workout.toMutableJSON();
    workoutMap.set(workoutData.id, workoutData);
  });

  // Process history to find max weight per exercise
  const exerciseStats = new Map<
    string,
    {
      maxWeight: number;
      units: string;
      lastWorkoutDate: number;
    }
  >();

  for (const entry of historyEntries) {
    const historyData = entry.toMutableJSON();

    if (
      historyData.liftedWeight?.value !== undefined &&
      historyData.liftedWeight.value >= 0
    ) {
      const exerciseId = historyData.exerciseId;
      const currentWeight = historyData.liftedWeight.value;
      const currentUnits = historyData.liftedWeight.units;

      const workout = workoutMap.get(historyData.workoutId);
      const workoutDate = workout?.startedAt || 0;

      const existing = exerciseStats.get(exerciseId);

      if (!existing || currentWeight > existing.maxWeight) {
        exerciseStats.set(exerciseId, {
          maxWeight: currentWeight,
          units: currentUnits,
          lastWorkoutDate: workoutDate,
        });
      }
    }
  }

  // Build final result with exercises that have been performed
  const exerciseResults = exercises
    .map((exercise) => {
      const exerciseData = exercise.toMutableJSON();
      const stats = exerciseStats.get(exerciseData.id);

      if (stats) {
        return {
          exercise: exerciseData,
          maxWeight: stats.maxWeight,
          units: stats.units,
          lastWorkoutDate: stats.lastWorkoutDate,
        };
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.lastWorkoutDate - a.lastWorkoutDate);

  return {
    exerciseResults,
    favoriteExerciseIds,
  };
}

export default function Progress({ loaderData }: Route.ComponentProps) {
  const { exerciseResults, favoriteExerciseIds } = loaderData;
  const navigate = useNavigate();

  // Sort exercises: favorites first (alphabetically), then non-favorites (alphabetically)
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(favoriteExerciseIds)
  );

  const toggleFavorite = async (exerciseId: string) => {
    const db = await dbPromise;
    const newFavorites = new Set(favorites);

    if (favorites.has(exerciseId)) {
      // Remove from favorites
      newFavorites.delete(exerciseId);
      const existingFavorite = await db.progressExerciseFavorites
        .findOne({
          selector: { exerciseId },
        })
        .exec();
      if (existingFavorite) {
        await existingFavorite.remove();
      }
    } else {
      // Add to favorites
      newFavorites.add(exerciseId);
      await db.progressExerciseFavorites.insert({
        id: uid.rnd(),
        exerciseId,
        createdAt: Date.now(),
      });
    }

    setFavorites(newFavorites);
  };

  // Organize exercises into favorites and non-favorites
  const favoriteExercises = exerciseResults
    .filter((result) => favorites.has(result.exercise.id))
    .sort((a, b) => a.exercise.name.localeCompare(b.exercise.name));

  const nonFavoriteExercises = exerciseResults
    .filter((result) => !favorites.has(result.exercise.id))
    .sort((a, b) => a.exercise.name.localeCompare(b.exercise.name));

  const handleExercisePress = (exerciseId: string, exerciseName: string) => {
    navigate(`/app/progress/exercise/${exerciseId}`);
  };

  return (
    <Page>
      <Header title="Progress" />
      <MainContent>
        {exerciseResults.length === 0 ? (
          <div className="p-4 text-center text-on-surface-variant">
            No exercise data available yet. Complete some workouts to see your
            progress!
          </div>
        ) : (
          <List>
            {favoriteExercises.map((result) => (
              <ListItem
                key={result.exercise.id}
                title={result.exercise.name}
                content={`${result.maxWeight} ${result.units}`}
                onClick={() =>
                  handleExercisePress(result.exercise.id, result.exercise.name)
                }
                action={
                  <Heart
                    className={`w-6 h-6 ${
                      favorites.has(result.exercise.id)
                        ? "fill-tertiary text-tertiary"
                        : "text-outline"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(result.exercise.id);
                    }}
                  />
                }
              />
            ))}
            {favoriteExercises.length > 0 &&
              nonFavoriteExercises.length > 0 && (
                <div className="border-t border-b-outline-variant mx-4 my-2" />
              )}
            {nonFavoriteExercises.map((result) => (
              <ListItem
                key={result.exercise.id}
                title={result.exercise.name}
                content={`${result.maxWeight} ${result.units}`}
                onClick={() =>
                  handleExercisePress(result.exercise.id, result.exercise.name)
                }
                action={
                  <Heart
                    className={`w-6 h-6 ${
                      favorites.has(result.exercise.id)
                        ? "fill-tertiary text-tertiary"
                        : "text-outline"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(result.exercise.id);
                    }}
                  />
                }
              />
            ))}
          </List>
        )}
      </MainContent>
    </Page>
  );
}
