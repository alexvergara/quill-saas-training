import React from 'react';

import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { ExpandIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleBar from 'simplebar-react';

const PDFFullScreen = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(visible) => (visible ? false : setIsOpen(visible))}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-1.5" aria-label="Fullscreen" onClick={() => setIsOpen(true)}>
          <ExpandIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-20rem)] w-full">
        <SimpleBar autoHide={false} className="max-w-[calc(100vw-20rem)] max-h-[calc(100vh-10rem)] mt-6">
          {children}
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PDFFullScreen;
