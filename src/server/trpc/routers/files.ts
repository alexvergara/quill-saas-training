import { privateProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { vectorizePDF } from '@/lib/pinecone';
import { files } from '@/server/db/schema';

export const filesRouter = {
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await files.getUserFiles(userId);
  }),

  getUserFileById: privateProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;

    return await files.getUserFileById(userId, input.id);
  }),

  getUserFileUploadStatus: privateProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;

    const _files = await files.getUserFileById(userId, input.id);

    if (!_files.length) return { uploadStatus: files.UploadStatuses[0] };

    const file = _files[0];

    // TODO: Move to a function on files ???
    if (file.uploadStatus === files.UploadStatuses.find((status) => status === 'VECTOR_FAIL')) {
      // TODO: find a better way to do this in every place used (get enum values)
      console.log('Retries', file.retry, file.retry < 3);
      if (file.retry < 3) {
        file.retry = file.retry + 1;
        try {
          console.log('vectorizing', file.url, file.id);
          if (await vectorizePDF(file.url, file.id)) {
            console.log('vectorized');
            file.uploadStatus = files.UploadStatuses.find((item) => item === 'SUCCESS') || 'SUCCESS';
          }
        } catch (e) {
          console.log('error', e);
        }

        await files.updateFile(file.id, file);
      }
    }

    return { uploadStatus: file.uploadStatus }; // as { uploadStatus: string };
  }),

  getUserFileByKey: privateProcedure.input(z.object({ key: z.string() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    const file = await files.getUserFileByKey(userId, input.key);
    if (!file.length) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return file[0];
  }),

  deleteUserFile: privateProcedure.input(z.object({ id: z.number(), key: z.string() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { id } = input;

    const file = await files.getUserFileById(userId, id);

    if (!file.length) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    if (file[0].userId !== userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: `You can\'t remove this file ([user: ${userId}] files.deleteUserFile: ${id}).` });
    }

    return await files.deleteFile(id);
  })
};
