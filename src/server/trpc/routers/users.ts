//import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { currentUser } from '@clerk/nextjs';
import { publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

import { getUserByPublicId, insertUser } from '@/server/db/utils';

export const usersRouter = {
  authCallback: publicProcedure.query(async () => {
    /*const { getUser } = getKindeServerSession();
    const user = getUser();*/
    const clerkUser = await currentUser();

    if (!clerkUser) throw new TRPCError({ code: 'UNAUTHORIZED', message: `You must be logged in to access this route (users.authCallback).` });

    const user = await getUserByPublicId(clerkUser?.id || '');
    if (!user) {
      await insertUser({ public_id: clerkUser.id, email: clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)?.emailAddress || '' });
    }

    return { success: true };
  })
};
