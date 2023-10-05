import { authMiddleware } from '@clerk/nextjs';

// TODO: Protect api routes ?
const publicRoutes = ['/', '/pricing', '/auth/(.*)', '/api/trpc/(.*)', '/api/(.*)', '/test_test/(.*)']; //, ', '/api/webhooks/(.*)', img/(.*)', 'favicon.ico'],

export default authMiddleware({
  publicRoutes
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
