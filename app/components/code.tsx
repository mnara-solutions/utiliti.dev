import Editor from "react-simple-code-editor";
import hljs from "highlight.js/lib/core";
import { useEffect, useState, useRef } from "react";

type Language =
  | "sql"
  | "javascript"
  | "markdown"
  | "xml"
  | "css"
  | "typescript";

// Track which languages have been registered to avoid re-registering
const registeredLanguages = new Set<Language>();

// Lazy load and register a highlight.js language
async function loadLanguage(language: Language): Promise<void> {
  if (registeredLanguages.has(language)) {
    return;
  }

  const languageModule = await import(
    /* webpackChunkName: "hljs-[request]" */
    `highlight.js/lib/languages/${language}`
  );

  hljs.registerLanguage(language, languageModule.default);
  registeredLanguages.add(language);
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
    registeredLanguages.has(language),
  );
  const loadingRef = useRef<Language | null>(null);

  // Load the language module when it changes
  useEffect(() => {
    if (registeredLanguages.has(language)) {
      setIsLanguageLoaded(true);
      return;
    }

    // Prevent duplicate loads
    if (loadingRef.current === language) {
      return;
    }

    loadingRef.current = language;
    setIsLanguageLoaded(false);

    loadLanguage(language).then(() => {
      if (loadingRef.current === language) {
        setIsLanguageLoaded(true);
      }
    });
  }, [language]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CodeEditor = (Editor as any).default || Editor;

  // Highlight function that only uses hljs when the language is loaded
  const highlight = (code: string) => {
    if (isLanguageLoaded) {
      return hljs.highlight(code, { language }).value;
    }
    // Return escaped HTML while language is loading
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  return (
    <CodeEditor
      value={value}
      onValueChange={setValue}
      highlight={highlight}
      placeholder={placeholder}
      style={{
        fontFamily: '"Fira Code", monospace',
        minHeight,
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      }}
      textareaClassName="w-full font-mono placeholder-zinc-400"
      readOnly={readonly}
    />
  );
}
