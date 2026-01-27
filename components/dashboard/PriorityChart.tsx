"use client";

import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Priority } from '@/types/todo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriorityChartProps {
  data: Record<Priority, number>;
}

const COLORS: Record<Priority, string> = {
  low: 'hsl(var(--chart-5))',
  medium: 'hsl(var(--chart-3))',
  high: 'hsl(var(--chart-2))',
  urgent: 'hsl(var(--chart-1))',
};

export const PriorityChart = ({ data }: PriorityChartProps) => {
  const router = useRouter();

  const chartData = Object.entries(data)
    .map(([priority, count]) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: count,
      priority: priority as Priority,
    }))
    .filter((item) => item.value > 0);

  const handleSegmentClick = (data: any) => {
    if (data && data.priority) {
      router.push(`/todos/filter/${data.priority}`);
    }
  };

  if (chartData.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Tasks by Priority</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">No tasks to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">Tasks by Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              onClick={handleSegmentClick}
              className="cursor-pointer"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.priority]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
