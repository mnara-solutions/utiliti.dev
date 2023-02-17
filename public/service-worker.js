const STATIC_ASSETS = ["/build/", "/assets/"];

/**
 * Very simple service worker that caches the assets and serves them if they exist in the cache.
 *
 * If this becomes more complex, it might be worth using the google workbox libraries and transpiling
 * a typescript worker. Look at `remix-pwa` and see how they do it.
 */
self.addEventListener("fetch", (event) => {
  // we are only caching static assets
  if (
    event.request.method.toLowerCase() !== "get" ||
    !STATIC_ASSETS.some((publicPath) =>
      event.request.url.startsWith(publicPath)
    )
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request, {
        cacheName: "assets",
        ignoreVary: true,
        ignoreSearch: true,
      });

      if (cached) {
        return cached;
      }

      const response = await fetch(event.request);

      if (response.status === 200) {
        const cache = await caches.open("assets");
        await cache.put(event.request, response.clone());
      }

      return response;
    })()
  );
});
