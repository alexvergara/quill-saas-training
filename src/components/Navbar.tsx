import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { buttonVariants } from '@/components/ui/button';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowRightIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky w-full h-14 inset-x-0 top-0 z-30 backdrop-blur-lg transition-all border-b bg-white/75 border-gray-200 dark:bg-black/75 dark:border-gray-700">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-14 border-b border-zinc-200 dark:border-slate-700">
          <Link href="/" className="flex z-40 font-semibold">
            <span>quill.</span>
          </Link>

          {/* TODO: add mobile navbar */}

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link href="/pricing" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                Pricing
              </Link>
              <LoginLink className={buttonVariants({ variant: 'ghost', size: 'sm' })}>Sign in</LoginLink>
              <RegisterLink className={buttonVariants({ size: 'sm' })}>
                Get started
                <ArrowRightIcon className="w-5 h-5 ml-1.5" />
              </RegisterLink>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
