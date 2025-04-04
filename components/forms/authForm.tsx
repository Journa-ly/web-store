'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthFormType } from 'types/authForm';
import { z } from 'zod';
import { useAuth } from '../../requests/users';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ClipLoader } from 'react-spinners';
import Turnstile from 'react-turnstile';

// Update the schemas to match backend expectations
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Your password must have at least 6 characters'),
  cfTurnstileResponse: z.string().min(1, 'Please complete the CAPTCHA')
});

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(150, 'Username must be less than 150 characters')
      .regex(/^[\w\-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Your password must have at least 6 characters'),
    password2: z.string().min(6, 'Your password must have at least 6 characters'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    accepts_marketing: z.boolean().optional().default(true),
    accepts_terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms of service to create an account'
    }),
    cfTurnstileResponse: z.string().min(1, 'Please complete the CAPTCHA')
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords don't match",
    path: ['password2']
  });

// Reusable form props
type LoginFormValues = z.infer<typeof loginSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

interface AuthFormProps {
  formType: AuthFormType;
}

const AuthForm: React.FC<AuthFormProps> = ({ formType }) => {
  const isLogin = formType === AuthFormType.LOGIN;
  const isSignUp = formType === AuthFormType.SIGNUP;

  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(Date.now().toString());

  // Use the auth hook for all authentication functionality
  const { login, register: registerUser, isLoading } = useAuth();

  // Determine which schema to use based on form type
  const getSchema = () => {
    if (isLogin) return loginSchema;
    if (isSignUp) return signUpSchema;
    return loginSchema; // Default
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue
  } = useForm({
    resolver: zodResolver(getSchema())
  });

  const onTurnstileVerify = (token: string) => {
    setTurnstileToken(token);
    setValue('cfTurnstileResponse', token);
    setTurnstileError(false);
  };

  const onTurnstileError = () => {
    setTurnstileError(true);
    setValue('cfTurnstileResponse', '');
  };

  const onTurnstileExpire = () => {
    setTurnstileToken('');
    setValue('cfTurnstileResponse', '');
    setTurnstileError(true);
  };

  const resetTurnstile = useCallback(() => {
    // Reset the Turnstile component by changing its key, forcing a re-render
    setTurnstileKey(Date.now().toString());
    setTurnstileToken('');
    setValue('cfTurnstileResponse', '');
  }, [setValue]);

  const onSubmit: SubmitHandler<any> = async (values) => {
    if (!turnstileToken) {
      setTurnstileError(true);
      setError('cfTurnstileResponse', {
        type: 'manual',
        message: 'Please complete the CAPTCHA verification'
      });
      return;
    }

    try {
      if (isLogin) {
        const loginData = {
          ...(values as LoginFormValues),
          cfTurnstileResponse: turnstileToken
        };

        const result = await login(loginData);
        if (result.success && result.data) {
          router.push('/designs/trending');
        } else {
          setError('root', {
            type: 'manual',
            message: 'Invalid email or password'
          });
          // Reset turnstile on failed login
          resetTurnstile();
        }
      } else if (isSignUp) {
        const signUpData = {
          ...(values as SignUpFormValues),
          cfTurnstileResponse: turnstileToken
        };

        const result = await registerUser(signUpData);
        if (result.success) {
          router.push('/designs/trending');
        } else {
          // Handle specific validation errors from the backend
          const error = result.error as any;
          if (error.response?.data) {
            Object.keys(error.response.data).forEach((key) => {
              const errorMessage = Array.isArray(error.response.data[key])
                ? error.response.data[key][0]
                : error.response.data[key];
              setError(key as any, {
                type: 'manual',
                message: errorMessage
              });
            });
          } else {
            setError('root', {
              type: 'manual',
              message: 'Registration failed. Please try again.'
            });
          }

          // Reset turnstile on failed signup
          resetTurnstile();
        }
      }
    } catch (error) {
      console.error('Unexpected error', error);
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred'
      });

      // Reset turnstile on error
      resetTurnstile();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-base-100 p-8 shadow-md">
      {/* Show any form-level errors */}
      {errors.root && (
        <div className="alert alert-error mb-4">
          <p>{errors.root.message as string}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-error">{errors.email.message as string}</p>
        )}
      </div>

      {/* Username Field (Sign Up only) */}
      {isSignUp && (
        <div className="mt-4">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="username"
            className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
            {...register('username')}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-error">{errors.username.message as string}</p>
          )}
        </div>
      )}

      {/* Name Fields (Sign Up only) */}
      {isSignUp && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* First Name */}
          <div>
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              placeholder="Jane"
              className={`input input-bordered w-full ${errors.first_name ? 'input-error' : ''}`}
              {...register('first_name')}
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-error">{errors.first_name.message as string}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              placeholder="Doe"
              className={`input input-bordered w-full ${errors.last_name ? 'input-error' : ''}`}
              {...register('last_name')}
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-error">{errors.last_name.message as string}</p>
            )}
          </div>
        </div>
      )}

      {/* Password Fields */}
      <div className="mt-4">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="********"
          className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-error">{errors.password.message as string}</p>
        )}
      </div>

      {/* Confirm Password (Sign Up only) */}
      {isSignUp && (
        <div className="mt-4">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="********"
            className={`input input-bordered w-full ${errors.password2 ? 'input-error' : ''}`}
            {...register('password2')}
          />
          {errors.password2 && (
            <p className="mt-1 text-sm text-error">{errors.password2.message as string}</p>
          )}
        </div>
      )}

      {/* Accepts Marketing (Sign Up only) */}
      {isSignUp && (
        <div className="form-control mt-4">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox"
              defaultChecked
              {...register('accepts_marketing')}
            />
            <span className="label-text">I want to receive marketing emails</span>
          </label>
        </div>
      )}

      {/* Terms of Service Acceptance (Sign Up only) */}
      {isSignUp && (
        <div className="form-control mt-4">
          <label className="label cursor-pointer justify-start gap-2">
            <input type="checkbox" className="checkbox" {...register('accepts_terms')} />
            <span className="label-text">
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.accepts_terms && (
            <p className="mt-1 text-sm text-error">{errors.accepts_terms.message as string}</p>
          )}
        </div>
      )}

      {/* Cloudflare Turnstile */}
      <div className="mt-4 flex justify-center">
        <Turnstile
          key={turnstileKey}
          sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
          onVerify={onTurnstileVerify}
          onError={onTurnstileError}
          onExpire={onTurnstileExpire}
          theme="light"
          refreshExpired="auto"
        />
      </div>
      {(errors.cfTurnstileResponse || turnstileError) && (
        <p className="mt-1 text-center text-sm text-error">
          {(errors.cfTurnstileResponse?.message as string) ||
            'Please complete the CAPTCHA verification'}
        </p>
      )}

      {/* Forgot Password Link (Login only) */}
      {isLogin && (
        <div className="mt-2 text-right">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>
      )}

      <button type="submit" className="btn btn-primary mt-6 w-full text-white" disabled={isLoading}>
        {isLoading ? (
          <ClipLoader size={20} color="#ffffff" />
        ) : (
          <>
            {isLogin && 'Login'}
            {isSignUp && 'Create Account'}
          </>
        )}
      </button>

      {/* Form Footer Links */}
      <div className="mt-4 text-center">
        {isLogin && (
          <p>
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        )}
        {isSignUp && (
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
