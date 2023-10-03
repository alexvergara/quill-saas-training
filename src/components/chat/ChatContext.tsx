import React from 'react';

import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { send } from 'process';

export type StreamResponse = {
  message: string;
  isLoading: boolean;
  addMessage: (message: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export interface ChatContextProps {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContext = React.createContext<StreamResponse>({
  message: '',
  isLoading: false,
  addMessage: (message: string) => {},
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {}
});

export const ChatContextProvider = ({ fileId, children }: ChatContextProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const { toast } = useToast();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch(`/api/messages/stream/${fileId}`, {
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

  const addMessage = async (message: string) => sendMessage({ message });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);

  return <ChatContext.Provider value={{ message, addMessage, handleInputChange, isLoading }}>{children}</ChatContext.Provider>;
};
