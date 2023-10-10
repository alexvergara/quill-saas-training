import type { UserWithSubscription } from '@/server/db/schema';

import { stripe, getUserSubscriptionPlan } from '@/lib/stripe';
import { privateProcedure } from '../trpc';
import { getBaseUrl } from '@/lib/utils';
import { TRPCError } from '@trpc/server';
import { getUserById } from '@/server/db/utils';

import { PAYMENT_METHOD_TYPES, PLAN_DETAILS, STRIPE_PLANS } from '@/config';
import { z } from 'zod';

export const stripeRouter = {
  createStripeSession: privateProcedure.input(z.object({ plan: z.string() })).mutation(async ({ input, ctx }) => {
    const { plan } = input;
    const { userId, publicId } = ctx;

    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in to access this route (stripe.createStripeSession 1).' });

    const user = (await getUserById(userId, { with: { subscription: true } })) as UserWithSubscription;

    const subscriptionPlan = await getUserSubscriptionPlan();
    const billingUrl = 'http://' + getBaseUrl() + '/billing';

    if (subscriptionPlan.isSubscribed && user.subscription?.customerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: user.subscription.customerId,
        return_url: billingUrl
      });

      return { url: stripeSession.url };
    }

    const planDetails = PLAN_DETAILS()[plan as keyof typeof PLAN_DETAILS] as any;

    console.log('createStripeSession userId', userId);
    console.log('subscriptionPlan', subscriptionPlan);
    console.log('planDetails', planDetails);
    console.log('billingUrl', billingUrl);
    //console.log('PLAN_DETAILS()', Object.values(PLAN_DETAILS()));

    /*const line_items = STRIPE_PLANS.filter((plan) => !!plan.price.amount).map((plan) => ({
      quantity: 1,
      price: plan.price.priceIds.test // TODO: Use ENV to switch between test and production
    }));*/

    /*console.log(line_items);

    const line_items2 = Object.values(PLAN_DETAILS())
      .filter((plan) => !!plan.price.amount)
      .map((plan) => ({
        quantity: 1,
        price: plan.price.priceIds.test // TODO: Use ENV to switch between test and production
      }));

    console.log(line_items2);*/

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: PAYMENT_METHOD_TYPES,
      success_url: billingUrl,
      cancel_url: billingUrl,
      line_items: Object.values(PLAN_DETAILS())
        .filter((plan) => !!plan.price.amount)
        .map((plan) => ({
          quantity: 1,
          price: plan.price.priceIds.test // TODO: Use ENV to switch between test and production
        })),
      metadata: {
        publicId,
        id: planDetails.id || 'Trial',
        size: planDetails.size || 0,
        pages: planDetails.pages || 0
      }
    });

    console.log('stripeSession');

    return { url: stripeSession.url };
  })
};
