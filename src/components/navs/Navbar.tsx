import type { User } from '@clerk/nextjs/api';
import Link from 'next/link';
//import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { currentUser, UserButton, SignInButton, SignUpButton, SignOutButton } from '@clerk/nextjs';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import MaxWidthWrapper from '../MaxWidthWrapper';
import MobileNavbar from './MobileNavbar';
import UserAccountNav from './UserAccountNav';

const Navbar = async () => {
  const user: User | null = await currentUser();

  return (
    <nav className="sticky w-full h-14 inset-x-0 top-0 z-30 backdrop-blur-lg transition-all border-b bg-white/75 border-gray-200 dark:bg-black/75 dark:border-gray-700">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-14 border-b border-zinc-200 dark:border-slate-700">
          <Link href="/" className="flex z-40 font-semibold">
            <span>quill.</span>
          </Link>

          {/* TODO: add mobile navbar */}

          <MobileNavbar isGuest={!user} />

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <Link href="/pricing" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                  Pricing
                </Link>
                {/* <LoginLink className={buttonVariants({ variant: 'ghost', size: 'sm' })}>Sign in</LoginLink>
                <RegisterLink className={buttonVariants({ size: 'sm' })}>
                  Get started
                  <ArrowRightIcon className="w-5 h-5 ml-1.5" />
                </RegisterLink> */}

                <SignInButton mode="modal">
                  <Button className={buttonVariants({ variant: 'ghost', size: 'sm' })}>Sign in</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className={buttonVariants({ size: 'sm' })}>
                    Get started
                    <ArrowRightIcon className="w-5 h-5 ml-1.5" />
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Link href="/dashboard" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                  Dashboard
                </Link>
                {/* <SignOutButton>
                  <Button className={buttonVariants({ variant: 'ghost', size: 'sm' })}>Sign out</Button>
                </SignOutButton> */}

                <UserAccountNav user={user} />

                <UserButton afterSignOutUrl="/" />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
