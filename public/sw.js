const CACHE_VERSION = 'v6';
const STATIC_CACHE = `bee-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `bee-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `bee-images-${CACHE_VERSION}`;
const FONT_CACHE = `bee-fonts-${CACHE_VERSION}`;

// Critical static assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/favicon.png',
  '/icons/apple-touch-icon.png',
  '/icons/app-icon-192.png',
  '/icons/app-icon-512.png',
  '/__l5e/assets-v1/2f5c2a9f-0d88-4a5c-84f1-b8a8d747a7f0/bee-app-bahamas-logo.png',
];

// Ad images — match EXACT URLs used in AdSplash component (1200w for quality/size balance)
const AD_IMAGES = [
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=675&q=75&fm=webp&fit=crop',
  'https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=1200&h=675&q=75&fm=webp&fit=crop',
  'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&h=675&q=75&fm=webp&fit=crop',
];

const MAX_DYNAMIC_CACHE = 50;
const MAX_IMAGE_CACHE = 80;

// Install — precache critical assets & first 3 ads
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) =>
        Promise.allSettled(PRECACHE_ASSETS.map((url) => cache.add(url).catch(() => null)))
      ),
      caches.open(IMAGE_CACHE).then((cache) =>
        Promise.allSettled(
          AD_IMAGES.map((url) =>
            fetch(url, { mode: 'cors' })
              .then((res) => (res.ok ? cache.put(url, res) : null))
              .catch(() => null)
          )
        )
      ),
    ]).then(() => self.skipWaiting())
  );
});

// Activate — purge old caches immediately
self.addEventListener('activate', (event) => {
  const current = new Set([STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, FONT_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => !current.has(n)).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxItems);
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;
  // Never intercept auth/token endpoints
  if (url.pathname.includes('token') || url.pathname.includes('auth')) return;

  // ── Navigation: network-first, instant cache fallback ───────────────────
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            caches.open(STATIC_CACHE).then((c) => c.put(request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match('/').then((r) => r || caches.match(request)))
    );
    return;
  }

  // ── Fonts: cache-first (they never change) ───────────────────────────────
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          if (res.ok) caches.open(FONT_CACHE).then((c) => c.put(request, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  // ── Images: stale-while-revalidate ───────────────────────────────────────
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|avif)$/) ||
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('pravatar.cc')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fresh = fetch(request)
          .then((res) => {
            if (res.ok) {
              caches.open(IMAGE_CACHE).then((c) => {
                c.put(request, res.clone());
                limitCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE);
              });
            }
            return res;
          })
          .catch(() => cached || new Response('', { status: 408 }));
        return cached || fresh;
      })
    );
    return;
  }

  // ── JS/CSS bundles: stale-while-revalidate for instant load ─────────────
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.match(/\.(js|css|mjs)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fresh = fetch(request)
          .then((res) => {
            if (res.ok) {
              caches.open(DYNAMIC_CACHE).then((c) => {
                c.put(request, res.clone());
                limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE);
              });
            }
            return res;
          })
          .catch(() => cached);
        return cached || fresh;
      })
    );
    return;
  }

  // ── Default: network-first with cache fallback ───────────────────────────
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok && res.type === 'basic') {
          caches.open(DYNAMIC_CACHE).then((c) => {
            c.put(request, res.clone());
            limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE);
          });
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
  }
});
