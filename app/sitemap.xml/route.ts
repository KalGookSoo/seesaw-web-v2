import { APPLICATION_API_BASE_URL, APPLICATION_NAME } from '@/lib/application-constants';

export async function GET() {
  const domainName = `${APPLICATION_NAME}.seesaw.me.kr`;
  const params = new URLSearchParams({ origin: `https://${domainName}`, domainName });
  const response = await fetch(`${APPLICATION_API_BASE_URL}/test/sitemap.xml?${params}`, { cache: 'no-store' });
  if (!response.ok) return new Response(null, { status: 502 });
  return new Response(response.body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
