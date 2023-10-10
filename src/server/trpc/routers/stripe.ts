import type { UserWithCurrentSubscription } from '@/server/db/schema';

import { stripe, getUserSubscriptionPlan } from '@/lib/stripe';
import { privateProcedure } from '../trpc';
import { getBaseUrl } from '@/lib/utils';
import { TRPCError } from '@trpc/server';
import { getUserById } from '@/server/db/utils';

import { PAYMENT_METHOD_TYPES, PLAN_DETAILS } from '@/config';
import { z } from 'zod';

export const stripeRouter = {
  createStripeSession: privateProcedure.input(z.object({ plan: z.string() })).mutation(async ({ input, ctx }) => {
    const { plan } = input;
    const { userId, publicId } = ctx;

    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in to access this route (stripe.createStripeSession 1).' });

    const user = (await getUserById(userId, { with: { currentSubscription: true } })) as UserWithCurrentSubscription;

    const subscriptionPlan = await getUserSubscriptionPlan();
    const billingUrl = getBaseUrl() + '/billing';

    if (subscriptionPlan.isSubscribed && user.currentSubscription?.customerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: user.currentSubscription.customerId,
        return_url: billingUrl
      });

      return { url: stripeSession.url };
    }

    const planDetails = PLAN_DETAILS()[plan as keyof typeof PLAN_DETAILS] as any;

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      //payment_method_types: PAYMENT_METHOD_TYPES, // Does not work with subscription or payment modes... only required on setup mode
      success_url: billingUrl,
      cancel_url: billingUrl,
      /*line_items: Object.values(PLAN_DETAILS())
        .filter((plan) => !!plan.price.amount)
        .map((plan) => ({
          quantity: 1,
          price: plan.price.priceIds.test // TODO: Use ENV to switch between test and production
        })),*/
      line_items: [
        {
          quantity: 1,
          price: planDetails.price.priceIds.test // TODO: Use ENV to switch between test and production
        }
      ],
      client_reference_id: publicId,
      // currency: 'usd', || 'cop'
      locale: 'es', // 'en',
      metadata: {
        publicId,
        plan_id: planDetails.id || 'Trial',
        pages: planDetails.pages || 0,
        size: planDetails.size || 0
      }
    });

    return { url: stripeSession.url };
  })
};
