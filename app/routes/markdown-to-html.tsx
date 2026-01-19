import Copy from "~/components/copy";
import Code from "~/components/code.client";
import { noop } from "~/common";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Utiliti from "~/components/utiliti";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import ShadowDom from "~/components/shadow-dom";
import ReadFile from "~/components/read-file";
import { setTextInputFromFiles } from "~/utils/convert-text-file";
import { convertMarkdownToHtml, minimizeHtml } from "~/utils/markdown.client";

export const meta = metaHelper(
  utilities.markdownToHtml.name,
  "Convert Markdown to HTML instantly. Client-side processing means your documentation and notes never leave your browser.",
);

enum Action {
  PREVIEW = "Preview",
  HTML = "HTML",
  MINIFY = "Minify",
}

export default function MarkdownToHtml() {
  const actions = {
    [Action.PREVIEW]: convertMarkdownToHtml,
    [Action.HTML]: convertMarkdownToHtml,
    [Action.MINIFY]: async (input: string) =>
      minimizeHtml(await convertMarkdownToHtml(input)),
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
      <h2>Why Use Utiliti&apos;s Markdown Converter?</h2>
      <p>
        Markdown files often contain sensitive content—internal documentation,
        private notes, draft blog posts, or proprietary technical
        specifications. Many online Markdown converters send your content to
        their servers for processing.
      </p>
      <p>
        Utiliti&apos;s Markdown to HTML converter runs{" "}
        <strong>entirely in your browser</strong>. Your content never leaves
        your device, making it safe to convert:
      </p>
      <ul>
        <li>
          <strong>Internal Documentation</strong>: Company docs with sensitive
          procedures or credentials
        </li>
        <li>
          <strong>Draft Content</strong>: Unpublished blog posts or articles
        </li>
        <li>
          <strong>Personal Notes</strong>: Private notes and journals
        </li>
        <li>
          <strong>Technical Specs</strong>: Proprietary API documentation or
          architecture notes
        </li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Preview</strong>: See your rendered Markdown with full styling
          in real-time
        </li>
        <li>
          <strong>HTML Output</strong>: Get clean, properly formatted HTML code
        </li>
        <li>
          <strong>Minify</strong>: Compress the HTML output by removing
          whitespace for production use
        </li>
        <li>
          <strong>Syntax Highlighting</strong>: Input editor with Markdown
          syntax highlighting
        </li>
        <li>
          <strong>Sanitized Output</strong>: HTML is sanitized to prevent XSS
          attacks
        </li>
      </ul>

      <h2>How to Use</h2>
      <ol>
        <li>
          <strong>Paste your Markdown</strong>: Enter or paste Markdown content
          into the input field
        </li>
        <li>
          <strong>Choose output format</strong>: Click Preview to see the
          rendered result, HTML for the source code, or Minify for compressed
          output
        </li>
        <li>
          <strong>Copy the result</strong>: Use the copy button to grab your
          converted HTML
        </li>
      </ol>

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

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>README Files</strong>: Preview how your GitHub README will
          look before committing
        </li>
        <li>
          <strong>Blog Posts</strong>: Convert Markdown drafts to HTML for CMS
          platforms
        </li>
        <li>
          <strong>Email Templates</strong>: Generate HTML from Markdown for
          email newsletters
        </li>
        <li>
          <strong>Documentation</strong>: Convert technical docs to HTML for
          static site generators
        </li>
        <li>
          <strong>Note Export</strong>: Convert notes from Markdown-based apps
          to HTML format
        </li>
      </ul>

      <h2>Supported Markdown Features</h2>
      <p>
        Our converter supports standard Markdown syntax including headings,
        bold/italic text, links, images, code blocks, blockquotes, ordered and
        unordered lists, horizontal rules, and inline HTML. The output is
        sanitized using DOMPurify to ensure safe HTML that&apos;s free from XSS
        vulnerabilities.
      </p>
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
