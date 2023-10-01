import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
//import { db } from '../client';

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  externalId: text("external_id").unique().notNull(),
  // name: text('name').notNull(),
  // fullName: text('full_name'),
  // phone: varchar('phone', { length: 256 }),
  // image: text('image').notNull(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripePriceId: text("stripe_price_id").unique(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof usersTable.$inferSelect; // return type when queried
export type NewUser = typeof usersTable.$inferInsert; // insert type

//...

//const db: NodePgDatabase = drizzle(sql);

//*const result: User[] = await db.select().from(usersTable);

/*export const getAllUsers = async (): Promise<User[]> => {
  return db.select().from(usersTable);
};

export const insertUser = async (user: NewUser): Promise<User[]> => {
  return db.insert(usersTable).values(user).returning();
};*/
