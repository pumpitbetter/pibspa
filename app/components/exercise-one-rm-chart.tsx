import React from "react";
import {
  LineChart,
  Line,
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

interface ExerciseOneRMChartProps {
  data: Array<{
    date: string;
    oneRM: number;
    units: string;
    workoutName?: string;
  }>;
  className?: string;
}

const chartConfig = {
  oneRM: {
    label: "Estimated 1RM",
    color: "hsl(var(--primary))",
  },
};

export function ExerciseOneRMChart({
  data,
  className,
}: ExerciseOneRMChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
                            Estimated 1RM: {payload[0].value}{" "}
                            {payload[0].payload.units}
                          </p>
                          {payload[0].payload.workoutName && (
                            <p className="text-sm text-muted-foreground">
                              {payload[0].payload.workoutName}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Based on Brzycki formula
                          </p>
                        </div>
                      </ChartTooltipContent>
                    </ChartTooltip>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="oneRM"
              stroke="var(--tertiary)"
              strokeWidth={2}
              dot={{ fill: "var(--tertiary)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
