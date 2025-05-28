import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getWorkoutDistribution } from '@/lib/workout-utils';
import type { Workout } from '@shared/schema';

interface DistributionChartProps {
  workouts: Workout[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))', 
  'hsl(var(--accent))',
  '#9C27B0',
  '#FF5722',
  '#607D8B'
];

export function DistributionChart({ workouts }: DistributionChartProps) {
  const data = getWorkoutDistribution(workouts);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          dataKey="count"
          nameKey="type"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [value, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
