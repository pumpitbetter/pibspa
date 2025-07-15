import React from "react";
import {
  AreaChart,
  Area,
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

interface ExerciseRepsChartProps {
  data: Array<{
    date: string;
    reps: number;
    workoutName?: string;
  }>;
  className?: string;
}

const chartConfig = {
  reps: {
    label: "Reps",
    color: "hsl(var(--secondary))",
  },
};

export function ExerciseRepsChart({ data, className }: ExerciseRepsChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
                            Total Reps: {payload[0].value?.toLocaleString()}
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
            <Area
              type="monotone"
              dataKey="reps"
              stroke="var(--tertiary)"
              fill="var(--tertiary)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
