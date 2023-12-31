import type { ExtendedMessage } from '@/types/message';

import React from 'react';

import { useInView } from 'react-intersection-observer';
import { MessageSquareIcon } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';

import { ChatContext, createDummyMessage } from './ChatContext';
import ChatMessage from './ChatMessage';
import ChatSkeleton from './ChatSkeleton';

import { INFINITE_QUERY_LIMIT } from '@/config';

const ChatMessages = ({ fileId }: { fileId: number }) => {
  const { isLoading: isAIThinking } = React.useContext(ChatContext);
  const { ref: loadMoreRef, inView } = useInView();

  const { isSuccess, data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, isInitialLoading } = trpc.getUserLatestMessagesByFileId.useInfiniteQuery({ fileId, limit: INFINITE_QUERY_LIMIT }, { getNextPageParam: (lastPage) => lastPage?.nextCursor, keepPreviousData: true });

  const loadingMessage = createDummyMessage('is-loading', '', false);

  const combinedMessages = [...(isAIThinking ? [loadingMessage] : []), ...((isSuccess && data?.pages.map((page) => page.messages).flat()) || [])];

  let lastIndex = combinedMessages.length - 1;
  let prevMessage = { fromUser: !combinedMessages[0]?.fromUser } as ExtendedMessage;
  const showSkeleton = isInitialLoading || (lastIndex >= 0 && (isFetchingNextPage || hasNextPage || isLoading)); // TODO: Use file message count ?

  React.useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    /* Chat messages */
    <div className="flex flex-1 flex-col-reverse gap-4 p-3 max-h-[calc(100vh-3.5rem-7rem)] overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch border-zinc-200 dark:border-slate-700">
      {lastIndex >= 0
        ? combinedMessages.map((message, index) => {
            const same = message.fromUser === prevMessage.fromUser;
            prevMessage = message;
            return <ChatMessage key={message.publicId} message={message} same={same} />;
          })
        : !showSkeleton && (
            <div className="flex flex-col flex-1 items-center justify-center gap-2">
              <MessageSquareIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
              <p className="text-sm text-zinc-500 dark:text-slate-400">Ask your first question to get started.</p>
            </div>
          )}

      {showSkeleton && (
        <div className="flex flex-col gap-2 w-full">
          {[...Array(4).keys()].reverse().map((item) => (
            // `dark:bg-slate-800/${[5, 10, 20, 25][item]}`)} key={item} /> // TODO: Find a way to make this work
            <ChatSkeleton right={item % 2 === 0} key={item} ref={!item ? loadMoreRef : null} />
          ))}
        </div>
      )}

      {/*
      <p>{isFetchingNextPage ? 'isFetchingNextPage' : 'not isFetchingNextPage'}</p>
      <p>{hasNextPage ? 'hasNextPage' : 'not hasNextPage'}</p>
      <p>{isInitialLoading ? 'isInitialLoading' : 'not isInitialLoading'}</p>
      <p>{isLoading ? 'isLoading' : 'not isLoading'}</p>
      */}
    </div>
  );
};

export default ChatMessages;
