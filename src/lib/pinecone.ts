import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';
//import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeClient } from '@pinecone-database/pinecone';

import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getOpenAIInstance, prompts } from './openai';
import { getUserLatestMessagesByFileId, insertMessage } from '@/server/db/utils';

import { AI_PREVIOUS_MESSAGES, AI_SIMILARITY_SEARCH_COUNT } from '@/config';

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

// TODO: Vectorize different document types

// vectorize and index entire document
export const vectorizePDF = async (url: string, filePublicId: string) => {
  const reader = await fetch(url);
  const blob = await reader.blob();
  const loader = new PDFLoader(blob);
  const pageLevelDocs = await loader.load();
  const pagesAmt = pageLevelDocs.length;

  // let size = 0;
  // let maxPage = 0;
  for (const document of pageLevelDocs) {
    // TODO: Create an alert to user when the document metadata is too big (4OK bytes max)
    /*size += new Blob([JSON.stringify(document.metadata)]).size;
    if (size > 35000) break;
    maxPage++;*/
    try {
      delete document.metadata.pdf.metadata; // Remove extra metadata from PDF (avoid Pinecone metadata limit 40KB)
    } catch (error) {
      console.log('error', error);
    }
  }

  const { pineconeIndex, embeddings } = await getPineconeInstance();

  //await PineconeStore.fromDocuments(pageLevelDocs, embeddings, { pineconeIndex, id: fileId.toString() });
  await PineconeStore.fromDocuments(pageLevelDocs, embeddings, { pineconeIndex, namespace: filePublicId });

  // TODO: Create a function to remove all documents from an index... and specific when user deletes de file
  //await pineconeIndex.delete1({ deleteAll: true, namespace: '1' });

  // TODO: Validate if the document was vectorized correctly

  return true;
};

//
/*export const validateDocument = async (url: string, filePublicId: string, message: string) => {
  const { pineconeIndex, embeddings } = await getPineconeInstance();

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex, namespace: filePublicId });
  const results = await vectorStore.similaritySearch(message, AI_SIMILARITY_SEARCH_COUNT);


  const previousConversation = formattedMessages.map((message) => `${message.role}: ${message.content}\n`).join('\n');
  const context = results.map((result) => result.pageContent).join('\n\n');

  const chatMessages = prompts.chatMessages;
  chatMessages[1].content = chatMessages[1].content.replace('XXX-CONTEXT-XXX', context).replace('XXX-MESSAGE-XXX', message);

  const chatMessages = prompts.DocumentValidation;
  chatMessages[1].content = chatMessages[1].content.replace('XXX-MESSAGE-XXX', message);

  console.log('chatMessages', chatMessages);
  const response = await getOpenAIInstance().chat.completions.create({
    model: 'gpt-3.5-turbo', // TODO: Config ?
    temperature: 0, // TODO: Config ?
    stream: true,
    messages: chatMessages as ChatCompletionMessageParam[]
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await insertMessage({
        userId,
        fileId,
        message: completion
      });
    }
  });

  return new StreamingTextResponse(stream);
}*/

// vectorize message, fire search and create stream
export const getMessagesStream = async (userId: number, fileId: number, filePublicId: string, message: string) => {
  const { pineconeIndex, embeddings } = await getPineconeInstance();

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex, namespace: filePublicId });
  const results = await vectorStore.similaritySearch(message, AI_SIMILARITY_SEARCH_COUNT);
  const previousMessages = await getUserLatestMessagesByFileId(userId, fileId, AI_PREVIOUS_MESSAGES);

  const formattedMessages = previousMessages.map((previousMessage) => ({
    role: previousMessage.fromUser ? ('User' as const) : ('Assistant' as const),
    content: previousMessage.message
  }));

  const previousConversation = formattedMessages.map((formattedMessage) => `${formattedMessage.role}: ${formattedMessage.content}\n`).join('\n');
  const context = results.map((result) => result.pageContent).join('\n\n');
  //.join('') //\n\n')
  //.replace(/^\s*[\r\n]/gm, '');

  const chatMessages = prompts().chatMessages;
  chatMessages[1].content = chatMessages[1].content.replace('XXX-PREVIOUS-CONVERSATION-XXX', previousConversation).replace('XXX-CONTEXT-XXX', context).replace('XXX-MESSAGE-XXX', message);

  const response = await getOpenAIInstance().chat.completions.create({
    model: 'gpt-3.5-turbo-16k', // TODO: Config ?
    temperature: 0, // TODO: Config ?
    stream: true,
    messages: chatMessages as ChatCompletionMessageParam[]
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await insertMessage({
        userId,
        fileId,
        message: completion
      });
    }
  });

  return new StreamingTextResponse(stream);
};

/*
export const vectorizeUnstructured = async (url: string, filePublicId: string) => {
  /*const reader = await fetch(url);
  const blob = await reader.blob();* /
  const loader = new UnstructuredLoader(url);
  const pageLevelDocs = await loader.load();
  const pagesAmt = pageLevelDocs.length;

  console.log('pagesAmt', pagesAmt);

  const { pineconeIndex, embeddings } = await getPineconeInstance();

  //await PineconeStore.fromDocuments(pageLevelDocs, embeddings, { pineconeIndex, id: fileId.toString() });
  await PineconeStore.fromDocuments(pageLevelDocs, embeddings, { pineconeIndex, namespace: filePublicId });

  // TODO: Create a function to remove all documents from an index... and specific when user deletes de file
  //await pineconeIndex.delete1({ deleteAll: true, namespace: '1' });

  return true;
};
*/
