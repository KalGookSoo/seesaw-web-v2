import { APPLICATION_NAME } from '@/lib/application-constants.ts';
import { getCurrentSite } from '@/lib/site';

const MANIFEST_MEDIA_TYPE = 'application/manifest+json';
const DEFAULT_THEME_COLOR = '#000000';
const DEFAULT_BACKGROUND_COLOR = '#ffffff';

export const dynamic = 'force-dynamic';

function getColor(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback;
}

const domainName = `${APPLICATION_NAME}.seesaw.me.kr`;

export async function GET() {
  const site = await getCurrentSite(domainName);
  const manifest = {
    id: site.id,
    name: site.name,
    short_name: site.name,
    description: site.description ?? '',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: getColor(site.backgroundColor, DEFAULT_BACKGROUND_COLOR),
    theme_color: getColor(site.themeColor, DEFAULT_THEME_COLOR),
    icons: [
      {
        src: '/favicon.png',
        sizes: '320x320',
        type: 'image/png'
      },
      {
        src: '/pwa-icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/pwa-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Cache-Control': 'public, max-age=600',
      'Content-Type': MANIFEST_MEDIA_TYPE
    }
  });
}
