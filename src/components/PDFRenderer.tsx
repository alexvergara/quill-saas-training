'use client';

import React from 'react';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Support annotation layer
import 'react-pdf/dist/esm/Page/TextLayer.css'; // Support text layer

import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import { ChevronDownIcon, ChevronUpIcon, Loader2Icon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';

interface PDFRendererProps {
  url: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PDFRenderer = ({ url }: PDFRendererProps) => {
  const refNumber = React.useRef<number>(1);
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [numPages, setNumPages] = React.useState<number>();
  const { width, ref } = useResizeDetector();
  const { toast } = useToast();

  /*const CustomPageValidator = z.object({
    pageNumber: z
      .number()
      .min(1)
      .max(numPages || 0)
  });
  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<TCustomPageValidator>({ defaultValues: { pageNumber: 1 }, resolver: zodResolver(CustomPageValidator) });

  const handlePageSubmit = ({ pageNumber }: TCustomPageValidator) => {
    setPageNumber(pageNumber);
    setValue('pageNumber', pageNumber);
  };*/

  const handlePageNumber = (direction: number, e?: React.ChangeEvent<HTMLInputElement>) => {
    const gotoPage = e?.target.value || '';
    const nextPage = (gotoPage ? parseInt(gotoPage) || 0 : pageNumber) + direction;
    if (nextPage < 1 || nextPage > (numPages || 0)) return;
    refNumber.current = nextPage;
    setPageNumber(nextPage);
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1 5">
          {numPages ? (
            <>
              <Button variant="ghost" aria-label="Previous page" disabled={pageNumber <= 1} onClick={() => handlePageNumber(-1)}>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1 5">
                {/* <Input {...register('pageNumber')} className={cn('w-auto h-8 text-center', errors.pageNumber && 'outline-red-500')} onKeyDown={(e) => (e.key === 'Enter' ? handleSubmit(handlePageSubmit) : false)} /> */}
                <Input type="number" min={1} max={numPages} value={refNumber.current || ''} onFocus={(e) => e.currentTarget.select()} onChange={(e) => handlePageNumber(0, e)} className="w-auto h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <p className="text-zinc-700 text-sm space-x-1">
                  /<span className="font-semibold">{numPages}</span>
                </p>
              </div>

              <Button variant="ghost" aria-label="Next page" disabled={pageNumber >= numPages} onClick={() => handlePageNumber(1)}>
                <ChevronUpIcon className="h-4 w-4" />
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen justify-center">
        <div ref={ref}>
          <Document
            file={url}
            loading={
              <div className="flex justify-center">
                <Loader2Icon className="my-24 h-6 w-6 animate-spin" />
              </div>
            }
            onLoadError={(err) => toast({ title: 'Error loading PDF', description: /*err.message*/ 'Please try again later', variant: 'destructive' })}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className="max-h-full"
          >
            <Page pageNumber={pageNumber} width={width ? width : 1} />
          </Document>
        </div>
      </div>
    </div>
  );
};
