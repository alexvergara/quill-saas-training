import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '@/server/trpc';

type RouterOutput = inferRouterOutputs<AppRouter>;
type Messages = RouterOutput['getUserLatestMessagesByFileId']['messages'];
//type OmitFields = Omit<Messages[number], 'message'>;
type OmitFields = Omit<Messages[number], 'createdAt'>;
type OverrideMessage = {
  createdAt: string;
};

export type ExtendedMessage = OmitFields & OverrideMessage;
