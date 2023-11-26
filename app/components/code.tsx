import Editor from "react-simple-code-editor";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import sql from "highlight.js/lib/languages/sql";
import markdown from "highlight.js/lib/languages/markdown";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("xml", xml);

interface Props {
  readonly readonly: boolean;
  readonly value: string;
  readonly setValue: (value: string) => void;
  readonly minHeight?: string;
  readonly language?: "sql" | "javascript" | "markdown" | "xml";
  readonly placeholder?: string;
}

export default function Code({
  readonly,
  value,
  setValue,
  minHeight,
  language = "javascript",
  placeholder = "Paste some json…",
}: Props) {
  const CodeEditor = (Editor as any).default;
  return (
    <CodeEditor
      value={value}
      onValueChange={setValue}
      highlight={(code: string) => hljs.highlight(code, { language }).value}
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
