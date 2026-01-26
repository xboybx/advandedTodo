import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Priority } from '@/types/todo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriorityChartProps {
  data: Record<Priority, number>;
}

const COLORS: Record<Priority, string> = {
  low: 'hsl(var(--priority-low))',
  medium: 'hsl(var(--priority-medium))',
  high: 'hsl(var(--priority-high))',
  urgent: 'hsl(var(--priority-urgent))',
};

export const PriorityChart = ({ data }: PriorityChartProps) => {
  const chartData = Object.entries(data)
    .map(([priority, count]) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: count,
      priority: priority as Priority,
    }))
    .filter((item) => item.value > 0);

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
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.priority]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
