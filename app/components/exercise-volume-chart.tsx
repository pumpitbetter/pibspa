import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { cn } from "~/lib/utils";

interface ExerciseVolumeChartProps {
  data: Array<{
    date: string;
    volume: number;
    units: string;
    workoutName?: string;
  }>;
  className?: string;
}

const chartConfig = {
  volume: {
    label: "Volume",
    color: "hsl(var(--primary))",
  },
};

export function ExerciseVolumeChart({
  data,
  className,
}: ExerciseVolumeChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 16,
              left: -8,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted-foreground/30"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              className="text-xs fill-muted-foreground"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-xs fill-muted-foreground"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltip>
                      <ChartTooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm">
                            Volume: {payload[0].value?.toLocaleString()}{" "}
                            {payload[0].payload.units || "lbs"}
                          </p>
                          {payload[0].payload.workoutName && (
                            <p className="text-sm text-muted-foreground">
                              {payload[0].payload.workoutName}
                            </p>
                          )}
                        </div>
                      </ChartTooltipContent>
                    </ChartTooltip>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="volume"
              fill="var(--tertiary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
