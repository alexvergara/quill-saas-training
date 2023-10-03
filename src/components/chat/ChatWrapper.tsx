'use client';

import { trpc } from '@/app/_trpc/client';
import { files } from '@/server/db/schema';

import ChatMessages from './ChatMessages';
import ChatStatus from './ChatStatus';
import ChatInput from './ChatInput';

const ChatWrapper = ({ fileId }: { fileId: number }) => {
  const { data, isLoading } = trpc.getUserFileUploadStatus.useQuery(
    { id: fileId },
    {
      refetchInterval: (data) => (data?.uploadStatus === 'UPLOADED' || data?.uploadStatus === 'FAILED' ? false : 500)
    }
  );

  if (isLoading || data?.uploadStatus === 'PROCESSING' || data?.uploadStatus === 'FAILED') {
    return <ChatStatus status={data?.uploadStatus || 'DEFAULT'} />;
  }

  return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
      <div className="flex flex-col flex-1 justify-between mb-28">
        <ChatMessages />
      </div>

      <ChatInput isDisabled />
    </div>
  );
};

export default ChatWrapper;
