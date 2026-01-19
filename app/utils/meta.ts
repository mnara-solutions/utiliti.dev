import type { MetaFunction } from "react-router";

const BASE_URL = "https://utiliti.dev";
const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/mstile-310x150.png`;

export function metaHelper(
  titlePrefix: string,
  description: string,
  path: string,
): MetaFunction {
  const title = `${titlePrefix} | Utiliti`;
  const url = `${BASE_URL}${path}`;

  return () => [
    { title },
    { name: "description", content: description },
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:image", content: DEFAULT_OG_IMAGE },
    // Canonical
    { tagName: "link", rel: "canonical", href: url },
  ];
}
