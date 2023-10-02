'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CloudIcon, FileIcon } from 'lucide-react';
import Dropzone from 'react-dropzone';
import { Progress } from './ui/progress';

const UploadDropzone = () => {
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);

  const startSimulatedProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 95) return prev + 5;
        clearInterval(interval);
        return prev;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={(acceptedFile) => {
        const progressInterval = startSimulatedProgress();

        //

        setTimeout(() => {
          clearInterval(progressInterval);
          setUploadProgress(100);
          //setIsUploading(false);
        }, 5000);
      }}
    >
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
                  <Progress value={uploadProgress} className="h-1 w-full bg-zinc-200" />
                </div>
              ) : null}
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
