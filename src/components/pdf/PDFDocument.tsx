import React from 'react';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Support annotation layer
import 'react-pdf/dist/esm/Page/TextLayer.css'; // Support text layer

import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import { Loader2Icon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFDocument = ({ url, page, scale, rotate, setNumPages }: { url: string; page: number; scale: number; rotate: number; setNumPages: React.Dispatch<React.SetStateAction<number | undefined>> }) => {
  const { width, ref } = useResizeDetector();
  const { toast } = useToast();

  return (
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
        <Page pageNumber={page} width={width ? width : 1} scale={scale} rotate={rotate} />
      </Document>
    </div>
  );
};

export default PDFDocument;
