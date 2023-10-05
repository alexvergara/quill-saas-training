'use client';

import React from 'react'

import { trpc } from '@/app/_trpc/client';

const StipeBillingPage = () => {
  const { mutate: createStripeSession, isLoading } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? '/billing';
    }
  });
  

  createStripeSession();

  return (
    <div>Redirecting...</div>
  )
}

export default StipeBillingPage