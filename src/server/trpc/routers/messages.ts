import { privateProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { deleteMessage, getUserMessageById, getUserMessages, getUserMessagesByFileId } from '@/server/db/utils';
import { INFINITE_QUERY_LIMIT } from '@/config';
import { Message } from '@/server/db/schema';

export const messagesRouter = {
  getUserMessages: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await getUserMessages(userId);
  }),

  getUserMessageById: privateProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;

    return await getUserMessageById(userId, input.id);
  }),

  getUserMessagesByFileId: privateProcedure.input(z.object({ fileId: z.number(), limit: z.number().min(1).max(100).default(INFINITE_QUERY_LIMIT), cursor: z.number().optional() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { fileId, limit, cursor } = input;

    const chatMessages = await getUserMessagesByFileId(userId, fileId, limit, cursor);
    if (!chatMessages.length) throw new TRPCError({ code: 'NOT_FOUND' });

    let nextCursor;
    if (chatMessages.length > limit) {
      const lastMessage = chatMessages.pop();
      nextCursor = lastMessage!.id;
    }

    return { messages: chatMessages, nextCursor } as { messages: Message[]; nextCursor?: number };
  }),

  deleteUserMessage: privateProcedure.input(z.object({ id: z.number(), key: z.string() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { id } = input;

    const message = await getUserMessageById(userId, id);

    if (!message) throw new TRPCError({ code: 'NOT_FOUND' });

    if (message.userId !== userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: `You can\'t remove this message ([user: ${userId}] messages.deleteUserMessage: ${id}).` });

    return await deleteMessage(id);
  })
};
