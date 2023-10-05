//import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import type { User } from '@clerk/nextjs/api';
import { currentUser } from '@clerk/nextjs';
import { publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

import { users } from '@/server/db/schema';

export const usersRouter = {
  authCallback: publicProcedure.query(async () => {
    /*const { getUser } = getKindeServerSession();
    const user = getUser();*/
    const user: User | null = await currentUser();

    //if (!user || !user.id || !user.email) {
    if (!user || !user.id || !user.emailAddresses.length) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const dbUser = await users.getUserById(user.id);

    if (!dbUser.length) {
      //await users.insertUser({ id: user.id, email: user.email });
      await users.insertUser({ id: user.id, email: user.emailAddresses[0].emailAddress });
    }

    return { success: true };
  })
};
