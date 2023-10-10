import type { Metadata } from 'next/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MAX_FILE_SIZE } from '@/config/files';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dm = (objFrom: any, objTo: any) =>
  Object.keys(objFrom).reduce(
    (merged, key) => {
      merged[key] = objFrom[key] instanceof Object && !Array.isArray(objFrom[key]) ? dm(objFrom[key], merged[key] ?? {}) : objFrom[key];
      return merged;
    },
    { ...objTo }
  );

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME) return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.SERVER_PORT}`;
  return `${process.env.SERVER_HOST ?? 'http://localhost'}:${process.env.SERVER_PORT ?? 3000}`;
};

export const getFileMaxSize = (maxFileSize?: string) => {
  const maxFile = (maxFileSize || MAX_FILE_SIZE).toUpperCase().trim();
  const size = maxFile.replace(/[^0-9\.]+/g, '');
  const unit = maxFile.replace(size, '');

  const units = ['B', 'KB', 'MB', 'GB'];

  //return Math.floor(parseFloat(size) * (1024 ** units.indexOf(unit) + 1));
  return Math.floor(parseFloat(size) * Math.pow(1024, units.indexOf(unit)));
};

export const constructMetadata = ({
  title = 'Quill - the SasS for students',
  description = 'Quill is a SasS for students to help them with their homework',
  image = '/img/thumbnail.png',
  icons = '/core/favicon.png',
  noIndex = false
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@Quill'
    },
    icons,
    metadataBase: new URL('https://quill.famver.com'),
    themeColor: '#ffffff',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  };
};
