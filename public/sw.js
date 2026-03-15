const CACHE_VERSION = 'v4';
const STATIC_CACHE = `bee-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `bee-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `bee-images-${CACHE_VERSION}`;
const FONT_CACHE = `bee-fonts-${CACHE_VERSION}`;

// Critical static assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/lovable-uploads/bee-app-logo.png',
  '/lovable-uploads/bee-mascot-logo.png',
  '/lovable-uploads/d5511939-48e5-44cf-9f2b-d8f9e829b842.png'
];

// Ad images to precache for instant splash render
const AD_IMAGES = [
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=450&q=80&fm=webp&fit=crop',
  'https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=800&h=450&q=80&fm=webp&fit=crop',
  'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&h=450&q=80&fm=webp&fit=crop'
];

// Cache size limits
const MAX_DYNAMIC_CACHE = 50;
const MAX_IMAGE_CACHE = 100;

// Install - precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS)),
      // Cache ad images for instant splash
      caches.open(IMAGE_CACHE).then((cache) => {
        return Promise.allSettled(
          AD_IMAGES.map((url) => 
            fetch(url, { mode: 'cors' })
              .then((response) => response.ok ? cache.put(url, response) : null)
              .catch(() => null)
          )
        );
      })
    ]).then(() => self.skipWaiting())
  );
});

// Activate - clean old caches aggressively
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, FONT_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Limit cache size helper
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    limitCacheSize(cacheName, maxItems);
  }
}

// Fetch handler with aggressive caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip non-http protocols
  if (!url.protocol.startsWith('http')) return;

  // Skip certain domains that shouldn't be cached
  if (url.hostname.includes('lovable') && url.pathname.includes('token')) return;

  // Navigation requests - Network first, instant cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match('/') || caches.match(request))
    );
    return;
  }

  // Fonts - Cache first, long-term storage
  if (url.hostname.includes('fonts.googleapis.com') || 
      url.hostname.includes('fonts.gstatic.com') ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(FONT_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Images (including Unsplash) - Cache first with background refresh
  if (request.destination === 'image' || 
      url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|avif)$/) ||
      url.hostname.includes('unsplash.com') ||
      url.hostname.includes('pravatar.cc')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        // Return cached immediately, fetch in background
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(IMAGE_CACHE).then((cache) => {
                cache.put(request, clone);
                limitCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE);
              });
            }
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // JS/CSS bundles - Stale while revalidate for instant loads
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      url.pathname.match(/\.(js|css|mjs)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, clone);
                limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE);
              });
            }
            return response;
          })
          .catch(() => cached);

        // Return cached immediately for instant load
        return cached || fetchPromise;
      })
    );
    return;
  }

  // JSON/API responses - Network first with cache fallback
  if (url.pathname.match(/\.(json)$/) || request.headers.get('accept')?.includes('application/json')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Default - Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, clone);
            limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle cache clear request
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});

// Background sync for offline actions (future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-posts') {
    // Handle offline post sync when back online
    console.log('Background sync triggered');
  }
});
