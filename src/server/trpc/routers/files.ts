import { privateProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { vectorizePDF } from '@/lib/pinecone';
import { deleteFile, getUserFileById, getUserFileByKey, getUserFileByPublicId, getUserFiles, updateFile } from '@/server/db/utils';
import { uploadStatusEnum } from '@/server/db/schema';

export const filesRouter = {
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await getUserFiles(userId);
  }),

  getUserFileById: privateProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;

    return await getUserFileById(userId, input.id);
  }),

  getUserFileByPublicId: privateProcedure.input(z.object({ publicId: z.string() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;

    return await getUserFileByPublicId(userId, input.publicId);
  }),

  getUserFileUploadStatus: privateProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { userId } = ctx;

    const file = await getUserFileById(userId, input.id);

    if (!file) return { uploadStatus: uploadStatusEnum.enumValues[0] };

    // TODO: Move to a function on files ???
    if (file.uploadStatus === uploadStatusEnum.enumValues.find((status) => status === 'VECTOR_FAIL')) {
      // TODO: find a better way to do this in every place used (get enum values)
      //console.log('Retries', file.retry, file.retry < 3);
      if (file.retry < 3) {
        file.retry = file.retry + 1;
        try {
          //console.log('vectorizing', file.url, file.id);
          if (await vectorizePDF(file.url, file.publicId)) {
            console.log('vectorized');
            file.uploadStatus = uploadStatusEnum.enumValues.find((item) => item === 'SUCCESS') || 'SUCCESS';
          }
        } catch (e) {
          console.log('error', e);
        }

        await updateFile(file.id, file);
      }
    }

    return { uploadStatus: file.uploadStatus }; // as { uploadStatus: string };
  }),

  getUserFileByKey: privateProcedure.input(z.object({ key: z.string() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    const file = await getUserFileByKey(userId, input.key);
    if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

    return file;
  }),

  deleteUserFile: privateProcedure.input(z.object({ id: z.number(), key: z.string() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { id } = input;

    const file = await getUserFileById(userId, id);

    if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

    if (file.userId !== userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: `You can\'t remove this file ([user: ${userId}] files.deleteUserFile: ${id}).` });

    return await deleteFile(id);
  })
};
