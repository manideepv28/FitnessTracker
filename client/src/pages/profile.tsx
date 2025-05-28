import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/auth-context';
import { useWorkouts } from '@/context/workouts-context';
import { useToast } from '@/hooks/use-toast';
import { calculateStats } from '@/lib/workout-utils';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(1).max(120).optional(),
  height: z.number().min(1).max(10).optional(),
  weight: z.number().min(1).max(1000).optional()
});

const goalsSchema = z.object({
  weeklyWorkoutGoal: z.number().min(1).max(7),
  targetWeight: z.number().min(1).max(1000).optional(),
  primaryGoal: z.string()
});

type ProfileFormData = z.infer<typeof profileSchema>;
type GoalsFormData = z.infer<typeof goalsSchema>;

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { workouts } = useWorkouts();
  const { toast } = useToast();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingGoals, setIsUpdatingGoals] = useState(false);

  const stats = calculateStats(workouts);
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  }) : 'N/A';

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      age: user?.age || undefined,
      height: user?.height || undefined,
      weight: user?.weight || undefined
    }
  });

  const goalsForm = useForm<GoalsFormData>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      weeklyWorkoutGoal: user?.weeklyWorkoutGoal || 4,
      targetWeight: user?.targetWeight || undefined,
      primaryGoal: user?.primaryGoal || 'general'
    }
  });

  const onUpdateProfile = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    try {
      await updateProfile(data);
      toast({
        title: 'Success',
        description: 'Profile updated successfully!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onUpdateGoals = async (data: GoalsFormData) => {
    setIsUpdatingGoals(true);
    try {
      await updateProfile(data);
      toast({
        title: 'Success',
        description: 'Goals updated successfully!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update goals',
        variant: 'destructive'
      });
    } finally {
      setIsUpdatingGoals(false);
    }
  };

  const handleExportData = () => {
    const data = {
      user,
      workouts,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fittracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Success',
      description: 'Data exported successfully!'
    });
  };

  const calculateBMI = () => {
    if (!user?.height || !user?.weight) return null;
    const heightInM = user.height * 0.3048; // Convert feet to meters
    const weightInKg = user.weight * 0.453592; // Convert lbs to kg
    const bmi = weightInKg / (heightInM * heightInM);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile</h2>
        <p className="text-gray-600">Manage your account and fitness preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (ft)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (lbs)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isUpdatingProfile}
                    className="bg-primary text-white hover:bg-blue-700"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Fitness Goals */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle>Fitness Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...goalsForm}>
                <form onSubmit={goalsForm.handleSubmit(onUpdateGoals)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={goalsForm.control}
                      name="weeklyWorkoutGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekly Workout Goal</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="7"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={goalsForm.control}
                      name="targetWeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Weight (lbs)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
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
                    control={goalsForm.control}
                    name="primaryGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Fitness Goal</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weight-loss">Weight Loss</SelectItem>
                            <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                            <SelectItem value="endurance">Improve Endurance</SelectItem>
                            <SelectItem value="strength">Build Strength</SelectItem>
                            <SelectItem value="general">General Fitness</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isUpdatingGoals}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    {isUpdatingGoals ? 'Updating...' : 'Update Goals'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Profile Stats */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="border border-gray-100 shadow-sm text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-600 mb-4">Member since {memberSince}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>🎯 Goal: {user?.primaryGoal?.replace('-', ' ') || 'General Fitness'}</p>
                {calculateBMI() && (
                  <p>📊 BMI: {calculateBMI()} ({getBMICategory(Number(calculateBMI()))})</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Stats */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Workouts</span>
                  <span className="font-semibold text-gray-900">{stats.totalWorkouts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-semibold text-gray-900">{stats.thisWeek}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Distance</span>
                  <span className="font-semibold text-gray-900">{stats.totalDistance} miles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Duration</span>
                  <span className="font-semibold text-gray-900">{stats.avgDuration} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Account Actions */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  onClick={handleExportData}
                  className="w-full justify-start text-gray-700 hover:bg-gray-50"
                >
                  <i className="fas fa-download w-4 mr-2"></i>
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
