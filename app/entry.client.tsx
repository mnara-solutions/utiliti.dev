import { HydratedRouter } from "react-router/dom";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});

// add a service worker, only in production for now
// @todo: disabled for now, causing more problems
if (
  "serviceWorker" in navigator &&
  window.location.origin === "https://utiliti.dev"
) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.unregister();
  });
}
