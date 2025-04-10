import { serverClient, fetcher } from '../clients/server';
import useLocalStorageSWR from './useLocalStorageSWR';

export interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  accepts_marketing?: boolean;
  email_verified?: boolean;
  phone_number_verified?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  cfTurnstileResponse: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  accepts_marketing?: boolean;
  accepts_terms: boolean;
  cfTurnstileResponse: string;
}

interface UpdateUserData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  password2?: string;
}

interface PasswordResetInitiate {
  email: string;
}

interface PasswordResetConfirm {
  token: string;
  new_password: string;
  new_password2: string;
}

// API request functions
export const userRequests = {
  login: (credentials: LoginCredentials) => serverClient.post<User>('/users/login/', credentials),

  logout: () => serverClient.post('/users/logout/'),

  register: (data: RegisterData) => serverClient.post<User>('/users/register/', data),

  updateUser: (data: UpdateUserData) => serverClient.patch<User>('/users/update/', data),

  deleteUser: () => serverClient.delete('/users/delete/'),

  initiatePasswordReset: (data: PasswordResetInitiate) =>
    serverClient.post('/users/password-reset/', data),

  confirmPasswordReset: (data: PasswordResetConfirm) =>
    serverClient.post('/users/password-reset-confirm/', data),

  getCurrentUser: () => serverClient.get<User>('/users/user/')
};

// Hooks
export function useUser() {
  const { data, error, mutate } = useLocalStorageSWR<User>('/users/user/', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    revalidateOnMount: true,
    dedupingInterval: 60000
  });

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

// Helper hook for authentication state
export function useAuth() {
  const { user, isLoading, isError, mutate } = useUser();

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data } = await userRequests.login(credentials);
      await mutate(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await userRequests.logout();
      // Clear the user data from the cache by setting it to null/undefined
      await mutate(undefined, { revalidate: false });

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const { data } = await userRequests.register(registerData);
      await mutate(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Add initiatePasswordReset method
  const initiatePasswordReset = async (data: PasswordResetInitiate) => {
    try {
      const response = await userRequests.initiatePasswordReset(data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Add confirmPasswordReset method
  const confirmPasswordReset = async (data: PasswordResetConfirm) => {
    try {
      const response = await userRequests.confirmPasswordReset(data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
    login,
    logout,
    register,
    initiatePasswordReset,
    confirmPasswordReset,
    mutate
  };
}
