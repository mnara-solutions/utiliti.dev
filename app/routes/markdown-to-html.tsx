import Copy from "~/components/copy";
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
import { setTextInputFromFiles } from "~/utils/convert-text-file";

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
  const html = await marked(markdown);

  return DOMPurify.sanitize(html).toString();
}

function minimize(html: string): string {
  return html.replace(/\s\s+/g, " ").replace(/[\r\n]/g, "");
}

export default function MarkdownToHtml() {
  const actions = {
    [Action.PREVIEW]: convert,
    [Action.HTML]: convert,
    [Action.MINIFY]: async (input: string) => minimize(await convert(input)),
  };

  const renderInput = (input: string, setInput: (v: string) => void) => (
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
  );

  const renderOutput = (a: string, input: string, output: string) => {
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
  };

  const renderReadFile = (setInput: (value: string) => void) => {
    return (
      <ReadFile
        accept=".md"
        onLoad={(files) => setTextInputFromFiles(files, setInput)}
      />
    );
  };

  const renderExplanation = () => (
    <>
      <h2>What is markdown?</h2>
      <p>
        Markdown is a lightweight markup language that is easy to read and
        write. It is often used to format plain text documents for web content.
        The main goal of Markdown is to be easily converted to HTML, making it a
        popular choice for creating content for websites, documentation, and
        other applications where simple formatting is needed.
      </p>
      <p>
        In Markdown, you use special characters and symbols to indicate
        formatting elements. For example, you can use asterisks or underscores
        to denote emphasis or bold text, hash symbols for headers, and dashes or
        asterisks for creating lists.
      </p>

      <p>Here are a few examples of Markdown syntax:</p>

      <pre>
        # Heading 1{"\n"}
        ## Heading 2{"\n"}
        ### Heading 3{"\n"}
        {"\n"}
        *italic text*{"\n"}
        **bold text**{"\n"}
        [Link](https://www.example.com){"\n"}- List item 1{"\n"}- List item 2
        {"\n"}
        {"    "}- Sublist item{"\n"}
        {"\n"}
        1. Ordered item 1{"\n"}
        2. Ordered item 2{"\n"}
      </pre>

      <p>
        When this Markdown code is converted to HTML, it would produce the
        following:
      </p>

      <pre>
        &#x3C;h1&#x3E;Heading 1&#x3C;/h1&#x3E;{"\n"}
        &#x3C;h2&#x3E;Heading 2&#x3C;/h2&#x3E;{"\n"}
        &#x3C;h3&#x3E;Heading 3&#x3C;/h3&#x3E;{"\n"}
        {"\n"}
        &#x3C;p&#x3E;&#x3C;em&#x3E;italic text&#x3C;/em&#x3E;&#x3C;/p&#x3E;
        {"\n"}
        &#x3C;p&#x3E;&#x3C;strong&#x3E;bold
        text&#x3C;/strong&#x3E;&#x3C;/p&#x3E;{"\n"}
        &#x3C;a href=&#x22;https://www.example.com&#x22;&#x3E;Link&#x3C;/a&#x3E;
        {"\n"}
        &#x3C;ul&#x3E;{"\n"}
        {"  "}&#x3C;li&#x3E;List item 1&#x3C;/li&#x3E;{"\n"}
        {"  "}&#x3C;li&#x3E;List item 2{"\n"}
        {"    "}&#x3C;ul&#x3E;{"\n"}
        {"      "}&#x3C;li&#x3E;Sublist item&#x3C;/li&#x3E;{"\n"}
        {"    "}&#x3C;/ul&#x3E;{"\n"}
        {"  "}&#x3C;/li&#x3E;{"\n"}
        &#x3C;/ul&#x3E;{"\n"}
        {"\n"}
        &#x3C;ol&#x3E;{"\n"}
        {"  "}&#x3C;li&#x3E;Ordered item 1&#x3C;/li&#x3E;{"\n"}
        {"  "}&#x3C;li&#x3E;Ordered item 2&#x3C;/li&#x3E;{"\n"}
        &#x3C;/ol&#x3E;{"\n"}
      </pre>
    </>
  );

  return (
    <Utiliti
      label="Markdown To HTML"
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
      renderReadFile={renderReadFile}
      renderExplanation={renderExplanation}
    />
  );
}
