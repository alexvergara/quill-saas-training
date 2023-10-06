import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '@/server/trpc';

type RouterOutput = inferRouterOutputs<AppRouter>;
type Messages = RouterOutput['getUserMessagesByFileId']['messages'];
type OmitMessage = Omit<Messages[number], 'message'>;
type OverrideMessage = {
  message: string | React.JSX.Element;
};

export type ExtendedMessage = OmitMessage & OverrideMessage;
