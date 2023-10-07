import React from 'react';

import Link from 'next/link';
import { CheckCircleIcon, ChevronLeftIcon, Loader2Icon, XCircleIcon } from 'lucide-react';
import { buttonVariants } from '../ui/button';

const ChatStatus = ({ status }: { status: string }) => {
  const errorIcon = <XCircleIcon className="h-8 w-8 text-red-500" />;
  //const successIcon = <CheckCircleIcon className="h-8 w-8 text-green-500" />;
  const processingIcon = <Loader2Icon className="h-8 w-8 text-blue-500 animate-spin" />;

  let chatStatus = { title: 'Processing...', message: "This won't take long.", icon: processingIcon, error: false };

  switch (status) {
    case 'PENDING':
    case 'UPLOADED':
    case 'PROCESSING':
      break;
    case 'FAILED':
      chatStatus = { title: 'Too many pages in PDF', message: 'Your <span class="font-bold">Free</span> plan supports up to 5 pages.', icon: errorIcon, error: true }; // TODO: Add link to upgrade page, Use Value from DB, validate error
      break;
    case 'VECTOR_FAIL':
      chatStatus = { title: 'PDF unprocessable', message: "Your file couldn't be processed.", icon: errorIcon, error: true }; // TODO: Improve message and action
      break;
    /*case 'SUCCESS':
      chatStatus = { title: 'Success', message: 'Your file was processed successfully.', icon: successIcon, error: false };
      break;*/
    default:
      chatStatus = { title: 'Error', message: 'There was an error, please try again later.', icon: errorIcon, error: true };
  }

  return (
    /* Chat status */
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2 dark:bg-slate-900 dark:divide-slate-700">
      <div className="flex-1 flex justify-center items-center flex-col mb-28">
        <div className="flex flex-col items-center gap-2">
          {chatStatus.icon}
          <h3 className="font-semibold text-xl">{chatStatus.title}</h3>
          <p className="text-zinc-500 text-sm dark:text-slate-400" dangerouslySetInnerHTML={{ __html: chatStatus.message }}></p>
          {chatStatus.error && (
            <Link href="/dashboard" className={buttonVariants({ variant: 'secondary', className: 'mt-4' })}>
              <ChevronLeftIcon className="h-3 w-3 mr-1.5" /> Back
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatStatus;
