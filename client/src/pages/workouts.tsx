import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkoutItem } from '@/components/ui/workout-item';
import { WorkoutModal } from '@/components/modals/workout-modal';
import { useWorkouts } from '@/context/workouts-context';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Workout } from '@shared/schema';

export default function WorkoutsPage() {
  const { workouts, deleteWorkout } = useWorkouts();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [workoutToDelete, setWorkoutToDelete] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    dateFrom: '',
    dateTo: ''
  });

  const filteredWorkouts = workouts.filter(workout => {
    if (filters.type && workout.type !== filters.type) return false;
    if (filters.dateFrom && workout.date < filters.dateFrom) return false;
    if (filters.dateTo && workout.date > filters.dateTo) return false;
    return true;
  });

  const handleAddWorkout = () => {
    setEditingWorkout(null);
    setIsModalOpen(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsModalOpen(true);
  };

  const handleDeleteWorkout = async (id: number) => {
    try {
      await deleteWorkout(id);
      toast({
        title: 'Success',
        description: 'Workout deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete workout',
        variant: 'destructive'
      });
    }
    setWorkoutToDelete(null);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Workouts</h2>
          <p className="text-gray-600">Log and manage your fitness activities</p>
        </div>
        <Button 
          onClick={handleAddWorkout}
          className="bg-primary text-white hover:bg-blue-700 flex items-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Add Workout</span>
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Type
              </label>
              <Select 
                value={filters.type} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="cycling">Cycling</SelectItem>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="swimming">Swimming</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date From
              </label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date To
              </label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Workout History */}
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle>
            Workout History
            {filteredWorkouts.length !== workouts.length && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredWorkouts.length} of {workouts.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredWorkouts.length > 0 ? (
            <div>
              {filteredWorkouts.map(workout => (
                <WorkoutItem 
                  key={workout.id} 
                  workout={workout}
                  onEdit={handleEditWorkout}
                  onDelete={(id) => setWorkoutToDelete(id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <i className="fas fa-search text-4xl mb-4 text-gray-300"></i>
              <p>No workouts found</p>
              <p className="text-sm">
                {workouts.length === 0 
                  ? "Start by adding your first workout!"
                  : "Try adjusting your filters or add a new workout."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workout Modal */}
      <WorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingWorkout={editingWorkout}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={workoutToDelete !== null} onOpenChange={() => setWorkoutToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workout? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => workoutToDelete && handleDeleteWorkout(workoutToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
