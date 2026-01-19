// Lazy load marked and dompurify only when needed (client-side only)
export async function convertMarkdownToHtml(markdown: string): Promise<string> {
  const [{ marked }, DOMPurify] = await Promise.all([
    import("marked"),
    import("dompurify").then((m) => m.default),
  ]);

  const html = await marked(markdown);

  return DOMPurify.sanitize(html).toString();
}

export function minimizeHtml(html: string): string {
  return html.replace(/\s\s+/g, " ").replace(/[\r\n]/g, "");
}
