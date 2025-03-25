import React, { createContext, useContext, ReactNode } from 'react';
import useAuth, { User } from '../hooks/useAuth';
import { useAuth as useLegacyAuth } from '../requests/users';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (credentials: {
    email: string;
    password: string;
    password2: string;
    first_name?: string;
    last_name?: string;
    accepts_marketing?: boolean;
  }) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (data: {
    username?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    accepts_marketing?: boolean;
    password?: string;
    password2?: string;
  }) => Promise<any>;
  initiatePasswordReset: (data: { email: string }) => Promise<any>;
  confirmPasswordReset: (data: {
    customer_id: string;
    token: string;
    new_password: string;
    new_password2: string;
  }) => Promise<any>;
  deleteAccount: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  const combinedAuth = {
    ...auth,
    initiatePasswordReset: async (data: { email: string }) => {
      return await auth.initiatePasswordReset(data);
    },
    confirmPasswordReset: async (data: {
      customer_id: string;
      token: string;
      new_password: string;
      new_password2: string;
    }) => {
      return await auth.confirmPasswordReset(data);
    }
  };

  return <AuthContext.Provider value={combinedAuth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
