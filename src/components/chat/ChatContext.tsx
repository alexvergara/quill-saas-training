import type { ExtendedMessage } from '@/types/message';

import React from 'react';

import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '@/app/_trpc/client';

import { INFINITE_QUERY_LIMIT } from '@/config';

export type StreamResponse = {
  message: string;
  isLoading: boolean;
  addMessage: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export interface ChatContextProps {
  fileId: number;
  children: React.ReactNode;
}

export const ChatContext = React.createContext<StreamResponse>({
  message: '',
  isLoading: false,
  addMessage: () => {},
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {}
});

export const createDummyMessage = (publicId: string, message: string, fromUser: boolean): ExtendedMessage => ({
  id: 0,
  publicId,
  userId: 0,
  fileId: 0,
  message,
  fromUser,
  createdAt: new Date().toISOString(),
  updatedAt: null
});

export const ChatContextProvider = ({ fileId, children }: ChatContextProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const { toast } = useToast();

  const backupMessage = React.useRef<string>('');
  const utils = trpc.useContext();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      console.log(message);

      const response = await fetch(`/api/messages/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, message })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage('');

      await utils.getUserMessagesByFileId.cancel();

      const previousMessages = utils.getUserMessagesByFileId.getInfiniteData();

      utils.getUserMessagesByFileId.setInfiniteData({ fileId, limit: INFINITE_QUERY_LIMIT }, (old) => {
        if (!old) return { pages: [], pageParams: [] };

        let newPages = [...old.pages];
        let latestPage = newPages[0]!;

        latestPage.messages = [createDummyMessage(crypto.randomUUID(), message, true), ...latestPage.messages];

        newPages[0] = latestPage;

        return { ...old, pages: newPages };
      });

      setIsLoading(true);

      return { previousMessages: previousMessages?.pages.map((page) => page.messages).flat() || [] };
    },
    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      utils.getUserMessagesByFileId.setData({ fileId }, { messages: context?.previousMessages || [] });
      //toast.error('Failed to send message');
    },
    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) {
        return toast({
          title: 'There was a problem sending this message',
          description: 'Please refresh the page and try again.',
          variant: 'destructive'
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let accumulatedResponse = '';
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedResponse += chunk;

          utils.getUserMessagesByFileId.setInfiniteData({ fileId, limit: INFINITE_QUERY_LIMIT }, (old) => {
            if (!old) return { pages: [], pageParams: [] };

            let isAIResponseCreated = old.pages.some((page) => page.messages.some((message) => message.id === -2)); //'ai-message' ));

            let updatePages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages;

                if (!isAIResponseCreated) {
                  updatedMessages = [createDummyMessage('ai-response', accumulatedResponse, false), ...page.messages];
                } else {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === -2) {
                      return { ...message, message: accumulatedResponse };
                    }
                    return message;
                  });
                }

                return { ...page, messages: updatedMessages };
              }

              return page;
            });

            return { ...old, pages: updatePages };
          });
        }
      }
    },
    onSettled: async () => {
      setIsLoading(false);
      await utils.getUserMessagesByFileId.invalidate();
    }
  });

  const addMessage = async () => sendMessage({ message });
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value);

  return (
    /* Chat context */
    <ChatContext.Provider value={{ message, addMessage, handleInputChange, isLoading }}>{children}</ChatContext.Provider>
  );
};
