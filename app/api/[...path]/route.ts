import { cookies } from 'next/headers';

import { APPLICATION_API_BASE_URL } from '@/lib/application-constants';

const ACCESS_TOKEN_COOKIE_NAME = 'SEESAW_ACCESS_TOKEN';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade'
]);

function createUpstreamUrl(request: Request, path: string[]): string {
  const requestUrl = new URL(request.url);
  const pathName = path.map((segment) => encodeURIComponent(segment)).join('/');
  return `${APPLICATION_API_BASE_URL}/${pathName}${requestUrl.search}`;
}

function createUpstreamHeaders(request: Request, accessToken: string | undefined): Headers {
  const headers = new Headers();

  request.headers.forEach((value, name) => {
    if (!HOP_BY_HOP_HEADERS.has(name.toLowerCase()) && name.toLowerCase() !== 'authorization') {
      headers.set(name, value);
    }
  });

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return headers;
}

async function proxy(request: Request, path: string[]): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const method = request.method.toUpperCase();
  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer();

  const upstreamResponse = await fetch(createUpstreamUrl(request, path), {
    method,
    headers: createUpstreamHeaders(request, accessToken),
    body,
    cache: 'no-store'
  });

  const responseHeaders = new Headers();
  upstreamResponse.headers.forEach((value, name) => {
    if (name.toLowerCase() !== 'set-cookie') {
      responseHeaders.set(name, value);
    }
  });

  for (const cookie of upstreamResponse.headers.getSetCookie()) {
    responseHeaders.append('set-cookie', cookie);
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders
  });
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function HEAD(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function PUT(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function PATCH(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function DELETE(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}
