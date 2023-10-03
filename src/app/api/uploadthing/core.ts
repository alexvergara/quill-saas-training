import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { files } from '@/server/db/schema';
//import { utapi } from '@/lib/uploadthing';

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
      const newFile = await files.insertFile({
        key: file.key,
        //url: file.url,
        url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        name: file.name,
        userId: metadata.userId,
        uploadStatus: 'PROCESSING'
      });
    })
} satisfies FileRouter;

/*export const fileManager = {
  deleteFiles: (files: string | string[]) => {
    return utapi.deleteFiles(files);
  }
};*/

export type OurFileRouter = typeof ourFileRouter;
