import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn, constructMetadata } from '@/lib/utils';

import Providers from '@/components/Providers';
import Navbar from '@/components/navs/Navbar';

/*import { appWithTranslation, useTranslation } from 'next-i18next';

const { i18n } = useTranslation();
const { language: currentLanguage } = i18n;
const clerkProps = currentLanguage === 'es' ? { localization: esES } : {};*/

const inter = Inter({ subsets: ['latin'] });

export const metadata = constructMetadata();

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
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
    >
      <html lang="en" className="dark">
        <Providers>
          <body className={cn('min-h-screen font-sans antialiased light:grainy ', inter.className)}>
            <Toaster />
            <Navbar />
            {children}
          </body>
        </Providers>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
