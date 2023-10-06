import { pgTable, serial, text, timestamp, integer, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { users, files } from '../schema';

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(), // TODO: make this a UUID
  public_id: uuid('public_id').defaultRandom().unique(),
  message: text('message').notNull(), // .unique() creates conflicts
  fromUser: boolean('from_user').default(false),

  userId: integer('user_id').notNull(), //.references(() => users.id),
  fileId: integer('file_id').notNull(), //.references(() => files.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at') //.defaultNow().notNull()
});

export const messagesTableRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id]
  }),
  file: one(files, {
    fields: [messages.fileId],
    references: [files.id]
  })
}));

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
