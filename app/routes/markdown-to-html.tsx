import Copy from "~/components/copy";
import { useCallback, useMemo } from "react";
import Code from "~/components/code";
import { noop } from "~/common";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Utiliti from "~/components/utiliti";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { marked } from "marked";
import DOMPurify from "dompurify";
import ShadowDom from "~/components/shadow-dom";
import ReadFile from "~/components/read-file";

export const meta = metaHelper(
  utilities.markdownToHtml.name,
  utilities.markdownToHtml.description,
);

enum Action {
  PREVIEW = "Preview",
  HTML = "HTML",
  MINIFY = "Minify",
}

async function convert(markdown: string): Promise<string> {
  const html = marked(markdown);

  return DOMPurify.sanitize(html).toString();
}

function minimize(html: string): string {
  return html.replace(/\s\s+/g, " ").replace(/[\r\n]/g, "");
}

export default function MarkdownToHtml() {
  const actions = useMemo(
    () => ({
      [Action.PREVIEW]: convert,
      [Action.HTML]: convert,
      [Action.MINIFY]: async (input: string) => minimize(await convert(input)),
    }),
    [],
  );

  const renderInput = useCallback(
    (input: string, setInput: (v: string) => void) => (
      <div className="px-3 py-2">
        <Code
          value={input}
          setValue={setInput}
          minHeight="12rem"
          language="markdown"
          placeholder="Paste some markdown…"
          readonly={false}
        />
      </div>
    ),
    [],
  );

  const renderOutput = useCallback(
    (a: string, input: string, output: string) => {
      return (
        <Box>
          <BoxTitle title="Output">
            <div>
              <Copy content={output.toString()} />
            </div>
          </BoxTitle>
          <BoxContent isLast={true}>
            <div className="px-3 py-2">
              {a === Action.HTML || a === Action.MINIFY ? (
                <Code
                  value={output}
                  setValue={noop}
                  language="xml"
                  readonly={true}
                />
              ) : (
                <ShadowDom content={output} />
              )}
            </div>
          </BoxContent>
        </Box>
      );
    },
    [],
  );

  const renderReadFile = useCallback((setInput: (value: string) => void) => {
    return <ReadFile accept=".md" onLoad={setInput} />;
  }, []);

  return (
    <Utiliti
      label="Markdown To HTML"
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
      renderReadFile={renderReadFile}
    />
  );
}
