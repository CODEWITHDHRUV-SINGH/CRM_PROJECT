import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { setAuthToken, clearAuthToken } from '../api/interceptors';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationName: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = 'crm-auth-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as AuthUser);
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // MOCK LOGIN — Phase 13 will replace with real POST /auth/login
    await new Promise((r) => setTimeout(r, 400));

    if (!email.trim() || !password.trim()) {
      throw new Error('Email and password are required');
    }

    const fakeUser: AuthUser = {
      id: 'user-demo-001',
      name: 'Alex Morgan',
      email,
      role: 'Workspace admin',
      organizationName: 'Northstar Studio',
    };

    setAuthToken(`mock-token-${Date.now()}`);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fakeUser));
    setUser(fakeUser);
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}