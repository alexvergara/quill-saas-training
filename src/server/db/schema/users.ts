import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { eq, relations } from 'drizzle-orm';
import { db } from '../client';

import { filesTable } from './files';

export const usersTable = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  // name: text('name').notNull(),
  // fullName: text('full_name'),
  // phone: varchar('phone', { length: 256 }),
  // image: text('image').notNull(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id').unique(),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end_at'),

  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  files: many(filesTable)
}));

export type User = typeof usersTable.$inferSelect; // return type when queried
export type NewUser = typeof usersTable.$inferInsert; // insert type

export const getAllUsers = async (): Promise<User[]> => {
  return db.select().from(usersTable);
};

export const getUserById = (id: string) => {
  return db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
};

export const insertUser = async (user: NewUser): Promise<User[]> => {
  return db.insert(usersTable).values(user).returning();
};
