import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

import { users } from '@/server/db/schema';

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
  })
};
