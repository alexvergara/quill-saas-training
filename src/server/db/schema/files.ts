import { pgTable, serial, text, timestamp, integer, decimal, uuid, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { users, messages } from '../schema';

export const uploadStatusEnum = pgEnum('upload_status', ['PENDING', 'UPLOADED', 'PROCESSING', 'FAILED', 'VECTOR_FAIL', 'SUCCESS']);

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  public_id: uuid('public_id').defaultRandom().unique(),
  name: text('name').notNull(), // .unique() creates conflicts

  // TODO: Based on Provider
  url: text('url').notNull(), // .unique() creates conflicts
  key: text('key').notNull(), // .unique() creates conflicts

  retry: integer('retry').default(0).notNull(),
  userId: integer('user_id').notNull(), //.references(() => usersTable.id),
  uploadStatus: uploadStatusEnum('upload_status').default(uploadStatusEnum.enumValues[0]),

  size: decimal('size', { precision: 20, scale: 5 }).default('0.0'),
  pages: integer('pages').default(0),
  score: decimal('score', { precision: 5, scale: 2 }).default('0.0'),
  attempts: integer('attempts').default(0),
  isPublic: boolean('is_public').default(false),
  isReadable: boolean('is_readable').default(false),
  isProcessed: boolean('is_processed').default(false),
  isBlacklisted: boolean('is_blacklisted').default(false),
  metadata: text('metadata'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at') //.defaultNow().notNull()
});

export const filesTableRelations = relations(files, ({ one, many }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id]
  }),
  messages: many(messages)
}));

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
