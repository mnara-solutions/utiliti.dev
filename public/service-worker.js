const ASSET_CACHE = "assets";
const DOCUMENT_CACHE = "documents";

/**
 * Very simple service worker that caches the assets and serves them if they exist in the cache.
 *
 * If this becomes more complex, it might be worth using the google workbox libraries and transpiling
 * a typescript worker.
 */
self.addEventListener("fetch", (event) => {
  const r = event.request;

  if (r.method !== "GET") {
    return;
  }

  // cache any documents
  if (r.mode === "navigate") {
    return event.respondWith(networkFirst(r, DOCUMENT_CACHE));
  }

  // cache any static assets
  if (!r.url.startsWith("chrome-extension://")) {
    return event.respondWith(cacheFirst(r, ASSET_CACHE));
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request, {
    cacheName: cacheName,
    ignoreVary: true,
    ignoreSearch: true,
  });

  if (cached) {
    return cached;
  }

  const response = await fetch(request);

  if (response.status === 200) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }

  return response;
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());

    return response;
  } catch (error) {
    const cached = await caches.match(request, {
      cacheName: cacheName,
    });

    if (cached) {
      return cached;
    }

    throw error;
  }
}
