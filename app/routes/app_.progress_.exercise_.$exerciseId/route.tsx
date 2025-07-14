import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { LinkBack } from "~/components/link-back";
import { ExerciseProgressChart } from "~/components/exercise-progress-chart";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { dbPromise } from "~/db/db";
import { useState, useMemo } from "react";

interface LoaderArgs {
  params: {
    exerciseId: string;
  };
}

export async function clientLoader({ params }: LoaderArgs) {
  const db = await dbPromise;
  const exerciseId = params.exerciseId;

  // Get the exercise details
  const exercise = await db.exercises
    .findOne({
      selector: { id: exerciseId },
    })
    .exec();

  if (!exercise) {
    throw new Response("Exercise not found", { status: 404 });
  }

  // Get all history entries for this exercise
  const historyEntries = await db.history
    .find({
      selector: {
        exerciseId: exerciseId,
        completed: true,
        liftedWeight: { $exists: true },
      },
    })
    .exec();

  // Get all workouts to access their dates and names
  const workouts = await db.workouts.find().exec();
  const workoutMap = new Map<string, any>();
  workouts.forEach((workout) => {
    const workoutData = workout.toMutableJSON();
    workoutMap.set(workoutData.id, workoutData);
  });

  // Process history to build chart data
  const chartData = [];
  const workoutStats = new Map<
    string,
    { maxWeight: number; date: number; units: string; workoutName: string }
  >();

  // Group by workout and find max weight per workout
  for (const entry of historyEntries) {
    const historyData = entry.toMutableJSON();

    if (
      historyData.liftedWeight?.value !== undefined &&
      historyData.liftedWeight.value >= 0
    ) {
      const workoutId = historyData.workoutId;
      const currentWeight = historyData.liftedWeight.value;
      const currentUnits = historyData.liftedWeight.units;

      const workout = workoutMap.get(workoutId);
      if (workout) {
        const workoutDate = workout.startedAt || 0;
        const workoutName = workout.name || "Workout";

        const existing = workoutStats.get(workoutId);
        if (!existing || currentWeight > existing.maxWeight) {
          workoutStats.set(workoutId, {
            maxWeight: currentWeight,
            date: workoutDate,
            units: currentUnits,
            workoutName: workoutName,
          });
        }
      }
    }
  }

  // Convert to chart data format and sort by date
  const chartDataArray = Array.from(workoutStats.values())
    .sort((a, b) => a.date - b.date)
    .map((stat) => ({
      date: new Date(stat.date).toLocaleDateString(),
      weight: stat.maxWeight,
      units: stat.units,
      workoutName: stat.workoutName,
    }));

  return {
    exercise: exercise.toMutableJSON(),
    chartData: chartDataArray,
  };
}

interface ComponentProps {
  loaderData: {
    exercise: {
      id: string;
      name: string;
    };
    chartData: Array<{
      date: string;
      weight: number;
      units: string;
      workoutName: string;
    }>;
  };
}

export default function ExerciseProgress({ loaderData }: ComponentProps) {
  const { exercise, chartData } = loaderData;
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");

  // Filter chart data based on selected timeframe
  const filteredChartData = useMemo(() => {
    if (selectedTimeframe === "all") {
      return chartData;
    }

    const now = new Date();
    const cutoffDate = new Date();

    switch (selectedTimeframe) {
      case "1m":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "3m":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return chartData;
    }

    return chartData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  }, [chartData, selectedTimeframe]);

  return (
    <Page>
      <Header title={exercise.name} left={<LinkBack to="/app/progress" />} />
      <MainContent>
        {chartData.length === 0 ? (
          <div className="p-4 text-center text-on-surface-variant">
            <h2 className="text-lg font-semibold mb-2">No Progress Data</h2>
            <p>No workout history found for {exercise.name}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="px-4">
              <h2 className="text-lg font-semibold mb-2">Progress Over Time</h2>
              <p className="text-sm text-on-surface-variant mb-4">
                Max weight lifted in each workout
              </p>
              
              {/* Time frame selector */}
              <Tabs 
                value={selectedTimeframe} 
                onValueChange={setSelectedTimeframe}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="1m">1M</TabsTrigger>
                  <TabsTrigger value="3m">3M</TabsTrigger>
                  <TabsTrigger value="6m">6M</TabsTrigger>
                  <TabsTrigger value="1y">1Y</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="w-full">
              <ExerciseProgressChart data={filteredChartData} />
            </div>
            
            <div className="px-4 text-sm text-on-surface-variant">
              <p>
                {selectedTimeframe === "all" ? "Total" : "Filtered"} workouts: {filteredChartData.length}
              </p>
              {filteredChartData.length > 0 && (
                <p>
                  Latest: {filteredChartData[filteredChartData.length - 1].weight}{" "}
                  {filteredChartData[filteredChartData.length - 1].units}
                </p>
              )}
            </div>
          </div>
        )}
      </MainContent>
    </Page>
  );
}
