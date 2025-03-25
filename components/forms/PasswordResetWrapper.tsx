'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ResetPasswordForm from './ResetPasswordForm';

interface PasswordResetWrapperProps {
  customerId: string;
  token: string;
}

export default function PasswordResetWrapper({ customerId, token }: PasswordResetWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if customer_id and token are already in the URL query parameters
  const customerIdInUrl = searchParams.get('customer_id');
  const tokenInUrl = searchParams.get('token');

  // If the params aren't already in the URL, add them
  useEffect(() => {
    if (!customerIdInUrl || !tokenInUrl) {
      const params = new URLSearchParams();

      // Only set customer_id, no need for uid
      params.set('customer_id', customerId);
      params.set('token', token);

      // Replace the current URL with one that includes the query parameters
      // This is necessary because ResetPasswordForm looks for these in the URL
      router.replace(`?${params.toString()}`);
    }
  }, [customerId, token, router, customerIdInUrl, tokenInUrl]);

  return <ResetPasswordForm />;
}
