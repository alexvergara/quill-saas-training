'use client';

import { trpc } from '@/app/_trpc/client';

import ChatMessages from './ChatMessages';
import ChatStatus from './ChatStatus';
import ChatInput from './ChatInput';

const ChatWrapper = ({ fileId }: { fileId: number }) => {
  const { data, isLoading } = trpc.getUserFileUploadStatus.useQuery({ id: fileId }, { refetchInterval: (data) => (['SUCCESS', 'FAILED', 'VECTOR_FAIL'].indexOf(data?.uploadStatus || '') >= 0 ? false : 500) });

  if ((isLoading && !data) || data?.uploadStatus !== 'SUCCESS') {
    // TODO: Enable success but just for a few seconds!
    return <ChatStatus status={data?.uploadStatus || 'PENDING'} />;
  }

  return (
    <div className="relative flex flex-col justify-between gap-2 min-h-full divide-y divide-zinc-200 bg-zinc-50 dark:divide-zinc-900 dark:bg-slate-700  ">
      <div className="flex flex-col flex-1 justify-between mb-28">
        <ChatMessages />
      </div>

      <ChatInput isDisabled />
    </div>
  );
};

export default ChatWrapper;
