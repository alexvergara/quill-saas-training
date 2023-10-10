import React from 'react';

import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import { ArrowRightIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

import { users } from '@/server/db/schema';
import { db } from '@/server/db/client';
import { eq } from 'drizzle-orm';

const UpgradeButton = async ({ plan }: { plan: any }) => {
  const clerkUser = await currentUser();

  let user = { id: 0, currentSubscription: {} } as any;
  if (clerkUser) user = await db.query.users.findFirst({ where: eq(users.publicId, clerkUser.id), with: { currentSubscription: true } });

  const isCurrent = user.currentSubscription?.planId === plan.planId;

  let text = 'Sign up';
  let href = '/auth/sign-up?redirect=/pricing';
  let variant;
  if (user.id) {
    text = 'Goto dashboard';
    href = '/dashboard';
    variant = 'ghost' as const;
    if (plan.price) {
      text = isCurrent ? 'Manage subscription' : 'Upgrade now';
      href = isCurrent ? '/billing' : `/billing/stripe?planId=${plan.planId}`;
      variant = undefined;
    }
  }

  return (
    <Link href={href} className={buttonVariants({ variant, className: 'w-full' })}>
      {text}
      <ArrowRightIcon className="w-5 h-5 ml-1.5" />
    </Link>
  );
};

export default UpgradeButton;
