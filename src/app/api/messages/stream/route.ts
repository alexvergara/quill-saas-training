//import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getAuth } from '@clerk/nextjs/server';
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator';
import { NextRequest } from 'next/server';
import { getMessagesStream } from '@/lib/pinecone';
import { getUserByPublicId, getUserFileById, insertMessage } from '@/server/db/utils';

export const POST = async (req: NextRequest) => {
  /*const { getUser } = getKindeServerSession();
  const user = getUser();*/

  const { userId: clerkUserId } = getAuth(req);
  const user = await getUserByPublicId(clerkUserId || '');

  if (!clerkUserId || !user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();

  //console.log('body', req, body);

  // TODO: is this necessary ???
  const { fileId, message } = SendMessageValidator.parse(body);
  const file = await getUserFileById(user.id, fileId);
  if (!file) return new Response('Not found', { status: 404 });

  await insertMessage({
    userId: user.id,
    fileId,
    message,
    fromUser: true
  });

  return getMessagesStream(user.id, fileId, message);
};
