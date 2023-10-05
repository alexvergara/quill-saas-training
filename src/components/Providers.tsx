'use client';

import React from 'react';

//import { ClerkProvider } from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@app/_trpc/client';

/*import { appWithTranslation, useTranslation } from 'next-i18next';

const { i18n } = useTranslation();
const { language: currentLanguage } = i18n;
const clerkProps = currentLanguage === 'es' ? { localization: esES } : {};*/

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME) return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.SERVER_PORT}`;
  return `${process.env.SERVER_HOST ?? 'http://localhost'}:${process.env.SERVER_PORT ?? 3000}`;
}

const Providers = ({ children }: React.PropsWithChildren) => {
  const [queryClient] = React.useState(() => new QueryClient());
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          }
        })
      ]
    })
  );

  return (
    // <ClerkProvider // TODO: Check how to enable it here
    //   // {...clerkProps}
    //   appearance={{
    //     variables: {
    //       /*fontSize: '1.2rem',
    //       colorText: '#124559',
    //       colorPrimary: '#006847',
    //       //fontFamily: inter.fontFamily,
    //       //colorBackground: '#EFF6E0',
    //       borderRadius: '0.25rem'*/
    //     }
    //   }}
    // >
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
    // </ClerkProvider>
  );
};

export default Providers;
