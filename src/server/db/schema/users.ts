import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { files, messages, subscriptions, type Subscription } from '../schema';

export const users = pgTable('users', {
  // TODO: Add serial as id an back to external_id as publicId ??? (like id and nanoId approach)
  id: serial('id').primaryKey(),
  publicId: text('public_id').unique().notNull(),
  email: text('email').notNull(), // .unique() creates conflicts

  /*
  name: text('name').notNull(),
  phone: varchar('phone', { length: 20 }),
  image: text('image').notNull(),
  fullName: text('full_name'),
  */

  // TODO: Use generic payment providers or create a custom table for this

  currentSubscriptionId: integer('current_subscription_id'), // .unique() creates conflicts

  /*
  priceId: text('_price_id'), // .unique() creates conflicts
  customerId: text('_customer_id'), // .unique() creates conflicts
  subscriptionId: text('_subscription_id'), // .unique() creates conflicts
  currentPeriodEnd: timestamp('_current_period_end_at'),
  subscriptionStatus: text('_subscription_status'),
  */

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

export const usersRelations = relations(users, ({ one, many }) => ({
  files: many(files),
  messages: many(messages),
  subscriptions: many(subscriptions),
  subscription: one(subscriptions, {
    fields: [users.currentSubscriptionId],
    references: [subscriptions.id]
  })
}));

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type

export interface UserWithSubscription extends User {
  subscription?: Subscription;
}
