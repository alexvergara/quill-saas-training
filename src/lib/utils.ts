import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dm = (objFrom: any, objTo: any) => Object.keys(objFrom)
  .reduce((merged, key) => {
    merged[key] = objFrom[key] instanceof Object && !Array.isArray(objFrom[key]) ? dm(objFrom[key], merged[key] ?? {}) : objFrom[key]
    return merged
  }, { ...objTo })

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME) return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.SERVER_PORT}`;
  return `${process.env.SERVER_HOST ?? 'http://localhost'}:${process.env.SERVER_PORT ?? 3000}`;
}
