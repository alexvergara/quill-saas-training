import { createUploadthing, type FileRouter } from 'uploadthing/next';
//import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getAuth } from '@clerk/nextjs/server';
import { vectorizePDF } from '@/lib/pinecone';

import { getUserByPublicId, insertFile, updateFile } from '@/server/db/utils';
import { uploadStatusEnum } from '@/server/db/schema';
import { MAX_FILE_SIZE } from '@/config/files';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: MAX_FILE_SIZE } }) // TODO: Config MAX_FILE_SIZE
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
      const newFile = await insertFile({
        key: file.key,
        //url: file.url,
        url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        size: '' + file.size / 1000, // TODO: Check why is not working with decimal
        name: file.name,
        userId: metadata.userId,
        uploadStatus: 'PROCESSING' // TODO: Use enum
      });

      let uploadStatus = uploadStatusEnum.enumValues.find((item) => item === 'FAILED');
      try {
        if (await vectorizePDF(newFile[0].id, newFile[0].publicId, file.url)) {
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

export type OurFileRouter = typeof ourFileRouter;
