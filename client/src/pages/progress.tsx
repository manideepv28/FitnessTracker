import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FrequencyChart } from '@/components/charts/frequency-chart';
import { ProgressChart } from '@/components/charts/progress-chart';
import { DistributionChart } from '@/components/charts/distribution-chart';
import { useWorkouts } from '@/context/workouts-context';
import { calculateStats } from '@/lib/workout-utils';

export default function ProgressPage() {
  const { workouts } = useWorkouts();
  const [chartFilters, setChartFilters] = useState({
    period: 'month',
    type: 'all'
  });

  const stats = calculateStats(workouts);

  const totalHours = Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / 60 * 10) / 10;
  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
  const avgCalories = workouts.length > 0 ? Math.round(totalCalories / workouts.length) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Progress</h2>
        <p className="text-gray-600">Track your fitness improvements over time</p>
      </div>
      
      {/* Chart Filters */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <Select 
                value={chartFilters.period} 
                onValueChange={(value) => setChartFilters(prev => ({ ...prev, period: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Type
              </label>
              <Select 
                value={chartFilters.type} 
                onValueChange={(value) => setChartFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="cycling">Cycling</SelectItem>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="swimming">Swimming</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                className="w-full bg-primary text-white hover:bg-blue-700"
                onClick={() => {/* Charts will automatically update with filter changes */}}
              >
                Update Charts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle>Workout Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <FrequencyChart 
                workouts={workouts} 
                period={chartFilters.period}
                workoutType={chartFilters.type}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle>Distance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ProgressChart workouts={workouts} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Charts and Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle>Workout Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <DistributionChart workouts={workouts} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Average Distance</span>
                  <span className="text-sm text-gray-600">
                    {workouts.length > 0 ? (stats.totalDistance / workouts.length).toFixed(1) : 0} miles
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${Math.min((stats.totalDistance / workouts.length || 0) * 10, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Average Duration</span>
                  <span className="text-sm text-gray-600">{stats.avgDuration} minutes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(stats.avgDuration, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Weekly Frequency</span>
                  <span className="text-sm text-gray-600">{stats.thisWeek} workouts</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(stats.thisWeek * 20, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Avg Calories/Workout</span>
                  <span className="text-sm text-gray-600">{avgCalories} calories</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(avgCalories / 5, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
