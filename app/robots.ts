import { MetadataRoute } from 'next';
import { APPLICATION_NAME } from '@/lib/application-constants';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = `https://${APPLICATION_NAME}.seesaw.me.kr`;
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
    sitemap: `${origin}/sitemap.xml`
  };
}
