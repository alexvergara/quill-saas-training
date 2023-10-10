'use client';

import React from 'react';

import { useSearchParams } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';

let redirect = false;
const StipeBillingPage = () => {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'Trial';

  const { mutate: createStripeSession, isLoading } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      console.log('STRIP SESSION URL', url);

      window.location.href = url ?? '/billing';
    },
    onError: (error) => {
      console.log('ERROR create Stripe session', error);
    }
  });

  React.useEffect(() => {
    if (!redirect) createStripeSession({ plan });
    redirect = true;
  }, [redirect]);

  return <div>Redirecting...</div>;
};

export default StipeBillingPage;
