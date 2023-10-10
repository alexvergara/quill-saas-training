//import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { currentUser } from '@clerk/nextjs';
import { publicProcedure, privateProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

import { getUserById, getUserByPublicId, insertUser } from '@/server/db/utils';
import { getUserSubscriptionPlan } from '@/lib/stripe';
//import { z } from 'zod';

export const usersRouter = {
  authCallback: publicProcedure.query(async () => {
    //console.log('AUTH CALLBACK------------------');
    /*const { getUser } = getKindeServerSession();
    const user = getUser();*/
    const clerkUser = await currentUser();

    //console.log('CLERK USER------------------', clerkUser);

    if (!clerkUser) throw new TRPCError({ code: 'UNAUTHORIZED', message: `You must be logged in to access this route (users.authCallback).` });

    const user = await getUserByPublicId(clerkUser?.id || '');

    //console.log('USER------------------', user);

    if (!user) await insertUser({ publicId: clerkUser.id, email: clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)?.emailAddress || '' });

    return { success: true };
  }),

  /*getCurrentUser: privateProcedure.input(z.object({ options: z.any() }).optional()).query(async ({ ctx, input }) => {
    const { userId } = ctx;

    return await getUserById(userId, input);
  })*/

  getUserCurrentSubscriptionPlan: privateProcedure.query(async () => {
    return getUserSubscriptionPlan();
  })
};
