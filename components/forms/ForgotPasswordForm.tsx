'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../../requests/users';
import Link from 'next/link';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';

// Define the schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

// Type for form values
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  // Use the auth hook for password reset functionality
  const { initiatePasswordReset, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (values) => {
    try {
      // Use the backend to initiate password reset
      const result = await initiatePasswordReset(values);
      if (result.success) {
        setSuccess(true);
      } else {
        setError('root', {
          type: 'manual',
          message: 'Failed to initiate password reset. Please try again.'
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
        <div className="text-center">
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
          <h2 className="mb-4 text-2xl font-bold text-base-content">Check Your Email</h2>
          <div className="mb-8">
            <p className="mb-3 text-base-content/80">
              If an account exists with that email address, we've sent instructions to reset your
              password.
            </p>
            <p className="text-sm text-base-content/60">
              Please check your inbox and spam folder. The email should arrive within a few minutes.
            </p>
          </div>
          <Link href="/login" className="btn btn-primary btn-wide text-white">
            Return to Login
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
          <span className="label-text font-medium">Email Address</span>
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <input
            type="email"
            placeholder="your@email.com"
            className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
            {...register('email')}
          />
        </div>
        {errors.email && (
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
            {errors.email.message}
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
              We'll send you an email with instructions to reset your password.
            </p>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-8 w-full text-white" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center justify-center text-white">
            <ClipLoader size={20} color="#ffffff" />
            <span className="ml-2">Sending...</span>
          </div>
        ) : (
          'Send Reset Link'
        )}
      </button>

      {/* Form Footer Links */}
      <div className="mt-6 text-center">
        <p className="text-base-content/70">
          Remember your password?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
