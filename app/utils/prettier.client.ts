type Language = "html" | "typescript" | "css";

// Lazy load prettier and plugins only when needed (client-side only)
export async function formatWithPrettier(
  input: string,
  language: Language,
): Promise<string> {
  const [prettier, html, estree, typescript, postcss] = await Promise.all([
    import("prettier"),
    import("prettier/plugins/html"),
    import("prettier/plugins/estree"),
    import("prettier/plugins/typescript"),
    import("prettier/plugins/postcss"),
  ]);

  return prettier.format(input, {
    parser: language,
    plugins: [
      html.default,
      typescript.default,
      estree.default,
      postcss.default,
    ],
  });
}
