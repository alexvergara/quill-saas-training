//import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getAuth } from '@clerk/nextjs/server';
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator';
import { NextRequest } from 'next/server';
import { files, messages } from '@/server/db/schema';
import { getMessagesStream } from '@/lib/pinecone';

export const POST = async (req: NextRequest) => {
  /*const { getUser } = getKindeServerSession();
  const user = getUser();
  const userId = user?.id */

  const { userId } = getAuth(req);

  if (!userId) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();

  console.log('body', req, body);

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await files.getUserFileById(userId, fileId);

  if (!file.length) return new Response('Not found', { status: 404 });

  await messages.insertMessage({
    text: message,
    fileId,
    userId: userId,
    isUserMessage: true
  });

  return getMessagesStream(userId, fileId, message);
};
