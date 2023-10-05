import type { ExtendedMessage } from '@/types/message';

import React from 'react';

import { INFINITE_QUERY_LIMIT } from '@/config';
import { Loader2Icon, MessageSquareIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/app/_trpc/client';

import ChatMessage from './ChatMessage';

const ChatMessages = ({ fileId }: { fileId: number }) => {
  const { data, isLoading, fetchNextPage } = trpc.getUserMessagesByFileId.useInfiniteQuery(
    { fileId, limit: INFINITE_QUERY_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      keepPreviousData: true
    }
  );

  const loadingMessage = {
    id: -1,
    text: (
      <span className="flex items-center justify-center h-full">
        <Loader2Icon className="w-4 h-4 animate-spin" />
      </span>
    ),
    isUserMessage: false,
    createdAt: new Date().toISOString()
  };

  const combinedMessages = [...(isLoading ? [loadingMessage] : []), ...(data?.pages.map((page) => page.messages).flat() || [])];

  let prevMessage = { isUserMessage: !combinedMessages[0].isUserMessage } as ExtendedMessage;

  return (
    /* Chat messages */
    <div className="flex flex-1 flex-col-reverse gap-4 p-3 max-h-[calc(100vh-3.5rem-7rem)] overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch border-zinc-200 dark:border-slate-700">
      {combinedMessages.length ? (
        combinedMessages.map((message, index) => {
          const same = message.isUserMessage === prevMessage.isUserMessage;
          prevMessage = message;
          if (index === combinedMessages.length - 1) {
            return <ChatMessage key={message.id} message={message} same={same} />;
          } else {
            return <ChatMessage key={message.id} message={message} same={same} />;
          }
        })
      ) : isLoading ? (
        <div className="flex flex-col gap-2 w-full">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton className="h-16 bg-gray-50 dark:bg-slate-900" key={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center gap-2">
          <MessageSquareIcon className="w-8 h-8 text-blue-500 dark:text-slate-500" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-sm text-zinc-500 dark:text-slate-500">Ask your first question to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
