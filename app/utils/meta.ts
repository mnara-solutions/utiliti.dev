import type { HtmlMetaDescriptor } from "@remix-run/server-runtime/dist/routeModules";

export function metaHelper(
  titlePrefix: string,
  description: string
): HtmlMetaDescriptor {
  const title = `${titlePrefix} | Utiliti`;

  return {
    title,
    description,
    "og:title": title,
    "og:description": description,
  };
}
