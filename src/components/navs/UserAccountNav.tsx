import React from 'react';

import { getUserSubscriptionPlan } from '@/lib/stripe';
import { SignOutButton } from '@clerk/nextjs';
import { User, redirect } from '@clerk/nextjs/server';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GemIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui-custom/Icons';
import Image from 'next/image';
import Link from 'next/link';

interface UserAccountNavProps {
  user: User;
}

const UserAccountNav = async ({ user }: UserAccountNavProps) => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  // TODO: Logic for subscription plans (Show Upgrade only on upgradable plans)
  const isSubscribed = subscriptionPlan?.isSubscribed && subscriptionPlan.name !== 'Trail';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="rounded-full h-8 w-8 aspect-square bg-slate-400 dark:bg-gray-600">
          <Avatar className="relative h-8 w-8">
            {/* {user.hasImage ? (
              <div className='relative aspect-square h-full w-full'>
                <Image src={user.imageUrl} alt="Image profile" layout='fill' className='rounded-full' referrerPolicy='no-referrer' />
              </div>
            ) : ( */}
            <AvatarFallback>
              <>
                <span className="sr-only">{[user.firstName, user.lastName || ''].join(' ')}</span>
                <Icons.user className="h-4 w-4 text-zinc-900 dark:text-slate-50" />
              </>
            </AvatarFallback>
            {/* )} */}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white dark:bg-slate-800" align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="text-sm font-medium text-black dark:text-white">{[user.firstName, user.lastName || ''].join(' ')}</p>
            <p className="w-[200px] truncate text-xs text-zinc-700 dark:text-slate-200">{user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-zinc-700 dark:bg-slate-500" />

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center justify-start gap-2 p-2">
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {/* {isSubscribed ? (
            <Link href="/billing" className="flex items-center justify-start gap-2 p-2">
              Manage subscription ({subscriptionPlan.name})
            </Link>
          ) : ( */}
          <Link href="/pricing" className="flex items-center justify-start gap-2 p-2">
            Upgrade <GemIcon className="h-4 w-4 ml-1.5 text-blue-600 dark:text-blue-400" />
          </Link>
          {/* )} */}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-700 dark:bg-slate-500" />

        <DropdownMenuItem asChild>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
