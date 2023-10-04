import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { eq, and, relations } from 'drizzle-orm';
import { db } from '../client';

import { usersTable } from './users';
import { filesTable } from './files';

export const messagesTable = pgTable('messages', {
  id: serial('id').primaryKey(), // TODO: make this a UUID
  text: text('text').notNull(), // .unique() creates conflicts
  isUserMessage: boolean('is_user_message').default(false),

  userId: text('user_id').references(() => usersTable.id),
  fileId: integer('file_id').references(() => filesTable.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at') //.defaultNow().notNull()
});

export const messagesTableRelations = relations(messagesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [messagesTable.userId],
    references: [usersTable.id]
  }),
  file: one(filesTable, {
    fields: [messagesTable.fileId],
    references: [filesTable.id]
  })
}));

export type Message = typeof messagesTable.$inferSelect;
export type NewMessage = typeof messagesTable.$inferInsert;

export const getUserMessages = (id: string) => {
  return db.select().from(messagesTable).where(eq(messagesTable.userId, id));
};

export const getUserMessageById = (userId: string, id: number) => {
  return db
    .select()
    .from(messagesTable)
    .where(and(eq(messagesTable.userId, userId), eq(messagesTable.id, id)))
    .limit(1);
};

export const insertMessage = async (message: NewMessage): Promise<Message[]> => {
  // TODO: add userId to this
  return db.insert(messagesTable).values(message).returning();
};

export const updateMessage = async (id: number, message: NewMessage): Promise<Message[]> => {
  // TODO: add userId to this and grab the message from DB
  delete message.createdAt;
  delete message.id;
  message.updatedAt = new Date();
  return db.update(messagesTable).set(message).where(eq(messagesTable.id, id)).returning();
};

export const deleteMessage = async (id: number): Promise<Message[]> => {
  return db.delete(messagesTable).where(eq(messagesTable.id, id)).returning();
};
