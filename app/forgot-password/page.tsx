'use client';

import ForgotPasswordForm from 'components/forms/ForgotPasswordForm';
import { useAuth } from 'requests/users';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col items-center justify-center bg-base-100 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-base-content">Reset Your Password</h2>
        </div>

        <div className="mt-8">
          <ForgotPasswordForm />
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4">
            <Link href="/login" className="text-sm text-base-content/70 hover:text-primary">
              Login
            </Link>
            <span className="text-base-content/30">•</span>
            <Link href="/sign-up" className="text-sm text-base-content/70 hover:text-primary">
              Create Account
            </Link>
            <span className="text-base-content/30">•</span>
            <Link href="/" className="text-sm text-base-content/70 hover:text-primary">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
