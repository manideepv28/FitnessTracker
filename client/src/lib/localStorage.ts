import type { User, Workout, InsertUser, InsertWorkout } from '@shared/schema';

// Storage keys
const USERS_KEY = 'fittracker_users';
const WORKOUTS_KEY = 'fittracker_workouts';
const CURRENT_USER_ID_KEY = 'fittracker_current_user_id';
const NEXT_USER_ID_KEY = 'fittracker_next_user_id';
const NEXT_WORKOUT_ID_KEY = 'fittracker_next_workout_id';

// Get data from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Save data to localStorage
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// User management
export const localAuth = {
  async signup(userData: Omit<InsertUser, 'id'>): Promise<User> {
    const users = getFromStorage<User[]>(USERS_KEY, []);
    const nextUserId = getFromStorage<number>(NEXT_USER_ID_KEY, 1);
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    const newUser: User = {
      ...userData,
      id: nextUserId,
      age: userData.age || null,
      height: userData.height || null,
      weight: userData.weight || null,
      weeklyWorkoutGoal: userData.weeklyWorkoutGoal || 4,
      targetWeight: userData.targetWeight || null,
      primaryGoal: userData.primaryGoal || 'general',
      createdAt: new Date()
    };
    
    users.push(newUser);
    saveToStorage(USERS_KEY, users);
    saveToStorage(NEXT_USER_ID_KEY, nextUserId + 1);
    saveToStorage(CURRENT_USER_ID_KEY, newUser.id);
    
    return newUser;
  },

  async login(email: string, password: string): Promise<User> {
    const users = getFromStorage<User[]>(USERS_KEY, []);
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    saveToStorage(CURRENT_USER_ID_KEY, user.id);
    return user;
  },

  async getCurrentUser(): Promise<User | null> {
    const currentUserId = getFromStorage<number | null>(CURRENT_USER_ID_KEY, null);
    if (!currentUserId) return null;
    
    const users = getFromStorage<User[]>(USERS_KEY, []);
    return users.find(u => u.id === currentUserId) || null;
  },

  async updateUser(userId: number, updates: Partial<InsertUser>): Promise<User> {
    const users = getFromStorage<User[]>(USERS_KEY, []);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    saveToStorage(USERS_KEY, users);
    
    return users[userIndex];
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  }
};

// Workout management
export const localWorkouts = {
  async getWorkoutsByUser(userId: number): Promise<Workout[]> {
    const workouts = getFromStorage<Workout[]>(WORKOUTS_KEY, []);
    return workouts
      .filter(w => w.userId === userId)
      .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
  },

  async createWorkout(workoutData: Omit<InsertWorkout, 'id'>): Promise<Workout> {
    const workouts = getFromStorage<Workout[]>(WORKOUTS_KEY, []);
    const nextWorkoutId = getFromStorage<number>(NEXT_WORKOUT_ID_KEY, 1);
    
    const newWorkout: Workout = {
      ...workoutData,
      id: nextWorkoutId,
      distance: workoutData.distance || null,
      calories: workoutData.calories || null,
      notes: workoutData.notes || null,
      createdAt: new Date()
    };
    
    workouts.push(newWorkout);
    saveToStorage(WORKOUTS_KEY, workouts);
    saveToStorage(NEXT_WORKOUT_ID_KEY, nextWorkoutId + 1);
    
    return newWorkout;
  },

  async updateWorkout(workoutId: number, updates: Partial<InsertWorkout>): Promise<Workout> {
    const workouts = getFromStorage<Workout[]>(WORKOUTS_KEY, []);
    const workoutIndex = workouts.findIndex(w => w.id === workoutId);
    
    if (workoutIndex === -1) {
      throw new Error('Workout not found');
    }
    
    workouts[workoutIndex] = { ...workouts[workoutIndex], ...updates };
    saveToStorage(WORKOUTS_KEY, workouts);
    
    return workouts[workoutIndex];
  },

  async deleteWorkout(workoutId: number): Promise<void> {
    const workouts = getFromStorage<Workout[]>(WORKOUTS_KEY, []);
    const filteredWorkouts = workouts.filter(w => w.id !== workoutId);
    
    if (filteredWorkouts.length === workouts.length) {
      throw new Error('Workout not found');
    }
    
    saveToStorage(WORKOUTS_KEY, filteredWorkouts);
  }
};