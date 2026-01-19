import type { MetaFunction } from "react-router";
import type { Utility } from "~/utilities";

const BASE_URL = "https://utiliti.dev";
const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/mstile-310x150.png`;

export function metaHelper(utility: Utility): MetaFunction {
  const title = `${utility.name} | Utiliti`;
  const url = `${BASE_URL}${utility.url}`;

  return () => [
    { title },
    { name: "description", content: utility.description },
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: utility.description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:image", content: DEFAULT_OG_IMAGE },
    // Canonical
    { tagName: "link", rel: "canonical", href: url },
  ];
}
