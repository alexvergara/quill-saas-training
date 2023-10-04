import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
//import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeClient } from '@pinecone-database/pinecone';

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

// vectorize message
export const vectorizeMessage = async (message: string, fileId: number) => {
  const { pineconeIndex, embeddings } = await getPineconeInstance();

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex, namespace: fileId.toString() });

  //await pineconeIndex.upsert({ id: message.id, vector });
  await pineconeIndex.upsert({ id: message, vector });

  return true;
};
