import Copy from "~/components/copy";
import Code from "~/components/code";
import { noop } from "~/common";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Utiliti from "~/components/utiliti";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import ReadFile from "~/components/read-file";
import { setTextInputFromFiles } from "~/utils/convert-text-file";
import { useLocalStorage } from "~/hooks/use-local-storage";
import Dropdown from "~/components/dropdown";
import { formatWithPrettier } from "~/utils/prettier.client";

export const meta = metaHelper(
  utilities.prettier.name,
  "Format HTML, TypeScript, and CSS code instantly with Prettier. Client-side processing means your code stays private and never leaves your browser.",
);

const languages = {
  html: "HTML",
  typescript: "TypeScript",
  css: "CSS",
};

type Language = keyof typeof languages;

export default function Prettier() {
  const [language, setLanguage] = useLocalStorage<Language>(
    "prettier-language",
    "html",
  );

  const actions = {
    ["Format"]: async (input: string) => formatWithPrettier(input, language),
  };

  const renderInput = (input: string, setInput: (v: string) => void) => (
    <div className="px-3 py-2">
      <Code
        placeholder={`Paste some ${languages[language]}…`}
        value={input}
        setValue={setInput}
        minHeight="12rem"
        readonly={false}
        language="xml"
      />
    </div>
  );

  const renderOutput = (a: string, input: string, output: string) => {
    return (
      <Box>
        <BoxTitle title="Output">
          <div>
            <Copy content={output} />
          </div>
        </BoxTitle>
        <BoxContent isLast={true}>
          <div className="px-3 py-2">
            <Code
              value={output}
              setValue={noop}
              readonly={true}
              language={language == "html" ? "xml" : language}
            />
          </div>
        </BoxContent>
      </Box>
    );
  };

  const renderReadFile = (setInput: (value: string) => void) => {
    return (
      <div className="flex gap-x-2">
        <Dropdown
          onOptionChange={(it) => setLanguage(it as Language)}
          options={Object.entries(languages).map(([k, v]) => {
            return { id: k, label: v };
          })}
          value={language}
        />

        <ReadFile
          accept="text/plain,application/JSON"
          onLoad={(files) => setTextInputFromFiles(files, setInput)}
        />
      </div>
    );
  };

  const renderExplanation = () => (
    <>
      <h2>What is Prettier?</h2>
      <p>
        Prettier is an opinionated code formatter that enforces a consistent
        style by parsing your code and re-printing it with its own rules. Unlike
        traditional linters that only flag issues, Prettier automatically
        rewrites your code to follow best practices for indentation, line
        length, quotes, and more.
      </p>
      <p>
        Originally created for JavaScript, Prettier now supports many languages
        including TypeScript, HTML, CSS, JSON, Markdown, and more. It has become
        the industry standard for code formatting in modern web development.
      </p>

      <h2>Why Format Code in the Browser?</h2>
      <p>
        Most online code formatters send your code to their servers for
        processing. This poses a security risk—your proprietary code, API keys
        embedded in configs, or sensitive business logic could be logged or
        intercepted.
      </p>
      <p>
        Utiliti runs Prettier entirely in your browser using WebAssembly. Your
        code never leaves your device, making it safe to format:
      </p>
      <ul>
        <li>
          <strong>Proprietary Source Code</strong>: Format code from private
          repositories without exposure
        </li>
        <li>
          <strong>Configuration Files</strong>: Safely beautify configs that may
          contain sensitive values
        </li>
        <li>
          <strong>Client Projects</strong>: Work with client code without
          violating NDAs or security policies
        </li>
      </ul>

      <h2>Supported Languages</h2>
      <p>
        Our Prettier integration currently supports the most common web
        development languages:
      </p>
      <ul>
        <li>
          <strong>HTML</strong>: Format HTML markup with proper indentation and
          attribute alignment
        </li>
        <li>
          <strong>TypeScript</strong>: Format TypeScript and JavaScript code
          with consistent styling
        </li>
        <li>
          <strong>CSS</strong>: Beautify stylesheets with organized properties
          and proper nesting
        </li>
      </ul>

      <h2>How to Use</h2>
      <ol>
        <li>
          <strong>Select your language</strong>: Choose HTML, TypeScript, or CSS
          from the dropdown menu.
        </li>
        <li>
          <strong>Paste your code</strong>: Enter or paste the code you want to
          format in the input box.
        </li>
        <li>
          <strong>Click Format</strong>: Your code will be instantly formatted
          according to Prettier&apos;s rules.
        </li>
        <li>
          <strong>Copy the result</strong>: Use the copy button to grab your
          formatted code.
        </li>
      </ol>

      <h2>Why Use Prettier?</h2>
      <p>
        Prettier eliminates debates about code style in your team. By adopting
        an opinionated formatter, you get:
      </p>
      <ul>
        <li>
          <strong>Consistency</strong>: Every file follows the same formatting
          rules, regardless of who wrote it
        </li>
        <li>
          <strong>Productivity</strong>: Stop wasting time manually formatting
          code or arguing about style
        </li>
        <li>
          <strong>Cleaner Diffs</strong>: Consistent formatting means pull
          request diffs show only meaningful changes
        </li>
        <li>
          <strong>Easier Onboarding</strong>: New team members can write
          correctly-formatted code immediately
        </li>
      </ul>

      <h2>Prettier vs ESLint</h2>
      <p>
        While both tools improve code quality, they serve different purposes.
        ESLint catches bugs and enforces coding patterns (like avoiding unused
        variables), while Prettier handles purely stylistic concerns (like
        indentation and line length). Many teams use both together—ESLint for
        code quality and Prettier for formatting.
      </p>
    </>
  );

  return (
    <Utiliti
      label={utilities.prettier.name}
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
      renderReadFile={renderReadFile}
      renderExplanation={renderExplanation}
    />
  );
}
