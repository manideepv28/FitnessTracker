import { createContext, useContext, useState, useEffect } from 'react';
import type { User, LoginData, SignupData } from '@shared/schema';
import { localAuth } from '@/lib/localStorage';

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
    // Check for existing authenticated user
    const checkAuth = async () => {
      try {
        const currentUser = await localAuth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to check auth:', error);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const userData = await localAuth.login(data.email, data.password);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const userData = await localAuth.signup(data);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Failed to create account');
    }
  };

  const logout = () => {
    localAuth.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedUser = await localAuth.updateUser(user.id, updates);
      setUser(updatedUser);
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
