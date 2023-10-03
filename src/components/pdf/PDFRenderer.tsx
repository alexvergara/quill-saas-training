'use client';

import React from 'react';

import 'simplebar-react/dist/simplebar.min.css'; // Support scrollbar

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDownIcon, ChevronUpIcon, RotateCwIcon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import PDFFullScreen from './PDFFullScreen';
import PDFDocument from './PDFDocument';
import Simplebar from 'simplebar-react';

// TODO: Remove from package ?
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const PDFRenderer = ({ url }: { url: string }) => {
  const refNumber = React.useRef<number>(1);
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [numPages, setNumPages] = React.useState<number>();
  const [rotate, setRotate] = React.useState<number>(0);
  const [scale, setScale] = React.useState<number>(1);

  const handlePageNumber = (direction: number, e?: React.ChangeEvent<HTMLInputElement>) => {
    const gotoPage = e?.target.value || '';
    const nextPage = (gotoPage ? parseInt(gotoPage) || 0 : pageNumber) + direction;
    if (nextPage < 1 || nextPage > (numPages || 0)) return;
    refNumber.current = nextPage;
    setPageNumber(nextPage);
  };

  // TODO: Find a way not to re-render the whole component
  const renderDocument = <PDFDocument url={url} page={pageNumber} scale={scale} rotate={rotate} setNumPages={setNumPages} />;

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        {numPages ? (
          <>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" aria-label="Previous page" disabled={pageNumber <= 1} onClick={() => handlePageNumber(-1)}>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1.5">
                {/* <Input {...register('pageNumber')} className={cn('w-auto h-8 text-center', errors.pageNumber && 'outline-red-500')} onKeyDown={(e) => (e.key === 'Enter' ? handleSubmit(handlePageSubmit) : false)} /> */}
                <Input type="number" min={1} max={numPages} value={refNumber.current || ''} onFocus={(e) => e.currentTarget.select()} onChange={(e) => handlePageNumber(0, e)} className="w-auto h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <p className="text-zinc-700 text-sm space-x-1">
                  /<span className="font-semibold">{numPages}</span>
                </p>
              </div>

              <Button variant="ghost" aria-label="Next page" disabled={pageNumber >= numPages} onClick={() => handlePageNumber(1)}>
                <ChevronUpIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" aria-label="Zoom" className="gap-1.5">
                    <SearchIcon className="h-4 w-4" />
                    {scale * 100}%<ChevronDownIcon className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {[0.5, 1, 1.5, 2, 2.5].map((option) => (
                    <DropdownMenuItem key={option} onSelect={() => setScale(option)} className={scale === option ? 'bg-zinc-100 font-bold' : ''}>
                      <span className="m-auto">{option * 100}%</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" aria-label="Rotate 90 degrees" onClick={() => setRotate(rotate >= 270 ? 0 : rotate + 90)}>
                <RotateCwIcon className="h-4 w-4 mr-1" />
                90&deg;
              </Button>

              <PDFFullScreen>{renderDocument}</PDFFullScreen>
            </div>
          </>
        ) : null}
      </div>

      <div className="flex-1 w-full max-h-screen justify-center">
        <Simplebar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          {renderDocument}
        </Simplebar>
      </div>
    </div>
  );
};

export default PDFRenderer;
