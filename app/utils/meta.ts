import type { MetaFunction } from "react-router";

export function metaHelper(
  titlePrefix: string,
  description: string,
): MetaFunction {
  const title = `${titlePrefix} | Utiliti`;

  return () => [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
  ];
}
