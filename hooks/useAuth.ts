import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { serverClient } from '@/clients/server';

// Define types
export interface User {
  uuid: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  accepts_marketing: boolean;
  email_verified: boolean;
  phone_number_verified: boolean;
  is_shopify_synced: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  accepts_marketing?: boolean;
}

interface UpdateUserData {
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  accepts_marketing?: boolean;
  password?: string;
  password2?: string;
}

interface ResetPasswordInitiate {
  email: string;
}

interface ResetPasswordConfirm {
  user_id: string;
  token: string;
  new_password: string;
  new_password2: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Since we're using cookies, we just need to make the request
      // Cookies will be sent automatically with withCredentials: true
      const response = await serverClient.get('/users/user/');
      setUser(response.data);
      return true;
    } catch (err) {
      // If the request fails, we're not authenticated
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Login user
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await serverClient.post('/users/login/', credentials);

      // Set the user with the data returned from the API
      // The token is now stored in a cookie by the server
      setUser(response.data);

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await serverClient.post('/users/register/', credentials);

      // Set the user with the data returned from the API
      // The token is now stored in a cookie by the server
      setUser(response.data);

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call the logout endpoint
      // This will clear the token cookie on the server
      await serverClient.post('/users/logout/');

      setUser(null);
      router.push('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Logout failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUser = async (data: UpdateUserData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await serverClient.patch('/users/update/', data);

      setUser((prevUser) => ({
        ...prevUser,
        ...response.data
      }));

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Update failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initiate password reset
  const initiatePasswordReset = async (data: ResetPasswordInitiate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await serverClient.post('/users/password-reset/', data);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Password reset initiation failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Confirm password reset
  const confirmPasswordReset = async (data: ResetPasswordConfirm) => {
    setLoading(true);
    setError(null);

    try {
      const response = await serverClient.post('/users/password-reset-confirm/', data);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Password reset confirmation failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete user account
  const deleteAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      await serverClient.delete('/users/user/');

      setUser(null);
      router.push('/');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Account deletion failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    initiatePasswordReset,
    confirmPasswordReset,
    deleteAccount,
    checkAuth,
    isAuthenticated: !!user
  };
};

export default useAuth;
