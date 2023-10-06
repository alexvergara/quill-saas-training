import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../client';

import { messages, type Message, type NewMessage } from '../schema';
import { INFINITE_QUERY_LIMIT } from '@/config';

export const getUserMessages = (userId: number, options = {}) => {
  return db.query.messages.findMany({ where: (messages, { eq }) => eq(messages.userId, userId), ...options });
};

export const getUserMessageById = (userId: number, messageId: number, options = {}) => {
  return db.query.messages.findFirst({ where: (messages, { and, eq }) => and(eq(messages.userId, userId), eq(messages.id, messageId)), ...options });
};

export const getUserMessagesByFileId = (userId: number, fileId: number, limit = INFINITE_QUERY_LIMIT, cursor?: number) => {
  //return db.execute(sql`select * from messages where user_id = ${userId} and file_id = ${fileId} ${cursor ? 'and id <= ' + cursor : ''} order by id desc limit ${limit + 1}`);

  return db.query.messages.findMany({
    where: (messages, { and, eq, lte }) => and(eq(messages.userId, userId), eq(messages.fileId, fileId), lte(messages.id, cursor || 2147483647)), // sql<number>`max(${messagesTable.id})`))) // TODO: Find a better way
    orderBy: [desc(messages.createdAt)],
    limit: limit + 1
  });
};

// TODO: add userId to this
export const insertMessage = async (message: NewMessage): Promise<Message[]> => {
  return db.insert(messages).values(message).returning();
};

// TODO: add userId to this and grab the message from DB
export const updateMessage = async (messageId: number, message: NewMessage): Promise<Message[]> => {
  delete message.id;
  delete message.createdAt;
  message.updatedAt = new Date();
  return db.update(messages).set(message).where(eq(messages.id, messageId)).returning();
};

export const deleteMessage = async (messageId: number): Promise<Message[]> => {
  return db.delete(messages).where(eq(messages.id, messageId)).returning();
};
