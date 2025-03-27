import React from 'react';
import { Metadata } from 'next';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | Journa',
  description: 'Reset your password to access your Journa account'
};

interface PageProps {
  params: Promise<{
    token: string;
    user_id: string;
  }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { token, user_id } = await params;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-base-content">Reset Your Password</h1>
          <p className="mt-2 text-base-content/70">Create a new password for your account</p>
        </div>
        <ResetPasswordForm user_id={user_id} token={token} />
      </div>
    </div>
  );
}
