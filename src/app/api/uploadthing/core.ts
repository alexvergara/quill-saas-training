import { createUploadthing, type FileRouter } from 'uploadthing/next';
//import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getAuth } from '@clerk/nextjs/server';
import { vectorizePDF } from '@/lib/pinecone';

import { getUserByPublicId, insertFile, updateFile } from '@/server/db/utils';
import { uploadStatusEnum } from '@/server/db/schema';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      /*const { getUser } = getKindeServerSession();
      const user = await getUser();
      const userId = user?.id;*/
      const { userId: publicId } = getAuth(req);
      const user = await getUserByPublicId(publicId || '');

      if (!publicId || !user) throw new Error('Unauthorized');

      return { publicId, userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      //const statues = files.UploadStatuses.reduce((acc, item) => { return { ...acc, [item]: item }, {} } as any);

      console.log('metadata', metadata);

      const newFile = await insertFile({
        // TODO: Use intermediate file status (PENDING, UPLOADED)
        key: file.key,
        //url: file.url,
        url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        name: file.name,
        userId: metadata.userId,
        uploadStatus: 'PROCESSING'
      });

      // TODO: send to queue for processing

      // TODO: Move to a function on files ??? // TODO: Remove from here, is running twice
      let uploadStatus = uploadStatusEnum.enumValues.find((item) => item === 'FAILED');
      try {
        console.log('vectorizing', file.url, newFile[0].id);
        if (await vectorizePDF(file.url, newFile[0].id)) {
          console.log('vectorized');
          uploadStatus = uploadStatusEnum.enumValues.find((item) => item === 'SUCCESS');
        }
      } catch (e) {
        console.log('error', e);
        uploadStatus = uploadStatusEnum.enumValues.find((item) => item === 'VECTOR_FAIL');
      }

      await updateFile(newFile[0].id, { ...newFile[0], uploadStatus });

      //console.log('newFile', newFile);
    })
} satisfies FileRouter;

/*export const fileManager = {
  deleteFiles: (files: string | string[]) => {
    return utapi.deleteFiles(files);
  }
};*/

export type OurFileRouter = typeof ourFileRouter;
