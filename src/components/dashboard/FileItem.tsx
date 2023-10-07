import type { File } from '@/server/db/schema';

import React from 'react';

import Link from 'next/link';
import { CheckCircleIcon, CheckIcon, CircleIcon, FileTextIcon, Loader2Icon, PlusIcon, TrashIcon, XCircleIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import format from 'date-fns/format';
import { cn } from '@/lib/utils';

const FileItem = ({ mode, index, className, file, deleteUserFile, currentlyDeletingFile }: { mode: string; index: number; className?: string; file?: File; deleteUserFile?: (file: File) => void; currentlyDeletingFile?: number | null }) => {
  const handleDeleteFile = () => {
    if (deleteUserFile && file) deleteUserFile(file);
  };

  // TODO: Create small components for each mode

  // TODO: Paginate ?

  if (!file) {
    if (mode === 'list') {
      return (
        <tr>
          <td>
            <Skeleton className="w-full h-6 rounded bg-gray-50 dark:bg-gray-900" />
          </td>
        </tr>
      );
    }

    return (
      <li className={className}>
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
      </li>
    );
  }

  const fileSize = (parseFloat('0' + file.size) / (1024 * 1024)).toFixed(2) + ' MB';

  if (mode === 'list') {
    return (
      <>
        {index === 0 && (
          <tr>
            <th className="text-sm">File</th>
            {/* <th className="text-center text-sm">Retry</th> */}
            {/* <th className="text-center text-sm">Status</th> */}
            <th className="text-right text-sm">Size</th>
            <th className="text-right text-sm">Pages</th>
            <th className="text-center text-sm">Score</th>
            <th className="text-center text-sm">Readable</th>
            {/* <th className="text-center text-sm">Blacklisted</th> */}
            <th className="text-center text-sm">Processed</th>
            {/* <th className="text-center text-sm">Public</th> */}
            <th className="text-center text-sm"></th>
          </tr>
        )}
        <tr className="items-center h-8 bg-gray-100 hover:bg-gray-20 dark:bg-gray-900/30 dark:hover:bg-gray-900">
          <td colSpan={1} className="pl-2">
            <Link href={`/dashboard/${file.publicId}`} className="flex overflow-hidden items-center space-x-2">
              <FileTextIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="truncate w-full">{file.name}</span>
            </Link>
          </td>
          {/* <td className="w-24 text-center text-xs">{file.retry}</td> */}
          {/* <td className="w-24 text-center text-xs">{file.uploadStatus}</td> */}
          <td className="w-24 text-right text-xs">{fileSize}</td>
          <td className="w-24 text-right text-xs">{file.pages}</td>
          <td className="w-24 text-center text-xs">{file.score}</td>
          <td className="w-24">{file.isReadable ? <CheckCircleIcon className="m-auto h-4 w-4" /> : <CircleIcon className="m-auto h-4 -w-4 text-gray-200 dark:text-slate-700" />}</td>
          {/* <td className="w-24">{file.isBlacklisted ? <CheckCircleIcon className="m-auto h-4 w-4" /> : <CircleIcon className="m-auto h-4 -w-4 text-gray-200 dark:text-slate-700" />}</td> */}
          <td className="w-24">{file.isProcessed ? <CheckCircleIcon className="m-auto h-4 w-4" /> : <CircleIcon className="m-auto h-4 -w-4 text-gray-200 dark:text-slate-700" />}</td>
          {/* <td className="w-24">{file.isPublic ? <CheckCircleIcon className="m-auto h-4 w-4" /> : <CircleIcon className="m-auto h-4 -w-4 text-gray-200 dark:text-slate-700" />}</td> */}
          <td className="text-center w-8 px-1">{currentlyDeletingFile === file.id ? <Loader2Icon className="m-auto w-4 h-4 animate-spin" onClick={handleDeleteFile} /> : <TrashIcon className="m-auto text-red-500 h-4 w-4 cursor-pointer" onClick={handleDeleteFile} />}</td>
        </tr>
      </>
    );
  }

  return (
    <li className={cn('divide-y rounded-lg shadow transition hover:shadow-lg hover:border hover:border-blue-900 bg-white divide-gray-200 dark:bg-gray-800 dark:divide-gray-700', className)}>
      <Link href={`/dashboard/${file.publicId}`} className="flex flex-col gap-2">
        <div className="pt-6 px-4 flex w-full items-center justify-between space-x-4">
          {/* <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400" /> */}
          <FileTextIcon className="h-8 w-8 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
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

        <Button variant="destructive" size="sm" className="" onClick={handleDeleteFile}>
          {currentlyDeletingFile === file.id ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <TrashIcon className="h-4 w-4" />}
        </Button>
      </div>
    </li>
  );
};

export default FileItem;
