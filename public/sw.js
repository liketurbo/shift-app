const CACHE_PREFIX = 'ozon-job-calendar-';
const CACHE_NAME = `${CACHE_PREFIX}v1`;

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  const indexUrl = new URL('./', self.registration.scope);
  const response = await fetch(indexUrl, { cache: 'reload' });

  if (!response.ok) throw new Error(`Не удалось загрузить приложение: ${response.status}`);
  await cache.put(indexUrl, response.clone());

  const html = await response.text();
  const assetPaths = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
    .map(match => new URL(match[1], indexUrl).href)
    .filter(url => url.startsWith(self.registration.scope));

  await Promise.allSettled(assetPaths.map(url => cache.add(url)));
}

self.addEventListener('install', event => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map(key => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(new URL('./', self.registration.scope), copy));
          return response;
        })
        .catch(() => caches.match(new URL('./', self.registration.scope))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok && url.href.startsWith(self.registration.scope)) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    })),
  );
});
