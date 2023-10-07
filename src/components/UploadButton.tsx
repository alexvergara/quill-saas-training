'use client';

import React from 'react';

import { useUploadThing } from '@/lib/uploadthing';
import { useRouter } from 'next/navigation';
import { trpc } from '@app/_trpc/client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CloudIcon, FileIcon, Loader2Icon } from 'lucide-react';
import { ProgressWithColor } from '@/components/ui-custom/progress-with-color';
import { toast } from '@/components/ui/use-toast';
import Dropzone from 'react-dropzone';

const UploadDropzone = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);

  const { startUpload } = useUploadThing('pdfUploader', {
    onUploadBegin: (filename: string) => setIsUploading(true),
    onUploadProgress: (progress: number) => setUploadProgress(progress),
    onUploadError: (error) => {
      console.error(error);
      toast({ title: 'Something went wrong', description: error.message, variant: 'destructive' });
    },
    onClientUploadComplete: (response) => {
      if (!response) return toast({ title: 'Something went wrong', description: 'Please try again later', variant: 'destructive' });
      const [fileResponse] = response;
      //console.log(fileResponse);
      startPolling({ key: fileResponse?.key });
    }
  });

  const { mutate: startPolling } = trpc.getUserFileByKey.useMutation({
    onSuccess: (file) => router.push(`/dashboard/${file.publicId}`),
    retry: 5,
    retryDelay: 1000

    // TODO: The retry must not be infinite, but only for a certain amount of time

    /*onError: (error) => {
      console.error(error);
      toast({ title: 'Something went wrong', description: error.message, variant: 'destructive' });
      //router.push('/dashboard');
      setIsUploading(false);
    }*/
  });

  // TODO: Add function for cancelling upload (if possible)

  return (
    <Dropzone multiple={false} onDrop={(acceptedFile) => startUpload(acceptedFile)}>
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div {...getRootProps()} className="border h-64 border-dashed border-gray-300 rounded-lg">
          <div className="flex items-center justify-center h-full w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudIcon className="h-6 w-6 text-zinc-600 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <FileIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">{acceptedFiles[0].name}</div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <ProgressWithColor value={uploadProgress} indicatorClassName={uploadProgress === 100 ? 'bg-green-500' : ''} className="h-1 w-full bg-zinc-200" />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center p-2">
                      <Loader2Icon className="h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}

              <input {...getInputProps()} id="dropzone-file" className="sr-only hidden" />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(is_visible) => (is_visible ? false : setIsOpen(is_visible))}>
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
