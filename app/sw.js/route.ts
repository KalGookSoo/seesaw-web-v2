const JAVASCRIPT_MEDIA_TYPE = 'application/javascript; charset=utf-8';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const siteId = new URL(request.url).searchParams.get('siteId');
  const serviceWorker = `
const SITE_ID = ${JSON.stringify(siteId)};
const CACHE_NAME = ${JSON.stringify(`seesaw-${siteId}-v1`)};
const CACHEABLE_PATHS = [
  "/favicon.png",
  "/pwa-icon-192.png",
  "/pwa-icon-512.png",
  "/_next/static/",
  "/images/",
  "/fonts/"
];

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(cacheName => cacheName.startsWith(\`seesaw-\${SITE_ID}-\`) && cacheName !== CACHE_NAME)
        .map(cacheName => caches.delete(cacheName))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !CACHEABLE_PATHS.some(path => url.pathname.startsWith(path))) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  })());
});

self.addEventListener("push", event => {
  if (!event.data) {
    return;
  }

  let data = {};
  try {
    data = event.data.json();
  } catch (error) {
    data = { body: event.data.text() };
  }

  const title = data.title || "Seesaw";
  const options = {
    body: data.body || "",
    icon: data.icon || "/favicon.png",
    badge: data.badge || "/favicon.png",
    data: {
      url: data.url || "/"
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "/", self.location.origin).href;

  event.waitUntil((async () => {
    const clientsList = await clients.matchAll({ type: "window", includeUncontrolled: true });
    const client = clientsList.find(client => client.url === targetUrl);
    if (client) {
      return client.focus();
    }
    return clients.openWindow(targetUrl);
  })());
});
`;

  return new Response(serviceWorker, {
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': JAVASCRIPT_MEDIA_TYPE,
      'Service-Worker-Allowed': '/'
    }
  });
}
