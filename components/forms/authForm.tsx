"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthFormType } from 'types/authForm';
import { z } from 'zod';

// Example: you can define multiple schemas for login, signup, etc.
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Your password must have at least 6 characters'),
});

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Your password must have at least 6 characters'),
  acceptsMarketing: z.boolean().optional(),
});

// Reusable form props
type LoginFormValues = z.infer<typeof loginSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;


interface AuthFormProps {
  formType: AuthFormType;
}

const AuthForm: React.FC<AuthFormProps> = ({ formType }) => {
  const isLogin = formType === AuthFormType.LOGIN;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues | SignUpFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : signUpSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues | SignUpFormValues> = async (values) => {
    try {
      if (isLogin) {
        // Login
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Login error', data);
          // Ideally show user-friendly error here
        } else {
          console.log('Login success', data);
          router.push('/designs/trending');
        }
      } else {
        // Sign Up
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Signup error', data);
          // Ideally show user-friendly error here
        } else {
          console.log('Signup success', data);
          router.push('/designs/trending');
        }
      }
    } catch (error) {
      console.error('Unexpected error', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto bg-base-200 p-6 shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? 'Login to Your Account' : 'Create an Account'}
      </h2>

      {/* Name Fields (Sign Up only) */}
      {!isLogin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              placeholder="Jane"
              className="input input-bordered w-full"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-error text-sm mt-1">{errors.firstName.message}</p>
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
              className="input input-bordered w-full"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-error text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Email Field */}
      <div className="mt-4">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="example@example.com"
          className="input input-bordered w-full"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-error text-sm mt-1">{errors.email.message as string}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="mt-4">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="********"
          className="input input-bordered w-full"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-error text-sm mt-1">{errors.password.message as string}</p>
        )}
      </div>

      {/* Accepts Marketing (Sign Up only) */}
      {!isLogin && (
        <div className="mt-4 form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox"
              {...register('acceptsMarketing')}
            />
            <span className="label-text">
              I want to receive marketing emails
            </span>
          </label>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary w-full mt-6 hover:scale-[1.02] transition-transform"
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;
