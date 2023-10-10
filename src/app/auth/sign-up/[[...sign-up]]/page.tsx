'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <div className="flex items-center justify-center w-full h-screen bg-white dark:bg-black">
        <SignUp redirectUrl={redirect} />
      </div>
    </MaxWidthWrapper>
  );
}
