const STATIC_ASSETS = ["/build/", "/assets/"];

/**
 * Very simple service worker that caches the assets and serves them if they exist in the cache.
 *
 * If this becomes more complex, it might be worth using the google workbox libraries and transpiling
 * a typescript worker. Look at `remix-pwa` and see how they do it.
 */
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const method = event.request.method;

  // we are only caching static assets
  if (
    method.toLowerCase() !== "get" ||
    !STATIC_ASSETS.some((publicPath) => url.pathname.startsWith(publicPath))
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open("assets");
      const cacheResponse = await cache.match(event.request);

      if (cacheResponse) {
        return cacheResponse;
      }

      const fetchResponse = await fetch(event.request);
      await cache.put(event.request, fetchResponse.clone());

      return fetchResponse;
    })()
  );
});
