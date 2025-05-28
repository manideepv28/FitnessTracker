import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getMonthlyProgress } from '@/lib/workout-utils';
import type { Workout } from '@shared/schema';

interface FrequencyChartProps {
  workouts: Workout[];
  period: string;
  workoutType: string;
}

export function FrequencyChart({ workouts, period, workoutType }: FrequencyChartProps) {
  let filteredWorkouts = workouts;
  
  if (workoutType !== 'all') {
    filteredWorkouts = workouts.filter(w => w.type === workoutType);
  }

  const data = getMonthlyProgress(filteredWorkouts, 6);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
        <Bar 
          dataKey="count" 
          fill="hsl(var(--primary))" 
          radius={4}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
