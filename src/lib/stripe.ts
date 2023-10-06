import type { UserWithSubscription } from '@/server/db/schema';

import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs';
import { getUserByPublicId } from '@/server/db/utils';

import { PLAN_DETAILS } from '@/config';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2023-08-16', typescript: true });

export async function getUserSubscriptionPlan() {
  const clerkUser = await currentUser();
  const user = (await getUserByPublicId(clerkUser?.id || '', { with: { subscription: true } })) as UserWithSubscription;

  if (!user || !user.subscription) {
    return {
      ...PLAN_DETAILS.Trial,
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null
    };
  }

  const isSubscribed = Boolean(
    user.subscription.priceId &&
      user.subscription.currentPeriodEnd && // 86400000 = 1 day
      user.subscription.currentPeriodEnd.getTime() + 86_400_000 > Date.now() // TODO: Calculate in a better way ?
  );

  const plan = isSubscribed
    ? Object.values(PLAN_DETAILS).find((plan) => plan.price.priceIds.test === user.subscription?.priceId) // TODO: Use ENV to switch between test and production
    : null;

  let isCanceled = false;
  if (isSubscribed && user.subscription.subscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(user.subscription.subscriptionId);
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    stripeSubscriptionId: user.subscription.subscriptionId,
    stripeCurrentPeriodEnd: user.subscription.currentPeriodEnd,
    stripeCustomerId: user.subscription.customerId,
    isSubscribed,
    isCanceled
  };
}
