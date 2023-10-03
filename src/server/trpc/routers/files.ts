import { privateProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { files } from '@/server/db/schema';

export const filesRouter = {
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await files.getUserFiles(userId);
  }),

  getUserFileById: privateProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;

    return await files.getUserFileById(userId, input.id);
  }),

  getUserFileByKey: privateProcedure.input(z.object({ key: z.string() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    const file = await files.getUserFileByKey(userId, input.key);
    if (!file.length) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return file[0];
  }),

  deleteUserFile: privateProcedure.input(z.object({ id: z.number(), key: z.string() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { id } = input;

    const file = await files.getUserFileById(userId, id);

    if (!file.length) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    if (file[0].userId !== userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return await files.deleteFile(id);
  })
};
