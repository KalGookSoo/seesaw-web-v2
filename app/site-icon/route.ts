import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

import { APPLICATION_API_BASE_URL, APPLICATION_NAME } from '@/lib/application-constants';
import { getSiteContext } from '@/lib/site';
import { siteIconVersion } from '@/lib/site-icon';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 10 * 1024 * 1024;
const SIZES = new Set([32, 180, 192, 512]);

async function readImage(response: Response): Promise<Buffer> {
  if (!response.ok || !response.body || Number(response.headers.get('content-length')) > MAX_BYTES) {
    throw new Error('프로필 이미지를 가져올 수 없습니다.');
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) throw new Error('프로필 이미지가 너무 큽니다.');
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(chunks);
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const size = Number(params.get('size'));
  if (!SIZES.has(size)) return new Response(null, { status: 400 });

  const maskable = params.get('maskable') === '1';
  let source: Buffer;
  let fallback = false;
  try {
    const site = await getSiteContext(`${APPLICATION_NAME}.seesaw.me.kr`);
    if (!site.profileImage?.id) throw new Error('프로필 이미지가 없습니다.');
    if (params.get('version') !== siteIconVersion(site)) fallback = true;
    const response = await fetch(`${APPLICATION_API_BASE_URL}/attachments/${encodeURIComponent(site.profileImage.id)}`, {
      signal: AbortSignal.timeout(5000)
    });
    source = await readImage(response);
  } catch {
    fallback = true;
    source = await readFile(path.join(process.cwd(), 'public/favicon.png'));
  }

  const render = async (input: Buffer) => {
    const innerSize = maskable ? Math.floor(size * 0.8) : size;
    const metadata = await sharp(input, { limitInputPixels: 40_000_000 }).metadata();
    if (!['jpeg', 'png', 'webp', 'gif', 'heif'].includes(metadata.format ?? '')) {
      throw new Error('지원하지 않는 이미지 형식입니다.');
    }
    const image = await sharp(input, { limitInputPixels: 40_000_000, failOn: 'error' })
      .rotate()
      .resize(innerSize, innerSize, { fit: 'contain', background: '#ffffff' })
      .png()
      .toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
      .composite([{ input: image, gravity: 'centre' }])
      .png()
      .toBuffer();
  };

  let icon: Buffer;
  try {
    icon = await render(source);
  } catch {
    fallback = true;
    icon = await render(await readFile(path.join(process.cwd(), 'public/favicon.png')));
  }
  return new Response(new Uint8Array(icon), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': fallback ? 'no-store' : 'public, max-age=3600'
    }
  });
}
