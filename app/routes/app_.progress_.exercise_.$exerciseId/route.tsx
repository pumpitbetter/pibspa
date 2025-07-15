import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { LinkBack } from "~/components/link-back";
import { ExerciseProgressChart } from "~/components/exercise-progress-chart";
import { ExerciseVolumeChart } from "~/components/exercise-volume-chart";
import { ExerciseRepsChart } from "~/components/exercise-reps-chart";
import { ExerciseOneRMChart } from "~/components/exercise-one-rm-chart";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { dbPromise } from "~/db/db";
import { useState, useMemo, useEffect, useRef } from "react";

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
  const volumeData = [];
  const workoutStats = new Map<
    string,
    { maxWeight: number; date: number; units: string; workoutName: string }
  >();
  const workoutVolumes = new Map<
    string,
    { totalVolume: number; date: number; units: string; workoutName: string }
  >();
  const workoutReps = new Map<
    string,
    { totalReps: number; date: number; workoutName: string }
  >();
  const workoutOneRMs = new Map<
    string,
    { maxOneRM: number; date: number; units: string; workoutName: string }
  >();

  // Group by workout and find max weight per workout + calculate volume + calculate reps + calculate 1RM
  for (const entry of historyEntries) {
    const historyData = entry.toMutableJSON();

    if (
      historyData.liftedWeight?.value !== undefined &&
      historyData.liftedWeight.value >= 0 &&
      historyData.liftedReps !== undefined &&
      historyData.liftedReps > 0
    ) {
      const workoutId = historyData.workoutId;
      const currentWeight = historyData.liftedWeight.value;
      const currentUnits = historyData.liftedWeight.units;
      const currentReps = historyData.liftedReps;
      const setVolume = currentWeight * currentReps;

      const workout = workoutMap.get(workoutId);
      if (workout) {
        const workoutDate = workout.startedAt || 0;
        const workoutName = workout.name || "Workout";

        // Update max weight tracking
        const existing = workoutStats.get(workoutId);
        if (!existing || currentWeight > existing.maxWeight) {
          workoutStats.set(workoutId, {
            maxWeight: currentWeight,
            date: workoutDate,
            units: currentUnits,
            workoutName: workoutName,
          });
        }

        // Update volume tracking
        const existingVolume = workoutVolumes.get(workoutId);
        if (!existingVolume) {
          workoutVolumes.set(workoutId, {
            totalVolume: setVolume,
            date: workoutDate,
            units: currentUnits,
            workoutName: workoutName,
          });
        } else {
          existingVolume.totalVolume += setVolume;
        }

        // Update reps tracking
        const existingReps = workoutReps.get(workoutId);
        if (!existingReps) {
          workoutReps.set(workoutId, {
            totalReps: currentReps,
            date: workoutDate,
            workoutName: workoutName,
          });
        } else {
          existingReps.totalReps += currentReps;
        }

        // Calculate and update 1RM tracking using Brzycki formula
        // 1RM = weight × (36 / (37 - reps))
        // Only calculate if reps <= 15 for accuracy
        if (currentReps <= 15) {
          const calculatedOneRM = currentWeight * (36 / (37 - currentReps));
          const existingOneRM = workoutOneRMs.get(workoutId);
          if (!existingOneRM || calculatedOneRM > existingOneRM.maxOneRM) {
            workoutOneRMs.set(workoutId, {
              maxOneRM: calculatedOneRM,
              date: workoutDate,
              units: currentUnits,
              workoutName: workoutName,
            });
          }
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

  // Convert volume data to chart format
  const volumeDataArray = Array.from(workoutVolumes.values())
    .sort((a, b) => a.date - b.date)
    .map((stat) => ({
      date: new Date(stat.date).toLocaleDateString(),
      volume: stat.totalVolume,
      units: stat.units,
      workoutName: stat.workoutName,
    }));

  // Convert reps data to chart format
  const repsDataArray = Array.from(workoutReps.values())
    .sort((a, b) => a.date - b.date)
    .map((stat) => ({
      date: new Date(stat.date).toLocaleDateString(),
      reps: stat.totalReps,
      workoutName: stat.workoutName,
    }));

  // Convert 1RM data to chart format
  const oneRMDataArray = Array.from(workoutOneRMs.values())
    .sort((a, b) => a.date - b.date)
    .map((stat) => ({
      date: new Date(stat.date).toLocaleDateString(),
      oneRM: Math.round(stat.maxOneRM * 100) / 100, // Round to 2 decimal places
      units: stat.units,
      workoutName: stat.workoutName,
    }));

  return {
    exercise: exercise.toMutableJSON(),
    chartData: chartDataArray,
    volumeData: volumeDataArray,
    repsData: repsDataArray,
    oneRMData: oneRMDataArray,
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
    volumeData: Array<{
      date: string;
      volume: number;
      units: string;
      workoutName: string;
    }>;
    repsData: Array<{
      date: string;
      reps: number;
      workoutName: string;
    }>;
    oneRMData: Array<{
      date: string;
      oneRM: number;
      units: string;
      workoutName: string;
    }>;
  };
}

export default function ExerciseProgress({ loaderData }: ComponentProps) {
  const { exercise, chartData, volumeData, repsData, oneRMData } = loaderData;
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");

  // Refs for scroll position preservation
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  // Save scroll position when timeframe changes
  const handleTimeframeChange = (newTimeframe: string) => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
    setSelectedTimeframe(newTimeframe);
  };

  // Restore scroll position after timeframe change
  useEffect(() => {
    if (scrollContainerRef.current && scrollPositionRef.current > 0) {
      scrollContainerRef.current.scrollTop = scrollPositionRef.current;
    }
  }, [selectedTimeframe]);

  // Filter all data based on selected timeframe
  const filteredData = useMemo(() => {
    if (selectedTimeframe === "all") {
      return {
        chartData,
        volumeData,
        repsData,
        oneRMData,
      };
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
        return {
          chartData,
          volumeData,
          repsData,
          oneRMData,
        };
    }

    const filterByDate = <T extends { date: string }>(data: T[]): T[] =>
      data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= cutoffDate;
      });

    return {
      chartData: filterByDate(chartData),
      volumeData: filterByDate(volumeData),
      repsData: filterByDate(repsData),
      oneRMData: filterByDate(oneRMData),
    };
  }, [chartData, volumeData, repsData, oneRMData, selectedTimeframe]);

  // Destructure filtered data for easier access
  const { chartData: filteredChartData, volumeData: filteredVolumeData, repsData: filteredRepsData, oneRMData: filteredOneRMData } = filteredData;

  return (
    <Page>
      <Header title={exercise.name} left={<LinkBack to="/app/progress" />} />
      {chartData.length === 0 ? (
        <MainContent>
          <div className="p-4 text-center text-on-surface-variant">
            <h2 className="text-lg font-semibold mb-2">No Progress Data</h2>
            <p>No workout history found for {exercise.name}</p>
          </div>
        </MainContent>
      ) : (
        <div className="flex flex-col h-full">
          {/* Sticky tabs container */}
          <div className="sticky top-0 z-10 bg-background border-border">
            <div className="px-4 py-3">
              <Tabs
                value={selectedTimeframe}
                onValueChange={handleTimeframeChange}
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
          </div>

          {/* Scrollable content */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
            <div className="space-y-4 pb-4">
              <p className="text-sm text-on-surface-variant mb-4 px-6 pt-6">
                Max weight lifted in each workout:
              </p>
              <div className="w-full">
                <ExerciseProgressChart data={filteredChartData} />
              </div>

              <p className="text-sm text-on-surface-variant mb-4 px-6 mt-8">
                Total volume (weight × reps) in each workout:
              </p>
              <div className="w-full">
                <ExerciseVolumeChart data={filteredVolumeData} />
              </div>

              <p className="text-sm text-on-surface-variant mb-4 px-6 mt-8">
                Total reps lifted in each workout:
              </p>
              <div className="w-full">
                <ExerciseRepsChart data={filteredRepsData} />
              </div>

              <p className="text-sm text-on-surface-variant mb-4 px-6 mt-8">
                Estimated 1RM (One Rep Max) for each workout:
              </p>
              <div className="w-full">
                <ExerciseOneRMChart data={filteredOneRMData} />
              </div>

              <div className="px-4 text-sm text-on-surface-variant">
                <p>
                  {selectedTimeframe === "all" ? "Total" : "Filtered"} workouts:{" "}
                  {filteredChartData.length}
                </p>
                {filteredChartData.length > 0 && (
                  <div className="space-y-1">
                    <p>
                      Latest Max Weight:{" "}
                      {filteredChartData[filteredChartData.length - 1].weight}{" "}
                      {filteredChartData[filteredChartData.length - 1].units}
                    </p>
                    {filteredVolumeData.length > 0 && (
                      <p>
                        Latest Volume:{" "}
                        {filteredVolumeData[
                          filteredVolumeData.length - 1
                        ].volume.toLocaleString()}{" "}
                        {
                          filteredVolumeData[filteredVolumeData.length - 1]
                            .units
                        }
                      </p>
                    )}
                    {filteredRepsData.length > 0 && (
                      <p>
                        Latest Reps:{" "}
                        {filteredRepsData[
                          filteredRepsData.length - 1
                        ].reps.toLocaleString()}
                      </p>
                    )}
                    {filteredOneRMData.length > 0 && (
                      <p>
                        Latest Est. 1RM:{" "}
                        {filteredOneRMData[filteredOneRMData.length - 1].oneRM}{" "}
                        {filteredOneRMData[filteredOneRMData.length - 1].units}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
