'use client';

import type { File } from '@/server/db/schema';

import React from 'react';

import { GhostIcon, LayoutGridIcon, ListIcon, StretchHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@app/_trpc/client';
import { cn } from '@/lib/utils';

import UploadButton from './UploadButton';
import FileItem from './dashboard/FileItem';
import { MAX_FILE_SIZE } from '@/config/files';
//import { deleteFiles } from '@/app/_actions';
//import { utapi } from '@/lib/uploadthing-utapi';

const Dashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = React.useState<number | null>(null);
  const [currentMode, setCurrentMode] = React.useState<number>(0); // TODO: Save in localStorage

  //

  const utils = trpc.useContext();

  const { data: subscriptionPlan } = trpc.getUserCurrentSubscriptionPlan.useQuery();
  const maxFileSize = subscriptionPlan?.size ? subscriptionPlan?.size + 'MB' : MAX_FILE_SIZE; // TODO: Use user's subscription plan to get max file size

  const { data: userFiles, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteUserFile } = trpc.deleteUserFile.useMutation({
    onSuccess() {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id, key }) {
      setCurrentlyDeletingFile(id); // TODO: Call uploadthing to delete file
      /*deleteFiles([key])
        .then((response) => {
          console.log('Deleted from host', response);
        })
        .catch((error) => {
          console.error('Error deleting from host', error);
        });*/
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    }
  });

  const modes = [
    { id: 'card', wrapper: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3', item: 'col-span-1 max-w-sm min-w-max', icon: <StretchHorizontalIcon className="h-4 w-4" /> },
    { id: 'grid', wrapper: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5', item: 'col-span-1', icon: <LayoutGridIcon className="h-4 w-4" /> },
    { id: 'list', wrapper: 'flex flex-col', item: '', icon: <ListIcon className="h-4 w-4" /> }
  ];

  return (
    <main className="mx-auto max-w-7xl md:p-5">
      <div className="flex flex-col items-start justify-between gap-4 border-b pb-5 sm:flex-row sm:inter-center sm:gap-0 border-gray-200 dark:border-gray-700">
        <h1 className="font-bold text-5xl text-gray-900 dark:text-slate-50">My Files</h1>

        <UploadButton maxFileSize={maxFileSize} />
      </div>

      <div className="flex justify-end mt-2">
        <div className="flex gap-2">
          {modes.map((mode, index) => (
            <Button key={mode.item} disabled={currentMode === index} variant="secondary" size="sm" className="w-full" title={mode.id} onClick={(e) => setCurrentMode(index)}>
              {mode.icon}
            </Button>
          ))}
        </div>
      </div>

      {modes[currentMode].id === 'list' ? (
        <table className="table mt-4 w-full border-separate border-spacing-y-2 ">
          {isLoading
            ? //
              [...Array(3).keys()].reverse().map((item, index) => <FileItem mode={modes[currentMode].id} className={modes[currentMode].item} index={index} key={index} />)
            : userFiles?.map((file, index) => (
                //
                <FileItem mode={modes[currentMode].id} index={index} className={modes[currentMode].item} file={file as unknown as File} deleteUserFile={deleteUserFile} currentlyDeletingFile={currentlyDeletingFile} key={file.id} />
              ))}
        </table>
      ) : (
        //
        <ul className={cn('mt-2 gap-6', modes[currentMode].wrapper)}>
          {isLoading
            ? //
              [...Array(3).keys()].reverse().map((item, index) => <FileItem mode={modes[currentMode].id} className={modes[currentMode].item} index={index} key={index} />)
            : userFiles?.map((file, index) => (
                //
                <FileItem mode={modes[currentMode].id} index={index} className={modes[currentMode].item} file={file as unknown as File} deleteUserFile={deleteUserFile} currentlyDeletingFile={currentlyDeletingFile} key={file.id} />
              ))}
        </ul>
      )}

      {!userFiles?.length && !isLoading && (
        <div className="mt-16 flex flex-col items-center gap-2">
          <GhostIcon className="w-8 h-8 text-zinc-800 dark:text-zinc-100" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
