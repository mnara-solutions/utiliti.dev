import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}

if ("serviceWorker" in navigator) {
  function loadServiceWorker() {
    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      console.error("Service worker registration failed", error);
    });
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    loadServiceWorker();
  } else {
    window.addEventListener("load", loadServiceWorker);
  }
}
