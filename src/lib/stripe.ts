import type { User } from '@/server/db/schema/users'

import Stripe from 'stripe'
import { currentUser } from '@clerk/nextjs';
import { users } from '@/server/db/schema';

import { PLAN_DETAILS } from '@/config'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2023-08-16', typescript: true })

export async function getUserSubscriptionPlan(user?: User | null) {
  let _user = user
  if (!user) {
    const clerkUser = await currentUser();
    const dbUser = await users.getUserById(clerkUser?.id || '');
    _user = dbUser[0];
  }

  if (!_user?.id) {
    return {
      ...PLAN_DETAILS.Trial,
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    }
  }

  const isSubscribed = Boolean(
    _user.stripePriceId && _user.stripeCurrentPeriodEnd && // 86400000 = 1 day
      _user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now() // TODO: Calculate in a better way ?
  )

  const plan = isSubscribed
    ? Object.values(PLAN_DETAILS).find((plan) => plan.price.priceIds.test === _user?.stripePriceId) // TODO: Use ENV to switch between test and production
    : null

  let isCanceled = false
  if (isSubscribed && _user.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(_user.stripeSubscriptionId)
    isCanceled = stripePlan.cancel_at_period_end
  }

  return {
    ...plan,
    stripeSubscriptionId: _user.stripeSubscriptionId,
    stripeCurrentPeriodEnd: _user.stripeCurrentPeriodEnd,
    stripeCustomerId: _user.stripeCustomerId,
    isSubscribed,
    isCanceled,
  }
}