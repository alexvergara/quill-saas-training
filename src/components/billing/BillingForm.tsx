'use client';

import React from 'react';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { useToast } from '@/components/ui/use-toast';
import { trpc } from '@/app/_trpc/client';

import MaxWidthWrapper from '../MaxWidthWrapper';
import { Button } from '../ui/button';
import { Loader2Icon } from 'lucide-react';
import format from 'date-fns/format';

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { toast } = useToast();

  const { mutate: createStripeSession, isLoading } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
      else {
        toast({
          title: 'There was a problem...',
          description: 'Please try again later.',
          variant: 'destructive'
        });
      }
    }
  });

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently subscribed: <strong>{subscriptionPlan.name}</strong>.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit">
              {isLoading ? <Loader2Icon className="animate-spin w-4 h-4 mr-4" /> : null}
              {subscriptionPlan.isSubscribed ? 'Manage Subscription' : 'Upgrade Now'}
            </Button>

            {subscriptionPlan.isSubscribed ? (
              <p className="rounded-full text-xs font-medium">
                {subscriptionPlan.isCanceled ? 'Your plan will be canceled on ' : 'Your plan renews on '}
                <b>{format(subscriptionPlan.stripeCurrentPeriodEnd!, 'MMM dd yyyy')}</b> {/* 'yyyy-MM-dd')} {/* // TODO: Use locale format */}
              </p>
            ) : (
              'Upgrade Now'
            )}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
