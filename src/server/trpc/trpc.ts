//import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { currentUser } from '@clerk/nextjs';
import { TRPCError, initTRPC } from '@trpc/server';
import { getUserByPublicId } from '../db/utils';

const t = initTRPC.create();

const isAuth = t.middleware(async (opts) => {
  /*const { getUser } = getKindeServerSession();
  const user = getUser();*/
  const clerkUser = await currentUser();
  const user = await getUserByPublicId(clerkUser?.id || '');

  if (!clerkUser || !user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in to access this route (isAuthMiddleware).' });

  return opts.next({ ctx: { userId: user.id, publicId: clerkUser.id, clerkUser, user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
