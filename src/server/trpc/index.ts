import { router } from './trpc';
import { usersRouter } from './routers/users';
import { filesRouter } from './routers/files';
import { stripeRouter } from './routers/stripe';
import { messagesRouter } from './routers/messages';

export const appRouter = router({
  ...usersRouter,
  ...filesRouter,
  ...stripeRouter,
  ...messagesRouter
});

export type AppRouter = typeof appRouter;
