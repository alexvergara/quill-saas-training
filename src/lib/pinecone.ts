import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!
});

export const vectorizePDF = async (url: string, fileId: number) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const loader = new PDFLoader(blob);
  const pageLevelDocs = await loader.load();
  const pagesAmt = pageLevelDocs.length;

  console.log('vectorizing', url, fileId);

  // vectorize and index entire document

  const pineconeIndex = await pinecone.index('quill');
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!
  });

  await PineconeStore.fromDocuments(pageLevelDocs, embeddings, { pineconeIndex, id: fileId.toString() });

  return true;
};
