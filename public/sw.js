// Cache names — bump the version suffix when you want to force-clear old caches
const CACHE_NAMES = {
  static: 'ecology-static-v1',
  pages: 'ecology-pages-v1',
  images: 'ecology-images-v1',
};

const ALL_CACHE_NAMES = Object.values(CACHE_NAMES);

// Next.js content-hashed assets — safe to cache forever
const NEXT_STATIC_PATTERN = /\/_next\/static\//;

// Image extensions to cache aggressively
const IMAGE_PATTERN = /\.(png|jpe?g|gif|svg|webp|ico)(\?.*)?$/i;

// Resources to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/resource-registry.json',
  '/search-index.json',
];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  // Take over immediately without waiting for existing tabs to close
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAMES.pages).then(cache =>
      cache.addAll(PRECACHE_URLS.map(url => new Request(url, { cache: 'no-cache' })))
    ).catch(() => {
      // Pre-caching is best-effort; don't block install if network is unavailable
    })
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => !ALL_CACHE_NAMES.includes(key))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests to the same origin
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Next.js hashed static assets → cache-first (safe because filenames change with content)
  if (NEXT_STATIC_PATTERN.test(url.pathname)) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.static));
    return;
  }

  // Images → cache-first (large, rarely change)
  if (IMAGE_PATTERN.test(url.pathname)) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.images));
    return;
  }

  // Everything else (HTML pages, JSON data) → stale-while-revalidate
  // Serves cached version instantly, updates cache in background for next visit
  event.respondWith(staleWhileRevalidate(request, CACHE_NAMES.pages));
});

// ── Strategies ────────────────────────────────────────────────────────────────

/** Serve from cache; fetch and cache if missing */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

/** Serve from cache immediately; fetch in background to update cache */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Always kick off a background fetch to keep the cache fresh
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);

  // Return cache hit immediately, or wait for network if nothing cached
  return cached ?? networkPromise;
}
