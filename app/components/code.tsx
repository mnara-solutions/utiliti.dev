import Editor from "react-simple-code-editor";
// @ts-ignore
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";

interface Props {
  readonly readonly: boolean;
  readonly value: string;
  readonly setValue: (value: string) => void;
  readonly minHeight?: string;
}
export default function Code({ readonly, value, setValue, minHeight }: Props) {
  return (
    <Editor
      value={value}
      onValueChange={setValue}
      highlight={(code) => highlight(code, languages.js)}
      placeholder="Paste some json…"
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
