const STATIC_ASSETS = ["/build/", "/assets/"];
const ASSET_CACHE = "assets";
const DOCUMENT_CACHE = "documents";

/**
 * Very simple service worker that caches the assets and serves them if they exist in the cache.
 *
 * If this becomes more complex, it might be worth using the google workbox libraries and transpiling
 * a typescript worker. Look at `remix-pwa` and see how they do it.
 */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith((async () => await handleFetch(event))());
});

async function handleFetch(event) {
  const r = event.request;

  // cache any static assets
  // serve straight away from a cache
  if (STATIC_ASSETS.some((publicPath) => r.url.startsWith(publicPath))) {
    const cached = await caches.match(r, {
      cacheName: ASSET_CACHE,
      ignoreVary: true,
      ignoreSearch: true,
    });

    if (cached) {
      return cached;
    }

    const response = await fetch(r);

    if (response.status === 200) {
      const cache = await caches.open(ASSET_CACHE);
      await cache.put(r, response.clone());
    }

    return response;
  }

  // cache any documents
  // we attempt to fetch via the network first, and fallback to cache incase offline
  if (r.mode === "navigate") {
    try {
      const response = await fetch(event.request);
      const cache = await caches.open(DOCUMENT_CACHE);
      await cache.put(event.request, response.clone());

      return response;
    } catch (error) {
      const response = await caches.match(event.request);

      if (response) {
        return response;
      }

      throw error;
    }
  }
}
