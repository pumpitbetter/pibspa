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

// Constants for timeframe filtering
const TIMEFRAME_MONTHS = {
  "1m": 1,
  "3m": 3,
  "6m": 6,
  "1y": 12,
} as const;

type TimeframeKey = keyof typeof TIMEFRAME_MONTHS;

// Utility function to get cutoff date for timeframe
const getCutoffDate = (timeframe: string): Date | null => {
  if (timeframe === "all") return null;

  const months = TIMEFRAME_MONTHS[timeframe as TimeframeKey];
  if (!months) return null;

  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  return cutoffDate;
};

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

  // Process history to build aggregated workout data
  const workoutAggregates = new Map<
    string,
    {
      maxWeight: number;
      totalVolume: number;
      totalReps: number;
      maxOneRM: number;
      date: number;
      units: string;
      workoutName: string;
    }
  >();

  // Helper function to calculate 1RM using Brzycki formula
  const calculateOneRM = (weight: number, reps: number): number => {
    return reps <= 15 ? weight * (36 / (37 - reps)) : 0;
  };

  // Single pass through history entries to aggregate all data
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
      const calculatedOneRM = calculateOneRM(currentWeight, currentReps);

      const workout = workoutMap.get(workoutId);
      if (workout) {
        const workoutDate = workout.startedAt || 0;
        const workoutName = workout.name || "Workout";

        const existing = workoutAggregates.get(workoutId);
        if (!existing) {
          workoutAggregates.set(workoutId, {
            maxWeight: currentWeight,
            totalVolume: setVolume,
            totalReps: currentReps,
            maxOneRM: calculatedOneRM,
            date: workoutDate,
            units: currentUnits,
            workoutName: workoutName,
          });
        } else {
          existing.maxWeight = Math.max(existing.maxWeight, currentWeight);
          existing.totalVolume += setVolume;
          existing.totalReps += currentReps;
          existing.maxOneRM = Math.max(existing.maxOneRM, calculatedOneRM);
        }
      }
    }
  }

  // Helper function to create chart data from aggregated workout data
  const createChartDataArrays = (aggregates: Map<string, any>) => {
    const sortedAggregates = Array.from(aggregates.values()).sort(
      (a, b) => a.date - b.date
    );

    return {
      chartData: sortedAggregates.map((stat) => ({
        date: new Date(stat.date).toLocaleDateString(),
        weight: stat.maxWeight,
        units: stat.units,
        workoutName: stat.workoutName,
      })),
      volumeData: sortedAggregates.map((stat) => ({
        date: new Date(stat.date).toLocaleDateString(),
        volume: stat.totalVolume,
        units: stat.units,
        workoutName: stat.workoutName,
      })),
      repsData: sortedAggregates.map((stat) => ({
        date: new Date(stat.date).toLocaleDateString(),
        reps: stat.totalReps,
        workoutName: stat.workoutName,
      })),
      oneRMData: sortedAggregates.map((stat) => ({
        date: new Date(stat.date).toLocaleDateString(),
        oneRM: Math.round(stat.maxOneRM * 100) / 100,
        units: stat.units,
        workoutName: stat.workoutName,
      })),
    };
  };

  const {
    chartData: chartDataArray,
    volumeData: volumeDataArray,
    repsData: repsDataArray,
    oneRMData: oneRMDataArray,
  } = createChartDataArrays(workoutAggregates);

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

// Statistics component for displaying latest workout stats
interface StatisticsProps {
  selectedTimeframe: string;
  chartData: any[];
  volumeData: any[];
  repsData: any[];
  oneRMData: any[];
}

function WorkoutStatistics({
  selectedTimeframe,
  chartData,
  volumeData,
  repsData,
  oneRMData,
}: StatisticsProps) {
  if (chartData.length === 0) return null;

  const latest = {
    weight: chartData[chartData.length - 1],
    volume: volumeData[volumeData.length - 1],
    reps: repsData[repsData.length - 1],
    oneRM: oneRMData[oneRMData.length - 1],
  };

  return (
    <div className="px-4 text-sm text-on-surface-variant">
      <p>
        {selectedTimeframe === "all" ? "Total" : "Filtered"} workouts:{" "}
        {chartData.length}
      </p>
      <div className="space-y-1">
        <p>
          Latest Max Weight: {latest.weight.weight} {latest.weight.units}
        </p>
        {latest.volume && (
          <p>
            Latest Volume: {latest.volume.volume.toLocaleString()}{" "}
            {latest.volume.units}
          </p>
        )}
        {latest.reps && <p>Latest Reps: {latest.reps.reps.toLocaleString()}</p>}
        {latest.oneRM && (
          <p>
            Latest Est. 1RM: {latest.oneRM.oneRM} {latest.oneRM.units}
          </p>
        )}
      </div>
    </div>
  );
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
    const cutoffDate = getCutoffDate(selectedTimeframe);

    if (!cutoffDate) {
      return { chartData, volumeData, repsData, oneRMData };
    }

    const filterByDate = <T extends { date: string }>(data: T[]): T[] =>
      data.filter((item) => new Date(item.date) >= cutoffDate);

    return {
      chartData: filterByDate(chartData),
      volumeData: filterByDate(volumeData),
      repsData: filterByDate(repsData),
      oneRMData: filterByDate(oneRMData),
    };
  }, [chartData, volumeData, repsData, oneRMData, selectedTimeframe]);

  // Destructure filtered data for easier access
  const {
    chartData: filteredChartData,
    volumeData: filteredVolumeData,
    repsData: filteredRepsData,
    oneRMData: filteredOneRMData,
  } = filteredData;

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

              <WorkoutStatistics
                selectedTimeframe={selectedTimeframe}
                chartData={filteredChartData}
                volumeData={filteredVolumeData}
                repsData={filteredRepsData}
                oneRMData={filteredOneRMData}
              />
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
