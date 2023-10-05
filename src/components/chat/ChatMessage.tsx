import type { ExtendedMessage } from '@/types/message';

import React from 'react';

import ReactMarkdown from 'react-markdown';
import { Icons } from '../ui/Icons';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageProps {
  message: ExtendedMessage;
  same: boolean;
}

const ChatMessage = ({ message, same }: MessageProps) => {
  const isUser = message.isUserMessage;

  return (
    /* Chat Message */
    <div className={cn('flex items-end ', { 'justify-end': isUser })}>
      <div className={cn('relative flex items-center justify-center h-6 w-6 aspect-square rounded-sm', isUser ? 'order-2 bg-blue-600 dark:bg-gray-400' : 'order-1 bg-zinc-800 dark:bg-slate-100', { invisible: same })}>
        {isUser ? (
          //
          <Icons.user className="w-3/4 h-3/4 fill-zinc-200 text-zinc-200 dark:fill-slate-700 dark:text-slate-700" />
        ) : (
          //
          <Icons.logo className="w-3/4 h-3/4 fill-zinc-200 dark:fill-slate-700" />
        )}
      </div>
      <div className={cn('flex flex-col max-w-md mx-2 space-y-2 text-base', isUser ? 'order-1 items-end' : 'order-2 items-start')}>
        <div className={cn('inline-block px-4 py-2 rounded-lg', isUser ? 'bg-blue-600 text-white dark:bg-gray-400 dark:text-black' : 'bg-gray-200 text-gray-900 dark:bg-slate-500 dark:text-slate-50', { 'rounded-br-none': !same && isUser, 'rounded-bl-none': !same && !isUser })}>
          {/*  */}
          {typeof message.text === 'string' ? <ReactMarkdown className={cn('prose text-gray-900 dark:text-slate-50', { 'text-zinc-50 dark:text-black': isUser })}>{message.text}</ReactMarkdown> : message.text}

          {message.id >= 0 ? (
            <div className={cn('mt-2 select-none text-xs text-right text-gray-500 dark:text-slate-400', { 'text-blue-300 dark:text-gray-600': isUser })}>
              {/*  */}
              {format(new Date(message.createdAt), 'HH:mm')}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
