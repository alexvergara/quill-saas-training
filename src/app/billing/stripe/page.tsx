'use client';

import React from 'react';

import { useSearchParams } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';

let redirect = false;
const StipeBillingPage = () => {
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');

  const { mutate: createStripeSession, isLoading } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      //console.log('STRIPE SESSION URL', url);

      window.location.href = url ?? '/billing';
    },
    onError: (error) => {
      console.log('ERROR create Stripe session', error);
    }
  });

  React.useEffect(() => {
    if (!redirect && planId) createStripeSession({ planId });
    redirect = true;
  }, [redirect, planId]);

  return <div>Redirecting...</div>;
};

export default StipeBillingPage;
