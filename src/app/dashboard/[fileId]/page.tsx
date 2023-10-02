'use client';

import React from 'react';
import { trpc } from '@/app/_trpc/client';
import { notFound } from 'next/navigation';
import { PDFRenderer } from '@/components/PDFRenderer';
import ChatWrapper from '@/components/ChatWrapper';

interface PageProps {
  params: {
    fileId: number;
  };
}

// TODO: Global secured routes (with auth) (use layout ?)
const SingleFilePage = ({ params }: PageProps) => {
  const { fileId } = params;

  if (!fileId || isNaN(fileId)) notFound();

  const { data: file, isLoading } = trpc.getUserFileById.useQuery({ id: parseInt('0' + (fileId || 0)) }); // TODO: Fix this (Force int)

  if (!isLoading && (!file || !file.length)) notFound();

  console.log(file);

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* File viewer */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFRenderer />
          </div>
        </div>

        <div className="shrink-8 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
};

SingleFilePage.propTypes = {};

export default SingleFilePage;
