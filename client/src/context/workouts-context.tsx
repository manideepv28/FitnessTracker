import { createContext, useContext, useState, useEffect } from 'react';
import type { Workout, InsertWorkout } from '@shared/schema';
import { useAuth } from './auth-context';
import { apiRequest } from '@/lib/queryClient';

interface WorkoutsContextType {
  workouts: Workout[];
  loading: boolean;
  addWorkout: (workout: Omit<InsertWorkout, 'userId'>) => Promise<void>;
  updateWorkout: (id: number, updates: Partial<InsertWorkout>) => Promise<void>;
  deleteWorkout: (id: number) => Promise<void>;
  refreshWorkouts: () => Promise<void>;
}

const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);

export function WorkoutsProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshWorkouts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/workouts/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      }
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWorkouts();
  }, [user]);

  const addWorkout = async (workoutData: Omit<InsertWorkout, 'userId'>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const response = await apiRequest('POST', '/api/workouts', {
        ...workoutData,
        userId: user.id
      });
      const newWorkout = await response.json();
      setWorkouts(prev => [newWorkout, ...prev]);
    } catch (error) {
      throw new Error('Failed to add workout');
    }
  };

  const updateWorkout = async (id: number, updates: Partial<InsertWorkout>) => {
    try {
      const response = await apiRequest('PUT', `/api/workouts/${id}`, updates);
      const updatedWorkout = await response.json();
      setWorkouts(prev => prev.map(w => w.id === id ? updatedWorkout : w));
    } catch (error) {
      throw new Error('Failed to update workout');
    }
  };

  const deleteWorkout = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/workouts/${id}`);
      setWorkouts(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      throw new Error('Failed to delete workout');
    }
  };

  return (
    <WorkoutsContext.Provider value={{
      workouts,
      loading,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      refreshWorkouts
    }}>
      {children}
    </WorkoutsContext.Provider>
  );
}

export function useWorkouts() {
  const context = useContext(WorkoutsContext);
  if (context === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutsProvider');
  }
  return context;
}
