import { router } from './trpc';
import { usersRouter } from './routers/users';
import { filesRouter } from './routers/files';
import { messagesRouter } from './routers/messages';

export const appRouter = router({
  ...usersRouter,
  ...filesRouter,
  ...messagesRouter
});

export type AppRouter = typeof appRouter;
