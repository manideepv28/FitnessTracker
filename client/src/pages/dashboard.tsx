import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { WorkoutItem } from '@/components/ui/workout-item';
import { WeeklyChart } from '@/components/charts/weekly-chart';
import { ProgressChart } from '@/components/charts/progress-chart';
import { useWorkouts } from '@/context/workouts-context';
import { calculateStats } from '@/lib/workout-utils';

export default function DashboardPage() {
  const { workouts } = useWorkouts();
  const stats = calculateStats(workouts);
  const recentWorkouts = workouts.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Your fitness overview at a glance</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon="fas fa-dumbbell"
          color="primary"
          trend={{
            value: "+12% from last month",
            isPositive: true
          }}
        />
        
        <StatsCard
          title="This Week"
          value={stats.thisWeek}
          icon="fas fa-calendar-week"
          color="secondary"
          trend={{
            value: "+2 from last week",
            isPositive: true
          }}
        />
        
        <StatsCard
          title="Total Distance"
          value={stats.totalDistance}
          subtitle="miles"
          icon="fas fa-route"
          color="accent"
        />
        
        <StatsCard
          title="Avg Duration"
          value={stats.avgDuration}
          subtitle="minutes"
          icon="fas fa-clock"
          color="purple"
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <WeeklyChart workouts={workouts} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle>Progress Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ProgressChart workouts={workouts} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Workouts */}
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Workouts</CardTitle>
            {workouts.length > 5 && (
              <button className="text-primary hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentWorkouts.length > 0 ? (
            <div>
              {recentWorkouts.map(workout => (
                <WorkoutItem 
                  key={workout.id} 
                  workout={workout} 
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <i className="fas fa-dumbbell text-4xl mb-4 text-gray-300"></i>
              <p>No workouts logged yet</p>
              <p className="text-sm">Start by adding your first workout!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
