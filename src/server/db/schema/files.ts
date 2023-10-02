import { pgTable, serial, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { eq, and, relations } from 'drizzle-orm';
import { db } from '../client';

import { usersTable } from './users';

export const UploadStatuses = ['PENDING', 'UPLOADED', 'PROCESSING', 'FAILED'] as const;
export const uploadStatusEnum = pgEnum('upload_status', UploadStatuses);

export const filesTable = pgTable('files', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  userId: text('user_id').references(() => usersTable.id),
  uploadStatus: uploadStatusEnum('upload_status').default(UploadStatuses[0]),
  url: text('url').unique().notNull(),
  key: text('key').unique().notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at') //.defaultNow().notNull()
});

export const filesTableRelations = relations(filesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [filesTable.userId],
    references: [usersTable.id]
  })
}));

export type File = typeof filesTable.$inferSelect;
export type NewFile = typeof filesTable.$inferInsert;

export const getAllFiles = async (): Promise<File[]> => {
  return db.select().from(filesTable);
};

export const getFileById = (id: number) => {
  return db.select().from(filesTable).where(eq(filesTable.id, id)).limit(1);
};

export const getFilesByUserId = (id: string) => {
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
  return db.insert(filesTable).values(file).returning();
};

export const deleteFile = async (id: number): Promise<File[]> => {
  return db.delete(filesTable).where(eq(filesTable.id, id)).returning();
};
