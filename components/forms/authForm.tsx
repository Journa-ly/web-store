'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthFormType } from 'types/authForm';
import { z } from 'zod';
import { useAuth } from '../../requests/users';
import { FieldErrorsImpl } from 'react-hook-form';

// Update the schemas to match backend expectations
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Your password must have at least 6 characters')
});

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Your password must have at least 6 characters'),
  password2: z.string().min(6, 'Your password must have at least 6 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  accepts_marketing: z.boolean().optional()
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
  const { login, register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : signUpSchema) as any
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (values) => {
    try {
      if (isLogin) {
        const result = await login(values as LoginFormValues);
        if (result.success) {
          router.push('/designs/trending');
        } else {
          setError('root', {
            type: 'manual',
            message: 'Invalid email or password'
          });
        }
      } else {
        const result = await registerUser(values as SignUpFormValues);
        if (result.success) {
          router.push('/designs/trending');
        } else {
          // Handle specific validation errors from the backend
          const error = result.error as any;
          if (error.response?.data) {
            Object.keys(error.response.data).forEach((key) => {
              setError(key as any, {
                type: 'manual',
                message: error.response.data[key][0]
              });
            });
          } else {
            setError('root', {
              type: 'manual',
              message: 'Registration failed. Please try again.'
            });
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error', error);
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred'
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full rounded-lg bg-base-200 p-6 shadow-lg"
    >
      <h2 className="mb-6 text-center text-2xl font-bold">
        {isLogin ? 'Login to Your Account' : 'Create an Account'}
      </h2>

      {/* Display root errors */}
      {errors.root && (
        <div className="alert alert-error mb-4">
          <p>{errors.root.message}</p>
        </div>
      )}

      {/* Email Field (for both Login and Sign Up) */}
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
          <p className="mt-1 text-sm text-error">{errors.email.message as string}</p>
        )}
      </div>

      {/* Name Fields (Sign Up only) */}
      {!isLogin && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* First Name */}
          <div>
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              placeholder="Jane"
              className="input input-bordered w-full"
              {...register('first_name')}
            />
            {!isLogin && errors.first_name && (
              <p className="mt-1 text-sm text-error">{errors.first_name.message}</p>
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
              {...register('last_name')}
            />
            {!isLogin && errors.last_name && (
              <p className="mt-1 text-sm text-error">{errors.last_name.message}</p>
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
          className="input input-bordered w-full"
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-error">{errors.password.message as string}</p>
        )}
      </div>

      {/* Confirm Password (Sign Up only) */}
      {!isLogin && (
        <div className="mt-4">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="********"
            className="input input-bordered w-full"
            {...register('password2')}
          />
          {errors.password2 && (
            <p className="mt-1 text-sm text-error">{errors.password2.message as string}</p>
          )}
        </div>
      )}

      {/* Accepts Marketing (Sign Up only) */}
      {!isLogin && (
        <div className="form-control mt-4">
          <label className="label cursor-pointer justify-start gap-2">
            <input type="checkbox" className="checkbox" {...register('accepts_marketing')} />
            <span className="label-text">I want to receive marketing emails</span>
          </label>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary mt-6 w-full transition-transform hover:scale-[1.02]"
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;
