import { pgTable, serial, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { eq, and, relations } from 'drizzle-orm';
import { db } from '../client';

import { usersTable } from './users';
import { messagesTable } from './messages';

export const UploadStatuses = ['PENDING', 'UPLOADED', 'PROCESSING', 'FAILED', 'VECTOR-FAIL'] as const;
export const uploadStatusEnum = pgEnum('upload_status', UploadStatuses);

export const filesTable = pgTable('files', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // .unique() creates conflicts
  userId: text('user_id').references(() => usersTable.id),
  uploadStatus: uploadStatusEnum('upload_status').default(UploadStatuses[0]),
  url: text('url').notNull(), // .unique() creates conflicts
  key: text('key').notNull(), // .unique() creates conflicts

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at') //.defaultNow().notNull()
});

export const filesTableRelations = relations(filesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [filesTable.userId],
    references: [usersTable.id]
  }),
  messages: many(messagesTable)
}));

export type File = typeof filesTable.$inferSelect;
export type NewFile = typeof filesTable.$inferInsert;

/*export const getAllFiles = async (): Promise<File[]> => {
  return db.select().from(filesTable);
};

export const getFileById = (id: number) => {
  return db.select().from(filesTable).where(eq(filesTable.id, id)).limit(1);
};*/

export const getUserFileByKey = (userId: string, key: string) => {
  return db
    .select()
    .from(filesTable)
    .where(and(eq(filesTable.userId, userId), eq(filesTable.key, key)))
    .limit(1);
};

export const getUserFiles = (id: string) => {
  return db.select().from(filesTable).where(eq(filesTable.userId, id));
};

export const getUserFileById = (userId: string, id: number) => {
  return db
    .select()
    .from(filesTable)
    .where(and(eq(filesTable.userId, userId), eq(filesTable.id, id)))
    .limit(1);
};

export const insertFile = async (file: NewFile): Promise<File[]> => {
  // TODO: add userId to this
  return db.insert(filesTable).values(file).returning();
};

export const updateFile = async (id: number, file: NewFile): Promise<File[]> => {
  // TODO: add userId to this and grab the file from DB
  delete file.createdAt;
  delete file.id;
  file.updatedAt = new Date();
  return db.update(filesTable).set(file).where(eq(filesTable.id, id)).returning();
};

export const deleteFile = async (id: number): Promise<File[]> => {
  return db.delete(filesTable).where(eq(filesTable.id, id)).returning();
};
