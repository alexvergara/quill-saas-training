import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
//import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeClient } from '@pinecone-database/pinecone';

import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getOpenAIInstance, prompts } from './openai';
import { messages } from '@/server/db/schema';

let pineconeInstance: { pineconeIndex: any; embeddings: any } | null = null;
export const getPineconeInstance = async () => {
  if (pineconeInstance) return pineconeInstance;

  const pinecone = await getPineconeClient(); // TODO: Singleton ?
  const pineconeIndex = await pinecone.Index(process.env.PINECONE_INDEX!);
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! });

  return (pineconeInstance = { pineconeIndex, embeddings });
};

/*export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!
});*/
export const getPineconeClient = async () => {
  const client = new PineconeClient();

  await client.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!
  });

  return client;
};

// vectorize and index entire document
export const vectorizePDF = async (url: string, fileId: number) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const loader = new PDFLoader(blob);
  const pageLevelDocs = await loader.load();
  const pagesAmt = pageLevelDocs.length;

  const { pineconeIndex, embeddings } = await getPineconeInstance();

  //await PineconeStore.fromDocuments(pageLevelDocs, embeddings, { pineconeIndex, id: fileId.toString() });
  await PineconeStore.fromDocuments(pageLevelDocs, embeddings, { pineconeIndex, namespace: fileId.toString() });

  return true;
};

// vectorize message, fire search and create stream
export const getMessagesStream = async (userId: number, fileId: number, message: string) => {
  const { pineconeIndex, embeddings } = await getPineconeInstance();

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex, namespace: fileId.toString() });
  const results = await vectorStore.similaritySearch(message, 4); // TODO: Config ?
  const prevMessages = await messages.getUserMessagesByFileId(userId, fileId, 6); // TODO: Config ?

  const formattedMessages = prevMessages.map((message) => ({
    role: message.fromUser ? ('User' as const) : ('Assistant' as const),
    content: message.message
  }));

  const previousConversation = formattedMessages.map((message) => `${message.role}: ${message.content}\n`).join('\n');
  const context = results.map((result) => result.pageContent).join('\n\n');

  const chatMessages = prompts.chatMessages;
  chatMessages[1].content = chatMessages[1].content.replace('XXX-PREVIOUS-CONVERSATION-XXX', previousConversation).replace('XXX-CONTEXT-XXX', context).replace('XXX-MESSAGE-XXX', message);

  console.log('chatMessages', chatMessages);
  const response = await getOpenAIInstance().chat.completions.create({
    model: 'gpt-3.5-turbo', // TODO: Config ?
    temperature: 0, // TODO: Config ?
    stream: true,
    messages: chatMessages as ChatCompletionMessageParam[]
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await messages.insertMessage({
        userId,
        fileId,
        message: completion
      });
    }
  });

  return new StreamingTextResponse(stream);
};
