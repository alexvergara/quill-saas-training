import type { ExtendedMessage } from '@/types/message';

import React from 'react';

import ReactMarkdown from 'react-markdown';
import { Icons } from '@/components/ui-custom/Icons';
import { Loader2Icon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: ExtendedMessage;
  same: boolean;
}

const ChatMessage = React.forwardRef<HTMLDivElement, MessageProps>(({ message, same }, ref?) => {
  const fromUser = message.fromUser;

  return (
    /* Chat Message */
    <div ref={ref} className={cn('flex items-end ', { 'justify-end': fromUser })}>
      <div className={cn('relative flex items-center justify-center h-6 w-6 aspect-square rounded-sm', fromUser ? 'order-2 bg-blue-600 dark:bg-gray-400' : 'order-1 bg-zinc-800 dark:bg-slate-100', { invisible: same })}>
        {/* */}
        {fromUser ? <Icons.user className="w-3/4 h-3/4 fill-zinc-200 text-zinc-200 dark:fill-slate-700 dark:text-slate-700" /> : <Icons.logo className="w-3/4 h-3/4 fill-zinc-200 dark:fill-slate-700" />}
      </div>
      <div className={cn('flex flex-col max-w-md mx-2 space-y-2 text-base', fromUser ? 'order-1 items-end' : 'order-2 items-start')}>
        <div className={cn('inline-block px-4 py-2 rounded-lg', fromUser ? 'bg-blue-600 text-white dark:bg-gray-400 dark:text-black' : 'bg-gray-200 text-gray-900 dark:bg-slate-500 dark:text-slate-50', { 'rounded-br-none': !same && fromUser, 'rounded-bl-none': !same && !fromUser })}>
          {message.publicId == 'is-loading' ? (
            <span className="flex items-center justify-center h-full">
              <Loader2Icon className="w-4 h-4 animate-spin" />
            </span>
          ) : (
            <>
              <ReactMarkdown className={cn('prose text-gray-900 dark:text-slate-50', { 'text-zinc-50 dark:text-black': fromUser })}>{message.message}</ReactMarkdown>
              <div className={cn('mt-2 select-none text-xs text-right text-gray-500 dark:text-slate-400', { 'text-blue-300 dark:text-gray-600': fromUser })}>
                {/*  */}
                {format(new Date(message.createdAt!), 'HH:mm')}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
