'use client';

import React from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GhostIcon, Loader2Icon, MessageSquareIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { trpc } from '@app/_trpc/client';
import { format } from 'date-fns';

import UploadButton from './UploadButton';

const Dashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = React.useState<number | null>(null);

  const utils = trpc.useContext();

  const { data: userFiles, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteUserFile } = trpc.deleteUserFile.useMutation({
    onSuccess() {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id); // TODO: Call uploadthing to delete file
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    }
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b pb-5 sm:flex-row sm:inter-center sm:gap-0 border-gray-200 dark:border-gray-700">
        <h1 className="mb-3 font-bold text-5xl text-gray-900 dark:text-slate-50">My Files</h1>

        <UploadButton />
      </div>

      {/* User files */}
      {isLoading ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-2 md:grid-cols-2 lg:grid-cols-3">
          <li className="col-span-1">
            <Skeleton className="h-12 w-full rounded bg-gray-200 dark:bg-gray-700" />
          </li>
          <li className="col-span-1">
            <Skeleton className="h-12 w-full rounded bg-gray-200 dark:bg-gray-700" />
          </li>
          <li className="col-span-1">
            <Skeleton className="h-12 w-full rounded bg-gray-200 dark:bg-gray-700" />
          </li>
        </ul>
      ) : userFiles && userFiles.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-2 md:grid-cols-2 lg:grid-cols-3">
          {userFiles.map((file) => (
            <li className="col-span-1 divide-y rounded-lg shadow transition hover:shadow-lg bg-white divide-gray-200 dark:bg-black dark:divide-gray-700" key={file.id}>
              <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
                <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 dark:from-blue-500 dark:to-cyan-500" />
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-lg font-medium text-zinc-900 dark:text-slate-50">{file.name}</h3>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  {format(new Date(file.createdAt), 'MMM yyyy')}
                </div>

                <div className="flex items-center gap-2">
                  <MessageSquareIcon className="h-4 w-4" />
                  moked
                </div>

                <Button variant="destructive" size="sm" className="w-full" onClick={() => deleteUserFile(file)}>
                  {currentlyDeletingFile === file.id ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <TrashIcon className="h-4 w-4" />}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <GhostIcon className="w-8 h-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
