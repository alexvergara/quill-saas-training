import { privateProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { messages } from '@/server/db/schema';
import { INFINITE_QUERY_LIMIT } from '@/config';

export const messagesRouter = {
  getUserMessages: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await messages.getUserMessages(userId);
  }),

  getUserMessageById: privateProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;

    return await messages.getUserMessageById(userId, input.id);
  }),

  getUserMessagesByFileId: privateProcedure.input(z.object({ fileId: z.number(), limit: z.number().min(1).max(100).default(INFINITE_QUERY_LIMIT), cursor: z.number().optional() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { fileId, limit, cursor } = input;

    console.log('getUserMessagesByFileId', { userId, fileId, limit, cursor });

    const chatMessages = await messages.getUserMessagesByFileId(userId, fileId, limit, cursor);
    if (!chatMessages.length) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    let nextCursor;
    if (chatMessages.length > limit) {
      nextCursor = chatMessages.pop()?.id;
      chatMessages.pop();
    }

    return { messages: chatMessages, nextCursor };
  }),

  deleteUserMessage: privateProcedure.input(z.object({ id: z.number(), key: z.string() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { id } = input;

    const message = await messages.getUserMessageById(userId, id);

    if (!message.length) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    if (message[0].userId !== userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return await messages.deleteMessage(id);
  })
};
