import React from 'react';

import { ExpandIcon } from 'lucide-react';
import { Dialog, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { DialogContent } from '@radix-ui/react-dialog';
import SimpleBar from 'simplebar-react';

const PDFFullScreen = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(visible) => (visible ? false : setIsOpen(visible))}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-1.5" aria-label="Fullscreen">
          <ExpandIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-2-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6"></SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PDFFullScreen;
