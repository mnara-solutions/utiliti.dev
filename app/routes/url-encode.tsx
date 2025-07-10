import SimpleOutput from "~/components/simple-output";
import { useCallback, useMemo } from "react";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Utiliti from "~/components/utiliti";

export const meta = metaHelper(
  utilities.base64.name,
  utilities.base64.description,
);

enum Action {
  ENCODE = "Encode",
  DECODE = "Decode",
}

const decode = (text: string): Promise<string> => {
  return Promise.resolve(decodeURIComponent(text));
};

const encode = (text: string): Promise<string> => {
  let value = encodeURIComponent(text);
  value = value.replace(/'/g, "%27"); // Encode single quotes
  return Promise.resolve(value);
};

export default function UrlEncode() {
  const renderOutput = useCallback(
    (a: string, input: string, output: string) => {
      return <SimpleOutput output={output} />;
    },
    [],
  );

  const actions = useMemo(
    () => ({
      [Action.ENCODE]: (input: string) => encode(input),
      [Action.DECODE]: (input: string) => decode(input),
    }),
    [],
  );

  const renderInput = useCallback(
    (input: string, setInput: (v: string) => void) => (
      <textarea
        id="input"
        rows={10}
        className="block font-mono w-full px-3 py-2 lg:text-sm border-0 bg-zinc-800 focus:ring-0 placeholder-zinc-400"
        placeholder="Paste in your content…"
        required={true}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
    ),
    [],
  );

  const renderExplanation = useCallback(
    () => (
      <>
        <h2>What is UrlEncode/UrlDecode</h2>

        <p>
          URL encoding, also known as percent encoding, is a mechanism used to
          encode information in a Uniform Resource Locator (URL) so that it can
          be safely transmitted over the internet. URLs can only contain a
          limited set of characters; characters such as spaces, punctuation
          marks, or non-ASCII characters must be converted to a format that is
          universally accepted in web addresses.
        </p>

        <p>
          The process involves replacing unsafe or reserved characters with a
          '%' symbol followed by two hexadecimal digits representing the ASCII
          code of the character. For example, a space character is encoded as{" "}
          <code>%20</code>, and a plus sign '+' is encoded as <code>%2B</code>.
        </p>

        <ol>
          <li>
            <strong>Query Parameters:</strong> URL encoding is commonly used
            when including data in the query string of a URL, ensuring that
            special characters don't interfere with URL parsing.
          </li>

          <li>
            <strong>Form Submissions:</strong> Web browsers use URL encoding
            when submitting form data via HTTP GET or POST, encoding user input
            to be safely transmitted.
          </li>

          <li>
            <strong>APIs and Web Services:</strong> URL encoding is used when
            passing parameters in API requests to ensure compatibility and
            prevent errors with reserved characters.
          </li>

          <li>
            <strong>File and Path Names:</strong> URL encoding ensures that file
            names or paths containing spaces or special symbols can be included
            in URLs without causing problems.
          </li>
        </ol>

        <p>
          Decoding, or URL decoding, is the reverse process: it converts the
          percent-encoded characters back to their original form, making the
          data usable in its original context.
        </p>

        <p>Here is a simple example:</p>

        <p>
          Original string: <code>Hello World!</code>
        </p>

        <p>
          URL-encoded: <code>Hello%20World%21</code>
        </p>

        <p>
          It's important to note that URL encoding is not a form of encryption
          or security; it simply ensures that data can be safely and reliably
          transmitted in URLs, preserving the meaning and structure of the
          original content.
        </p>
      </>
    ),
    [],
  );

  return (
    <Utiliti
      label="Url Encode/Decode"
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
      renderExplanation={renderExplanation}
    />
  );
}
