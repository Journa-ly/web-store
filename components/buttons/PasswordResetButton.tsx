'use client';

import { useState } from 'react';
import { userRequests } from 'requests/users';

interface PasswordResetButtonProps {
  email: string | undefined;
}

export default function PasswordResetButton({ email }: PasswordResetButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handlePasswordReset = async () => {
    if (!email) return;

    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      await userRequests.initiatePasswordReset({ email });
      setMessage({
        type: 'success',
        content: 'Password reset email has been sent!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        content: 'Failed to send password reset email.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePasswordReset}
        disabled={isSubmitting}
        className="flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Reset Password'}
      </button>

      {message.content && (
        <div
          className={`rounded p-3 ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}
        >
          {message.content}
        </div>
      )}
    </div>
  );
}
