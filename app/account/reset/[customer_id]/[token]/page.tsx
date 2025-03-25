import React from 'react';
import { Metadata } from 'next';
import PasswordResetWrapper from '@/components/forms/PasswordResetWrapper';

export const metadata: Metadata = {
  title: 'Reset Password | Journa',
  description: 'Reset your password to access your Journa account'
};

interface PageProps {
  params: Promise<{
    customer_id: string;
    token: string;
  }>;
}

export default async function ResetPasswordPage({
  params
}: PageProps) {
  const { customer_id, token } = await params;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-200 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-base-content">Reset Your Password</h1>
          <p className="mt-2 text-base-content/70">Create a new password for your account</p>
        </div>

        {/* Use the wrapper component to handle passing parameters */}
        <PasswordResetWrapper customerId={customer_id} token={token} />
      </div>
    </div>
  );
}
