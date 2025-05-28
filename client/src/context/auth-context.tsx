import { createContext, useContext, useState, useEffect } from 'react';
import type { User, LoginData, SignupData } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check localStorage for existing auth
    const savedAuth = localStorage.getItem('fittracker_auth');
    const savedUser = localStorage.getItem('fittracker_user');
    
    if (savedAuth === 'true' && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('fittracker_auth');
        localStorage.removeItem('fittracker_user');
      }
    }
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', data);
      const { user: userData } = await response.json();
      
      setUser(userData);
      setIsAuthenticated(true);
      
      localStorage.setItem('fittracker_auth', 'true');
      localStorage.setItem('fittracker_user', JSON.stringify(userData));
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await apiRequest('POST', '/api/auth/signup', data);
      const { user: userData } = await response.json();
      
      setUser(userData);
      setIsAuthenticated(true);
      
      localStorage.setItem('fittracker_auth', 'true');
      localStorage.setItem('fittracker_user', JSON.stringify(userData));
    } catch (error) {
      throw new Error('Failed to create account');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('fittracker_auth');
    localStorage.removeItem('fittracker_user');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const response = await apiRequest('PUT', `/api/user/${user.id}`, updates);
      const updatedUser = await response.json();
      
      setUser(updatedUser);
      localStorage.setItem('fittracker_user', JSON.stringify(updatedUser));
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
