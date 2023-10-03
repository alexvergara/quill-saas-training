import React from 'react';

import { ChevronLeftIcon, Loader2Icon, XCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

// TODO: Improve it... make it simple

const ChatStatus = ({ status }: { status: string }) => {
  let chatStatusProps = { title: 'Loading...', icon: <Loader2Icon className="h-8 w-8 text-blu-500 animate-spin" />, message: <p className="text-zinc-500 text-sm">We&apos;re preparing your PDF.</p> };
  switch (status) {
    case 'PROCESSING':
      chatStatusProps.title = 'Processing...';
      chatStatusProps.message = <p className="text-zinc-500 text-sm">This won&apos;t take long.</p>;
      break;
    case 'FAILED':
    case 'VECTOR-FAIL':
      chatStatusProps.icon = <XCircleIcon className="h-8 w-8 text-red-500" />;
    case 'FAILED':
      chatStatusProps.title = 'Too many pages in PDF';
      chatStatusProps.message = (
        <>
          <p className="text-zinc-500 text-sm">
            Your <span className="font-medium">Free</span> plan supports up to 5 pages.
          </p>
          <Link href="/dashboard" className={buttonVariants({ variant: 'secondary', className: 'mt-4' })}>
            <ChevronLeftIcon className="h-3 w-3 mr-1.5" /> Back
          </Link>
        </>
      );
      break;
    case 'VECTOR-FAIL':
      chatStatusProps.title = 'PDF unprocessable';
      chatStatusProps.message = (
        <>
          <p className="text-zinc-500 text-sm">Your file couldn&apos;t be processed.</p>
          <Link href="/dashboard" className={buttonVariants({ variant: 'secondary', className: 'mt-4' })}>
            <ChevronLeftIcon className="h-3 w-3 mr-1.5" /> Back
          </Link>
        </>
      );
      break;
  }

  return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
      <div className="flex-1 flex justify-center items-center flex-col mb-28">
        <div className="flex flex-col items-center gap-2">
          {chatStatusProps.icon}
          <h3 className="font-semibold text-xl">{chatStatusProps.title}</h3>
          {chatStatusProps.message}
        </div>
      </div>
    </div>
  );
};

export default ChatStatus;
