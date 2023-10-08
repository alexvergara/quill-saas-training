import type { File } from '@/server/db/schema';

import Link from 'next/link';
import { FileTextIcon, Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import format from 'date-fns/format';
import { cn } from '@/lib/utils';

const FilesListItem = ({ file, deleteUserFile, currentlyDeletingFile, className }: { file: File; deleteUserFile: (file: File) => void; currentlyDeletingFile?: number | null; className?: string | null }) => {
  return (
    <li className={cn('divide-y rounded-lg shadow transition hover:shadow-lg hover:border hover:border-blue-900 bg-white divide-gray-200 dark:bg-gray-800 dark:divide-gray-700', className)}>
      <Link href={`/dashboard/${file.publicId}`} className="flex flex-col gap-2">
        <div className="pt-6 px-4 flex w-full items-center justify-between space-x-4">
          {/* <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400" /> */}
          <FileTextIcon className="h-8 w-8 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3 max-w-[230px] xl:max-w-[300px]" title={file.name}>
              <h3 className="truncate text-lg font-medium text-zinc-900 dark:text-slate-50">{file.name}</h3>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-3 mt-4 flex justify-between py-2 gap-2 text-xs text-zinc-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          {format(new Date(file.createdAt), 'MMM yyyy')}
        </div>

        {/* <div className="flex items-center gap-2">
          <MessageSquareIcon className="h-4 w-4" />
          moked
        </div> */}

        <Button disabled={currentlyDeletingFile === file.id} variant="destructive" size="sm" className="" onClick={() => deleteUserFile(file)}>
          {currentlyDeletingFile === file.id ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <TrashIcon className="h-4 w-4" />}
        </Button>
      </div>
    </li>
  );
};

FilesListItem.Skeleton = (
  <Skeleton className="pt-6 w-full rounded-lg bg-gray-50 dark:bg-gray-900">
    <div className="flex px-4 w-full items-center space-x-4 ">
      <Skeleton className="h-8 w-8 bg-gray-100 dark:bg-gray-800" />
      <Skeleton className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800" />
    </div>
    <div className="flex px-2 pt-4 pb-2 w-full items-center justify-between space-x-4 ">
      <Skeleton className="h-2 w-1/3 bg-gray-100 dark:bg-gray-800" />
      <Skeleton className="h-10 w-10 bg-gray-100 dark:bg-gray-800" />
    </div>
  </Skeleton>
);

FilesListItem.DisplayName = 'FilesListItem';

export default FilesListItem;
