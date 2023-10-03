import type { OurFileRouter } from '@app/api/uploadthing/core';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import { UTApi } from 'uploadthing/server';

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

export const utapi = new UTApi();
