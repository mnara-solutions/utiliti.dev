import Copy from "~/components/copy";
import { useCallback, useMemo } from "react";
import Code from "~/components/code";
import { noop } from "~/common";
// import { metaHelper } from "~/utils/meta";
// import { utilities } from "~/utilities";
import Utiliti from "~/components/utiliti";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { marked } from "marked";
import DOMPurify from "dompurify";

// export const meta = metaHelper(
//   utilities.markdown.name,
//   utilities.markdown.description,
// );

enum Action {
  PREVIEW = "Preview",
  HTML = "Html",
  MINIFY = "Minify",
}

function convert(markdown: string): Promise<object> {
  return new Promise((r) => {
    const html = marked(markdown);
    r(DOMPurify.sanitize(html) as unknown as object);
  });
}

function minimize(html: string): string {
  return html.replace(/\s\s+/g, " ").replace(/[\r\n]/g, "");
}

export default function MarkdownToHtml() {
  const actions = useMemo(
    () => ({
      [Action.PREVIEW]: (input: string) => convert(input),
      [Action.HTML]: (input: string) => convert(input),
      [Action.MINIFY]: (input: string) => convert(input),
    }),
    [],
  );

  const renderOutput = useCallback(
    (a: string, input: string, output: object) => {
      let html = output.toString();
      html = a === Action.MINIFY ? minimize(html) : html;
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
                <Code value={html} setValue={noop} readonly={true} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: html }} />
              )}
            </div>
          </BoxContent>
        </Box>
      );
    },
    [],
  );

  return (
    <Utiliti
      label="MarkdownToHtml"
      actions={actions}
      renderInput={(input, setInput) => (
        <div className="px-3 py-2">
          <Code
            value={input}
            setValue={setInput}
            minHeight="12rem"
            language="markdown"
            placeholder="Markdown Here"
            readonly={false}
          />
        </div>
      )}
      renderOutput={renderOutput}
      showLoadFile={true}
    />
  );
}
