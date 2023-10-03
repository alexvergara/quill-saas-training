import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator';
import { NextRequest } from 'next/server';
import { files, messages } from '@/server/db/schema';

export const POST = async (req: NextRequest) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) return new Response('Unauthorized', { status: 401 });

  const { body } = await req.json();

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await files.getUserFileById(user.id, fileId);

  if (!file.length) return new Response('Not found', { status: 404 });

  await messages.insertMessage({
    text: message,
    fileId,
    userId: user.id,
    isUserMessage: true
  });
};
