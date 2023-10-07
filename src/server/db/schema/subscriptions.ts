import { pgTable, serial, text, timestamp, uuid, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { users } from '../schema';

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  publicId: uuid('public_id').defaultRandom().unique().notNull(),
  userId: integer('user_id').notNull(), //.references(() => users.id),
  active: boolean('active').default(true),

  priceId: text('price_id'), // .unique() creates conflicts
  customerId: text('customer_id'), // .unique() creates conflicts
  subscriptionId: text('subscription_id'), // .unique() creates conflicts
  currentPeriodEnd: timestamp('current_period_end_at'),
  subscriptionStatus: text('subscription_status'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id]
  })
}));

export type Subscription = typeof subscriptions.$inferSelect; // return type when queried
export type NewSubscription = typeof subscriptions.$inferInsert; // insert type
