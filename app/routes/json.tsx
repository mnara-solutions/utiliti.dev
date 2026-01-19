import { lazy } from "react";
import Copy from "~/components/copy";
import Code from "~/components/code";
import { noop } from "~/common";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";

import Utiliti from "~/components/utiliti";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import ReadFile from "~/components/read-file";
import { setTextInputFromFiles } from "~/utils/convert-text-file";

const JsonViewer = lazy(() => import("~/components/json-viewer.client"));

export const meta = metaHelper(utilities.json);

async function decode(text: string): Promise<object> {
  try {
    return JSON.parse(text);
  } catch (e) {
    return Promise.reject({ message: (e as SyntaxError).message });
  }
}

enum Action {
  VIEW = "View",
  FORMAT = "Format",
  MINIFY = "Minify",
}

export default function JSONEncoder() {
  const actions = {
    [Action.VIEW]: (input: string) => decode(input),
    [Action.FORMAT]: (input: string) => decode(input),
    [Action.MINIFY]: (input: string) => decode(input),
  };

  const renderInput = (input: string, setInput: (v: string) => void) => (
    <div className="px-3 py-2">
      <Code
        value={input}
        setValue={setInput}
        minHeight="12rem"
        readonly={false}
      />
    </div>
  );

  const renderOutput = (a: string, input: string, output: object) => {
    const content = JSON.stringify(output, null, a === "Format" ? 2 : 0);

    if (a === Action.FORMAT || a === Action.MINIFY) {
      return (
        <Box>
          <BoxTitle title="Output">
            <div>
              <Copy content={content} />
            </div>
          </BoxTitle>
          <BoxContent isLast={true}>
            <div className="px-3 py-2">
              <Code value={content} setValue={noop} readonly={true} />
            </div>
          </BoxContent>
        </Box>
      );
    }

    return <JsonViewer json={output} />;
  };

  const renderReadFile = (setInput: (value: string) => void) => {
    return (
      <ReadFile
        accept="text/plain,application/JSON"
        onLoad={(files) => setTextInputFromFiles(files, setInput)}
      />
    );
  };

  const renderExplanation = () => (
    <>
      <h2>Why Use Utiliti&apos;s JSON Tool?</h2>
      <p>
        Many online JSON formatters send your data to their servers for
        processing. This is a significant privacy risk—your JSON might contain
        API keys, authentication tokens, personal information, or proprietary
        data structures that you don&apos;t want exposed.
      </p>
      <p>
        Utiliti&apos;s JSON viewer and formatter runs{" "}
        <strong>entirely in your browser</strong>. Your data never leaves your
        device, making it safe to paste:
      </p>
      <ul>
        <li>
          <strong>API Responses</strong>: Debug responses containing user data
          or tokens
        </li>
        <li>
          <strong>Configuration Files</strong>: Format configs with credentials
          or secrets
        </li>
        <li>
          <strong>JWT Payloads</strong>: Examine decoded tokens without exposure
        </li>
        <li>
          <strong>Database Exports</strong>: View exported data safely
        </li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Tree View</strong>: Explore complex nested JSON with an
          interactive, collapsible tree structure
        </li>
        <li>
          <strong>Format</strong>: Pretty-print minified JSON with proper
          indentation for readability
        </li>
        <li>
          <strong>Minify</strong>: Compress formatted JSON to a single line for
          smaller payloads
        </li>
        <li>
          <strong>Syntax Highlighting</strong>: Color-coded display makes
          structure easy to understand
        </li>
        <li>
          <strong>Error Detection</strong>: Instantly identify syntax errors in
          malformed JSON
        </li>
      </ul>

      <h2>What is JSON?</h2>
      <p>
        JSON, which stands for JavaScript Object Notation, is a lightweight data
        interchange format that is easy for humans to read and write, and easy
        for machines to parse and generate. JSON is often used to transmit data
        between a server and a web application as an alternative to XML.
      </p>
      <p>Key characteristics of JSON include:</p>
      <ol>
        <li>
          Readable Format: JSON data is represented as key-value pairs, similar
          to JavaScript object literals. It is easy for humans to read and
          write.
        </li>

        <li>
          Data Types: JSON supports several data types, including strings,
          numbers, booleans, arrays, objects, and null.
        </li>

        <li>
          Syntax: JSON syntax is straightforward. Objects are enclosed in curly
          braces {}, arrays in square brackets [], and key-value pairs are
          separated by colons :. Commas , separate elements within objects and
          arrays.
        </li>
      </ol>
      <p>Here is a simple example of JSON:</p>

      <pre>
        &#123;{"\n"}
        {"  "}&#x22;name&#x22;: &#x22;John Doe&#x22;,{"\n"}
        {"  "}&#x22;age&#x22;: 30,{"\n"}
        {"  "}&#x22;isStudent&#x22;: false,{"\n"}
        {"  "}&#x22;courses&#x22;: [&#x22;Math&#x22;, &#x22;History&#x22;,
        &#x22;English&#x22;],{"\n"}
        {"  "}&#x22;address&#x22;: &#123;{"\n"}
        {"    "}&#x22;street&#x22;: &#x22;123 Main St&#x22;,{"\n"}
        {"    "}&#x22;city&#x22;: &#x22;Exampleville&#x22;,{"\n"}
        {"    "}&#x22;zipCode&#x22;: &#x22;12345&#x22;{"\n"}
        {"  "}&#125;{"\n"}
        &#125;
      </pre>

      <p>In this example:</p>
      <ul>
        <li>
          The JSON data represents a person with attributes such as name, age,
          whether they are a student, a list of courses, and an address.
        </li>
        <li>Strings are enclosed in double quotes.</li>
        <li>Numbers are not quoted.</li>
        <li>Booleans are represented as true or false.</li>
        <li>Arrays are ordered lists enclosed in square brackets.</li>
        <li>Objects are sets of key-value pairs enclosed in curly braces.</li>
      </ul>

      <p>
        JSON is widely used in web development for various purposes, including:
      </p>

      <ul>
        <li>
          <strong>Data Exchange</strong>: JSON is commonly used for data
          exchange between a web server and a web application. APIs often return
          data in JSON format.
        </li>

        <li>
          <strong>Configuration Files</strong>: JSON is used in configuration
          files for applications and settings.
        </li>

        <li>
          <strong>Storage</strong>: JSON is used to store and exchange data in
          NoSQL databases.
        </li>
      </ul>

      <p>
        JavaScript provides built-in methods (<code>JSON.parse()</code> and{" "}
        <code>JSON.stringify()</code>) to convert JSON data to and from
        JavaScript objects. Many programming languages also have libraries or
        built-in functions to work with JSON, making it a versatile and widely
        adopted data format for various applications.
      </p>

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>Debugging API Responses</strong>: Paste raw API responses to
          visualize the data structure and find the values you need.
        </li>
        <li>
          <strong>Validating JSON Syntax</strong>: Quickly check if your JSON is
          valid before using it in your application.
        </li>
        <li>
          <strong>Formatting for Documentation</strong>: Pretty-print JSON
          examples for README files and API documentation.
        </li>
        <li>
          <strong>Minifying for Production</strong>: Reduce JSON payload size by
          removing unnecessary whitespace.
        </li>
        <li>
          <strong>Exploring Unknown Data</strong>: Use the tree view to navigate
          complex nested structures you&apos;re unfamiliar with.
        </li>
      </ul>
    </>
  );

  return (
    <Utiliti
      label="JSON"
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
      renderReadFile={renderReadFile}
      renderExplanation={renderExplanation}
    />
  );
}
