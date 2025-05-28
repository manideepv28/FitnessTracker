import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getMonthlyProgress } from '@/lib/workout-utils';
import type { Workout } from '@shared/schema';

interface ProgressChartProps {
  workouts: Workout[];
}

export function ProgressChart({ workouts }: ProgressChartProps) {
  const data = getMonthlyProgress(workouts, 4);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          stroke="#666"
          fontSize={12}
        />
        <YAxis 
          stroke="#666"
          fontSize={12}
        />
        <Area
          type="monotone"
          dataKey="distance"
          stroke="hsl(var(--accent))"
          fill="hsl(var(--accent))"
          fillOpacity={0.1}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
