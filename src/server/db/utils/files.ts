import { eq } from 'drizzle-orm';
import { db } from '../client';

import { files, messages, type File, type NewFile } from '../schema';

export const getUserFiles = (userId: number, options = {}) => {
  return db.query.files.findMany({ where: (files, { eq }) => eq(files.userId, userId), ...options });
};

export const getUserFileById = (userId: number, fileId: number, options = {}) => {
  return db.query.files.findFirst({ where: (files, { and, eq }) => and(eq(files.userId, userId), eq(files.id, fileId)), ...options });
};

export const getUserFileByKey = (userId: number, key: string, options = {}) => {
  return db.query.files.findFirst({ where: (files, { and, eq }) => and(eq(files.userId, userId), eq(files.key, key)), ...options });
};

export const getUserFileByPublicId = (userId: number, public_id: string, options = {}) => {
  return db.query.files.findFirst({ where: (files, { and, eq }) => and(eq(files.userId, userId), eq(files.public_id, public_id)), ...options });
};

// TODO: add userId to this
export const insertFile = async (file: NewFile): Promise<File[]> => {
  return db.insert(files).values(file).returning();
};

// TODO: add userId to this and grab the file from DB
export const updateFile = async (id: number, file: NewFile): Promise<File[]> => {
  delete file.id;
  delete file.createdAt;
  file.updatedAt = new Date();
  return db.update(files).set(file).where(eq(files.id, id)).returning();
};

export const deleteFile = async (id: number): Promise<File[]> => {
  await db.delete(messages).where(eq(messages.fileId, id)); // TODO: Cascade ?

  return db.delete(files).where(eq(files.id, id)).returning();
};
