'use client';

import { useState } from 'react';
import { useAuth } from 'requests/users';
import ProfileForm from '../../components/forms/ProfileForm';
import PasswordResetButton from '../../components/buttons/PasswordResetButton';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <ProfileForm user={user} />
        <div className="mt-6 border-t pt-6">
          <PasswordResetButton email={user?.email} />
        </div>
      </div>
    </div>
  );
}
