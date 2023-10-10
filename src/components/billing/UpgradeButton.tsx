import React from 'react';

import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import { ArrowRightIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

const UpgradeButton = async ({ plan }: { plan: any }) => {
  const user = await currentUser();

  let text = 'Sign up';
  let href = '/auth/sign-up';
  let variant;
  if (user) {
    text = 'Goto dashboard';
    href = '/dashboard';
    variant = 'ghost' as const;
    if (plan.price) {
      text = 'Upgrade now';
      href = `/billing/stripe?plan=${plan.id}`;
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
