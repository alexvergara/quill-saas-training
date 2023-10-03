import { router } from './trpc';
import { usersRouter } from './routers/users';
import { filesRouter } from './routers/files';

export const appRouter = router({
  ...usersRouter,
  ...filesRouter
});

export type AppRouter = typeof appRouter;
