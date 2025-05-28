import type { Workout } from '@shared/schema';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export function getWorkoutIcon(type: string): string {
  const icons: Record<string, string> = {
    running: 'fas fa-running',
    cycling: 'fas fa-bicycle',
    strength: 'fas fa-dumbbell',
    swimming: 'fas fa-swimmer',
    yoga: 'fas fa-leaf',
    cardio: 'fas fa-heartbeat',
    other: 'fas fa-plus-circle'
  };
  return icons[type] || icons.other;
}

export function getWorkoutTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    running: 'Running',
    cycling: 'Cycling',
    strength: 'Strength Training',
    swimming: 'Swimming',
    yoga: 'Yoga',
    cardio: 'Cardio',
    other: 'Other'
  };
  return labels[type] || 'Other';
}

export function formatWorkoutDate(date: string, time: string): string {
  try {
    const dateTime = new Date(`${date}T${time}`);
    return format(dateTime, 'MMM d, yyyy \'at\' h:mm a');
  } catch {
    return `${date} at ${time}`;
  }
}

export function calculateStats(workouts: Workout[]) {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  
  const thisWeekWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(`${workout.date}T${workout.time}`);
    return isWithinInterval(workoutDate, { start: weekStart, end: weekEnd });
  });
  
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const avgDuration = workouts.length > 0 ? Math.round(totalDuration / workouts.length) : 0;
  
  return {
    totalWorkouts: workouts.length,
    thisWeek: thisWeekWorkouts.length,
    totalDistance: Math.round(totalDistance * 10) / 10,
    avgDuration
  };
}

export function getWeeklyData(workouts: Workout[]) {
  const now = new Date();
  const weekStart = startOfWeek(now);
  
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dayWorkouts = workouts.filter(w => w.date === dateStr);
    
    return {
      day: format(date, 'EEE'),
      count: dayWorkouts.length
    };
  });
  
  return weeklyData;
}

export function getMonthlyProgress(workouts: Workout[], months: number = 6) {
  const now = new Date();
  const monthlyData = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = format(month, 'yyyy-MM');
    
    const monthWorkouts = workouts.filter(w => w.date.startsWith(monthStr));
    const totalDistance = monthWorkouts.reduce((sum, w) => sum + (w.distance || 0), 0);
    
    monthlyData.push({
      month: format(month, 'MMM'),
      distance: Math.round(totalDistance * 10) / 10,
      count: monthWorkouts.length
    });
  }
  
  return monthlyData;
}

export function getWorkoutDistribution(workouts: Workout[]) {
  const distribution: Record<string, number> = {};
  
  workouts.forEach(workout => {
    distribution[workout.type] = (distribution[workout.type] || 0) + 1;
  });
  
  return Object.entries(distribution).map(([type, count]) => ({
    type: getWorkoutTypeLabel(type),
    count,
    percentage: Math.round((count / workouts.length) * 100)
  }));
}
