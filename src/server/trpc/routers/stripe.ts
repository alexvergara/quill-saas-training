import type { UserWithCurrentSubscription } from '@/server/db/schema';
import type Stripe from 'stripe';

import { stripe, getUserSubscriptionPlan } from '@/lib/stripe';
import { privateProcedure } from '../trpc';
import { getBaseUrl } from '@/lib/utils';
import { TRPCError } from '@trpc/server';
import { getUserById } from '@/server/db/utils';

import { PLAN_DETAILS } from '@/config';
import { z } from 'zod';

export const stripeRouter = {
  createStripeSession: privateProcedure.input(z.object({ planId: z.string() }).optional()).mutation(async ({ input, ctx }) => {
    const planId = input?.planId;
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

    const sessionData = {
      mode: 'subscription',
      cancel_url: billingUrl,
      success_url: billingUrl,
      client_reference_id: publicId,
      locale: 'es', // 'en', // TODO: use global locale
      metadata: { publicId }
    } as Stripe.Checkout.SessionCreateParams;

    if (planId) {
      const planDetails = PLAN_DETAILS[planId as keyof typeof PLAN_DETAILS] as any;
      sessionData.line_items = [{ quantity: 1, price: planDetails.price.priceIds.test }]; // TODO: Use ENV to switch between test and production
      sessionData.metadata = {
        publicId,
        planId: planDetails.planId,
        pages: planDetails.pages,
        size: planDetails.size
      };
    }

    const stripeSession = await stripe.checkout.sessions.create(sessionData);

    return { url: stripeSession.url };
  })
};
