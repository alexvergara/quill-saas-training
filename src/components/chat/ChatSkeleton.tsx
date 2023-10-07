import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ChatSkeletonProps {
  right: boolean;
  classNames?: string | object;
}

const ChatSkeleton = React.forwardRef<HTMLDivElement, ChatSkeletonProps>(({ right, classNames }, ref?) => {
  return (
    <div className={cn('flex items-end ', { 'justify-end': right })} ref={ref}>
      <div className={cn('relative flex items-center justify-center h-6 w-6 aspect-square rounded-sm', right ? 'order-2' : 'order-1')}>
        {/* */}
        <Skeleton className="w-3/4 h-3/4  dark:bg-slate-800/20" />
      </div>
      <div className={cn('flex flex-col w-1/3 mx-2 space-y-2', right ? 'order-1 items-end' : 'order-2 items-start')}>
        <Skeleton className={cn('inline-block px-4 py-2 h-16 w-full rounded-lg dark:bg-slate-800/20', right ? 'rounded-br-none' : 'rounded-bl-none', classNames)} />
      </div>
    </div>
  );
});

ChatSkeleton.displayName = 'ChatSkeleton';

export default ChatSkeleton;
