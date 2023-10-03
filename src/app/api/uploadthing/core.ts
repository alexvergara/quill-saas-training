import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { vectorizePDF } from '@/lib/pinecone';
import { files } from '@/server/db/schema';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user) throw new Error('Unauthorized');

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      //const statues = files.UploadStatuses.reduce((acc, item) => { return { ...acc, [item]: item }, {} } as any);

      const newFile = await files.insertFile({
        key: file.key,
        //url: file.url,
        url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        name: file.name,
        userId: metadata.userId,
        uploadStatus: 'PROCESSING'
      });

      // TODO: send to queue for processing

      // TODO: update upload status after processing

      let uploadStatus = files.UploadStatuses.find((item) => item === 'FAILED');
      try {
        console.log('vectorizing', file.url, newFile[0].id);

        const response = await vectorizePDF(file.url, newFile[0].id);

        console.log('vectorized');

        if (response) uploadStatus = files.UploadStatuses.find((item) => item === 'UPLOADED');
      } catch (e) {
        console.log('error', e);
        uploadStatus = files.UploadStatuses.find((item) => item === 'VECTOR-FAIL');
      }

      await files.updateFile(newFile[0].id, { ...newFile[0], uploadStatus: uploadStatus });

      //console.log('newFile', newFile);
    })
} satisfies FileRouter;

/*export const fileManager = {
  deleteFiles: (files: string | string[]) => {
    return utapi.deleteFiles(files);
  }
};*/

export type OurFileRouter = typeof ourFileRouter;
