import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useWorkouts } from '@/context/workouts-context';
import { useToast } from '@/hooks/use-toast';
import type { Workout } from '@shared/schema';

const workoutSchema = z.object({
  type: z.string().min(1, 'Please select a workout type'),
  name: z.string().min(1, 'Please enter a workout name'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  distance: z.number().optional(),
  calories: z.number().optional(),
  notes: z.string().optional()
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingWorkout?: Workout | null;
}

export function WorkoutModal({ isOpen, onClose, editingWorkout }: WorkoutModalProps) {
  const { addWorkout, updateWorkout } = useWorkouts();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      type: '',
      name: '',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      duration: 30,
      distance: undefined,
      calories: undefined,
      notes: ''
    }
  });

  useEffect(() => {
    if (editingWorkout) {
      form.reset({
        type: editingWorkout.type,
        name: editingWorkout.name,
        date: editingWorkout.date,
        time: editingWorkout.time,
        duration: editingWorkout.duration,
        distance: editingWorkout.distance || undefined,
        calories: editingWorkout.calories || undefined,
        notes: editingWorkout.notes || ''
      });
    } else {
      form.reset({
        type: '',
        name: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        duration: 30,
        distance: undefined,
        calories: undefined,
        notes: ''
      });
    }
  }, [editingWorkout, form]);

  const onSubmit = async (data: WorkoutFormData) => {
    setIsSubmitting(true);
    try {
      if (editingWorkout) {
        await updateWorkout(editingWorkout.id, data);
        toast({
          title: 'Success',
          description: 'Workout updated successfully!'
        });
      } else {
        await addWorkout(data);
        toast({
          title: 'Success', 
          description: 'Workout added successfully!'
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: editingWorkout ? 'Failed to update workout' : 'Failed to add workout',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle>
              {editingWorkout ? 'Edit Workout' : 'Add Workout'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-xl"></i>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select workout type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="running">Running</SelectItem>
                          <SelectItem value="cycling">Cycling</SelectItem>
                          <SelectItem value="strength">Strength Training</SelectItem>
                          <SelectItem value="swimming">Swimming</SelectItem>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Morning Run" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance (miles)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0"
                          placeholder="Optional"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories Burned</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          placeholder="Optional"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3}
                        placeholder="How did the workout feel? Any achievements or observations?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white hover:bg-blue-700"
                >
                  {isSubmitting ? 'Saving...' : editingWorkout ? 'Update Workout' : 'Save Workout'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
