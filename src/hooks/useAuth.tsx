import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/models/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('studyearn_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in production, this would call an API
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: 'learner',
      createdAt: new Date(),
      verifiedBadges: [],
      isKYCVerified: false,
    };
    setUser(mockUser);
    localStorage.setItem('studyearn_user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, role: UserRole) => {
    // Mock signup - in production, this would call an API
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      role,
      createdAt: new Date(),
      verifiedBadges: [],
      isKYCVerified: false,
    };
    setUser(mockUser);
    localStorage.setItem('studyearn_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studyearn_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('studyearn_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
