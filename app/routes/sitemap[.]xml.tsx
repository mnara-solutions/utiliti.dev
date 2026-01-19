import { utilities } from "~/utilities";

export async function loader() {
  const baseUrl = "https://utiliti.dev";
  const today = new Date().toISOString().split("T")[0];

  const urls = [
    {
      loc: baseUrl,
      priority: "1.0",
      changefreq: "weekly",
      lastmod: today,
    },
    ...Object.values(utilities).map((utility) => ({
      loc: `${baseUrl}${utility.url}`,
      priority: "0.8",
      changefreq: "monthly",
      lastmod: today,
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
