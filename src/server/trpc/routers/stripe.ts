import { stripe, getUserSubscriptionPlan } from '@/lib/stripe';
import { privateProcedure } from '../trpc';
import { getBaseUrl } from '@/lib/utils';
import { TRPCError } from '@trpc/server';
import { users } from '@/server/db/schema';
import { PLAN_DETAILS } from '@/config';

export const stripeRouter = {
  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in to access this route (stripe.createStripeSession 1).' });
    }

    const dbUser = await users.getUserById(userId);

    if (!dbUser.length) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in to access this route (stripe.createStripeSession 2).' });
    }

    const user = dbUser[0];
    const subscriptionPlan = await getUserSubscriptionPlan(user);
    const billingUrl = getBaseUrl() + '/billing';

    if (subscriptionPlan.isSubscribed && user.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'paypal'],
      success_url: billingUrl,
      cancel_url: billingUrl,
      line_items: Object.values(PLAN_DETAILS).filter((plan) => !!plan.price.amount).map((plan) => ({
        quantity: 1,
        price: plan.price.priceIds.test // TODO: Use ENV to switch between test and production
      })),
      metadata: {
        userId,
      },
    });

    return { url: stripeSession.url };
  }),
};