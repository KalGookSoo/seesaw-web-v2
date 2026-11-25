import { version } from '@/package.json';

export const APPLICATION_NAME =
  process.env.NEXT_PUBLIC_SEESAW_APPLICATION_NAME ?? 'seesaw-web-v2';

export const APPLICATION_VERSION = version;

export const APPLICATION_API_BASE_URL =
  process.env.NEXT_PUBLIC_SEESAW_APPLICATION_API_BASE_URL ??
  'http://localhost:9000/seesaw-api/api';
