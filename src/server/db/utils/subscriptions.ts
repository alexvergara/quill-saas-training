import { users, subscriptions, type NewSubscription } from '../schema';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../client';

import { PLAN_DETAILS } from '@/config';

export const getUserActiveSubscription = (userId: number, options = {}) => {
  return db.query.subscriptions.findFirst({ where: (messages, { eq, and }) => and(eq(messages.active, true), eq(messages.userId, userId)), orderBy: [desc(subscriptions.id)], ...options });
};

export const getSubscriptionBySubscriptionId = (subscriptionId: string, options = {}) => {
  return db.query.subscriptions.findFirst({ where: (messages, { eq }) => eq(messages.subscriptionId, subscriptionId), ...options });
};

export const updateSubscriptionBySubscriptionId = async (subscriptionId: string, subscription: NewSubscription) => {
  const dbSubscriptions = await db.update(subscriptions).set(subscription).where(eq(subscriptions.subscriptionId, subscriptionId)).returning();

  await updateUserCurrentSubscription(dbSubscriptions[0]);

  return dbSubscriptions;
};

export const upsertUserSubscription = async (publicId: string, subscription: NewSubscription) => {
  const user = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.publicId, publicId) });

  if (!user) throw new Error('User not found');

  const result = await getSubscriptionBySubscriptionId(subscription.subscriptionId || '');
  subscription.userId = user.id; // Enforce userId

  // TODO: Upsert ?
  //await db.insert(subscriptions).values(subscription).onConflictDoUpdate({ target: subscription.subscriptionId, set: subscription }).returning();
  let dbSubscription;
  if (!result) {
    const details = PLAN_DETAILS[subscription.planId as keyof typeof PLAN_DETAILS] as any;

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

  await updateUserCurrentSubscription(dbSubscription[0]);

  return dbSubscription[0];
};

export const updateUserCurrentSubscription = async (subscription: NewSubscription) => {
  if (subscription) {
    const currentSubscriptionId = subscription.subscriptionStatus === 'active' ? subscription.id : null;
    return await db
      .update(users)
      .set({ currentSubscriptionId: currentSubscriptionId })
      .where(and(eq(users.id, subscription.userId), eq(users.currentSubscriptionId, subscription.id!)));
  }
  return false;
};
