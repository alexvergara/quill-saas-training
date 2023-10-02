import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { users, files } from '@/server/db/schema';

export const usersRouter = {
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user || !user.id || !user.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const dbUser = await users.getUserById(user.id);

    if (!dbUser.length) {
      await users.insertUser({ id: user.id, email: user.email });
    }

    return { success: true };
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await files.getFilesByUserId(userId);
  }),

  getUserFileById: privateProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;

    return await files.getUserFileById(userId, input.id);
  }),

  deleteUserFile: privateProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { id } = input;

    const file = await files.getFileById(id);

    if (!file.length) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    if (file[0].userId !== userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return await files.deleteFile(id);
  })
};
