'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

// Define the schema for reset password
const resetPasswordSchema = z
  .object({
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    new_password2: z.string().min(8, 'Password must be at least 8 characters')
  })
  .refine((data) => data.new_password === data.new_password2, {
    message: "Passwords don't match",
    path: ['new_password2']
  });

// Type for form values
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = ({customerId, token}: {customerId: string, token: string}) => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);


  // Use the auth hook for password reset functionality
  const { confirmPasswordReset, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (values) => {
    try {
      if (!customerId || !token) {
        setError('root', {
          type: 'manual',
          message: 'Invalid reset link. Please request a new password reset.'
        });
        return;
      }

      const result = await confirmPasswordReset({
        customer_id: customerId,
        token,
        new_password: values.new_password,
        new_password2: values.new_password2
      });

      if (result.success) {
        setSuccess(true);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError('root', {
          type: 'manual',
          message: 'Failed to reset password. Please try again.'
        });
      }
    } catch (error) {
      console.error('Unexpected error', error);
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred'
      });
    }
  };

  // If the form was successfully submitted, show a success message
  if (success) {
    return (
      <div className="rounded-lg border border-base-200 bg-base-100 p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-base-content">Password Reset Successful!</h2>
          <p className="mb-6 text-base-content/80">
            Your password has been updated. You will be redirected to the login page shortly.
          </p>
          <Link href="/login" className="btn btn-primary btn-wide">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border border-base-200 bg-base-100 p-8 shadow-lg"
    >
      {/* Show any form-level errors */}
      {errors.root && (
        <div className="alert alert-error mb-6 shadow-md">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p>{errors.root.message}</p>
          </div>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">New Password</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <input
            type="password"
            placeholder="********"
            className={`input input-bordered w-full pl-10 ${errors.new_password ? 'input-error' : ''}`}
            {...register('new_password')}
          />
        </div>
        {errors.new_password && (
          <p className="mt-2 flex items-center text-sm text-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {errors.new_password.message}
          </p>
        )}
      </div>

      <div className="form-control mt-4">
        <label className="label">
          <span className="label-text font-medium">Confirm New Password</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <input
            type="password"
            placeholder="********"
            className={`input input-bordered w-full pl-10 ${errors.new_password2 ? 'input-error' : ''}`}
            {...register('new_password2')}
          />
        </div>
        {errors.new_password2 && (
          <p className="mt-2 flex items-center text-sm text-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {errors.new_password2.message}
          </p>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-info/20 bg-info/10 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-info"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-base-content/80">
              Your password must be at least 8 characters long. We recommend using a combination of
              letters, numbers, and special characters.
            </p>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-8 w-full" disabled={loading}>
        {loading ? (
          <div className="flex items-center justify-center">
            <ClipLoader size={20} color="#ffffff" />
            <span className="ml-2">Resetting...</span>
          </div>
        ) : (
          'Reset Password'
        )}
      </button>

      {/* Form Footer Links */}
      <div className="mt-6 text-center">
        <p className="text-base-content/70">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
