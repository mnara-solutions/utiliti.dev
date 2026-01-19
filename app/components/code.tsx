import { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import hljs from "highlight.js/lib/core";

type Language =
  | "sql"
  | "javascript"
  | "markdown"
  | "xml"
  | "css"
  | "typescript";

const languageImports: Record<Language, () => Promise<{ default: unknown }>> = {
  javascript: () => import("highlight.js/lib/languages/javascript"),
  sql: () => import("highlight.js/lib/languages/sql"),
  markdown: () => import("highlight.js/lib/languages/markdown"),
  xml: () => import("highlight.js/lib/languages/xml"),
  css: () => import("highlight.js/lib/languages/css"),
  typescript: () => import("highlight.js/lib/languages/typescript"),
};

const loadedLanguages = new Set<Language>();

async function loadLanguage(language: Language): Promise<void> {
  if (loadedLanguages.has(language)) {
    return;
  }

  const languageModule = await languageImports[language]();
  hljs.registerLanguage(
    language,
    languageModule.default as Parameters<typeof hljs.registerLanguage>[1],
  );
  loadedLanguages.add(language);
}

interface Props {
  readonly readonly: boolean;
  readonly value: string;
  readonly setValue: (value: string) => void;
  readonly minHeight?: string;
  readonly language?: Language;
  readonly placeholder?: string;
}

export default function Code({
  readonly,
  value,
  setValue,
  minHeight,
  language = "javascript",
  placeholder = "Paste some JSON…",
}: Props) {
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(
    loadedLanguages.has(language),
  );

  useEffect(() => {
    if (loadedLanguages.has(language)) {
      setIsLanguageLoaded(true);
      return;
    }

    let cancelled = false;

    loadLanguage(language).then(() => {
      if (!cancelled) {
        setIsLanguageLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [language]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CodeEditor = (Editor as any).default || Editor;

  const highlight = (code: string) => {
    if (!isLanguageLoaded) {
      return code;
    }
    return hljs.highlight(code, { language }).value;
  };

  return (
    <CodeEditor
      value={value}
      onValueChange={setValue}
      highlight={highlight}
      placeholder={placeholder}
      style={{
        fontFamily: '"Fira code", monospace',
        minHeight,
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      }}
      textareaClassName="w-full font-mono placeholder-zinc-400"
      readOnly={readonly}
    />
  );
}
