import React from 'react';

import { ChatContext } from './ChatContext';
import { Textarea2 } from '@/components/ui/textarea2';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';

const ChatInput = ({ isDisabled }: { isDisabled?: boolean }) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const { message, addMessage, isLoading, handleInputChange } = React.useContext(ChatContext);

  /*const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (e.key === 'Enter' && !e.shiftKey && textAreaRef.current) addMessage(); // TODO: Check why no value is sent on YT
    textAreaRef.current?.focus();
  };*/

  return (
    /* Chat input */
    <div className="absolute bottom-0 left-0 w-full">
      <form className="flex flex-row gap-3 mx-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex flex-1 items-stretch h-full md:flex-col">
          <div className="relative flex flex-col flex-grow w-full p-4">
            <div className="relative">
              {/* <Textarea2 ref={textAreaRef} rows={1} maxRows={4} value={message} autoFocus placeholder="Enter your question..." onChange={handleInputChange} className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch " /> */}
              <Textarea2 ref={textAreaRef} rows={1} maxRows={4} value={message} autoFocus placeholder="Enter your question..." className="resize-none pr-12 py-3 text-base scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch" />
              {/* onKeyDown={(e) => handleSendMessage(e)}  */}
              {/* <Button type="button" disabled={false} aria-label="Send message" className="absolute bottom-1.5 right-[8px]" onClick={() => addMessage()}> */}
              <Button type="button" disabled={false} aria-label="Send message" className="absolute bottom-1.5 right-[8px]">
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
