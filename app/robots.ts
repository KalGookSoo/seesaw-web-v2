import { MetadataRoute } from 'next';
import { headers as getHeaders } from 'next/headers';

import { APPLICATION_API_BASE_URL, APPLICATION_NAME } from '@/lib/application-constants.ts';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headers = await getHeaders();
  const proto = headers.get('x-forwarded-proto') ?? 'https';
  const host = headers.get('x-forwarded-host') ?? headers.get('host') ?? 'localhost:3000';
  const origin = `${proto}://${host}`;
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/'
      },
      {
        userAgent: 'Yeti',
        allow: '/'
      }
    ],
    sitemap: `${APPLICATION_API_BASE_URL}/sitemap.xml?origin=${origin}&domainName=${APPLICATION_NAME}.seesaw.me.kr`
  };
}
