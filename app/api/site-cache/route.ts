import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import { APPLICATION_API_BASE_URL, APPLICATION_NAME } from '@/lib/application-constants';
import { siteCacheTag } from '@/lib/site';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) {
    return new Response(null, { status: 403 });
  }

  const token = (await cookies()).get('SEESAW_ACCESS_TOKEN')?.value;
  if (!token) {
    return new Response(null, { status: 401 });
  }

  const response = await fetch(`${APPLICATION_API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store'
  });
  if (!response.ok) {
    return new Response(null, { status: response.status === 401 || response.status === 403 ? response.status : 502 });
  }

  const user = await response.json();
  if (!Array.isArray(user.authorities) || !user.authorities.some((authority: unknown) => authority === 'ROLE_MANAGER' || authority === 'ROLE_ADMIN')) {
    return new Response(null, { status: 403 });
  }

  revalidateTag(siteCacheTag(`${APPLICATION_NAME}.seesaw.me.kr`), { expire: 0 });
  return new Response(null, { status: 204 });
}
