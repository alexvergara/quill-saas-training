import { desc, eq } from 'drizzle-orm';
import { db } from '../client';

import { users, subscriptions, type NewSubscription } from '../schema';
import { PLAN_DETAILS } from '@/config';

export const getUserActiveSubscription = (userId: number, options = {}) => {
  return db.query.subscriptions.findFirst({ where: (messages, { eq, and }) => and(eq(messages.active, true), eq(messages.userId, userId)), orderBy: [desc(subscriptions.id)], ...options });
};

export const getSubscriptionBySubscriptionId = (subscriptionId: string, options = {}) => {
  return db.query.subscriptions.findFirst({ where: (messages, { eq }) => eq(messages.subscriptionId, subscriptionId), ...options });
};

export const updateSubscriptionBySubscriptionId = async (subscriptionId: string, subscription: NewSubscription) => {
  // TODO: Update user subscriptionId ?
  return db.update(subscriptions).set(subscription).where(eq(subscriptions.subscriptionId, subscriptionId)).returning();
};

export const upsertUserSubscription = async (publicId: string, subscription: NewSubscription) => {
  const user = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.publicId, publicId) });

  if (!user) throw new Error('User not found');

  // TODO: Disable previous subscriptions ?
  // TODO: Check if subscription exists... only 1 active per user ?

  const result = await getSubscriptionBySubscriptionId(subscription.subscriptionId || '');
  subscription.userId = user.id; // Enforce userId

  //await db.insert(subscriptions).values(subscription).onConflictDoUpdate({ target: subscription.subscriptionId, set: subscription }).returning();

  // TODO: Upsert ?
  let dbSubscription;
  if (!result) {
    const details = PLAN_DETAILS()[subscription.plan as keyof typeof PLAN_DETAILS] as any;

    subscription.quota = 0;
    subscription.maxSize = details.size;
    subscription.maxPages = details.pages;
    subscription.maxFiles = details.quota;

    dbSubscription = await db.insert(subscriptions).values(subscription).returning();
  } else {
    dbSubscription = await db
      .update(subscriptions)
      .set(subscription)
      .where(eq(subscriptions.subscriptionId, subscription.subscriptionId || ''))
      .returning();
  }

  if (!dbSubscription || !dbSubscription.length) throw new Error('Could not create subscription');

  // TODO: Validate active subscription
  const subscription_id = dbSubscription[0].subscriptionStatus === 'active' ? dbSubscription[0].id : 0;
  await db.update(users).set({ currentSubscriptionId: subscription_id }).where(eq(users.id, user.id));
};
