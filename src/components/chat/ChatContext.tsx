import React from 'react';

import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

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

export const ChatContextProvider = ({ fileId, children }: ChatContextProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const { toast } = useToast();

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
    }
  });

  const addMessage = async () => sendMessage({ message });
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value);

  return (
    /* Chat context */
    <ChatContext.Provider value={{ message, addMessage, handleInputChange, isLoading }}>{children}</ChatContext.Provider>
  );
};
