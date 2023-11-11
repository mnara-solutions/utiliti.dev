import type { MetaFunction } from "@remix-run/cloudflare";

export function metaHelper(
  titlePrefix: string,
  description: string,
): MetaFunction {
  const title = `${titlePrefix} | Utiliti`;

  return () => [
    { title },
    { meta: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
  ];
}
