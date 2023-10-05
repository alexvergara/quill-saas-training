//import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import type { User } from '@clerk/nextjs/api';
import { currentUser } from '@clerk/nextjs';
import { TRPCError, initTRPC } from '@trpc/server';

const t = initTRPC.create();

const isAuth = t.middleware(async (opts) => {
  /*const { getUser } = getKindeServerSession();
  const user = getUser();*/
  const user: User | null = await currentUser();

  if (!user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({ ctx: { user, userId: user.id } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
