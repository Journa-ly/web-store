'use client';

import React from 'react';
import { useAuth } from '../../requests/users';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProfileForm from '../../components/forms/ProfileForm';

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Your Account</h1>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
