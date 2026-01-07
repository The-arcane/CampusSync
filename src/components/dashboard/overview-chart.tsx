"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  students: {
    label: "Students",
    color: "hsl(var(--primary))",
  },
  staff: {
    label: "Staff",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig

type OverviewChartProps = {
    data: any[];
}

export function OverviewChart({ data }: OverviewChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <ResponsiveContainer>
            <BarChart data={data}>
                <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="students" fill="var(--color-students)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="staff" fill="var(--color-staff)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
  );
}
