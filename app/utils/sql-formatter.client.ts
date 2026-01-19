type KeywordCase = "preserve" | "upper" | "lower";

let formatterModule: typeof import("sql-formatter") | null = null;

// Lazy load sql-formatter only when needed (client-side only)
export async function formatSql(
  input: string,
  options: {
    tabWidth?: number;
    keywordCase?: KeywordCase;
  } = {}
): Promise<string> {
  if (!formatterModule) {
    formatterModule = await import("sql-formatter");
  }

  return formatterModule.format(input, {
    tabWidth: options.tabWidth ?? 2,
    keywordCase: options.keywordCase ?? "upper",
  });
}
