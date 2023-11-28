import SimpleOutput from "~/components/simple-output";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { useCallback, useMemo } from "react";
import Utiliti from "~/components/utiliti";
import JsonViewer from "~/components/json-viewer";

export const meta = metaHelper(utilities.url.name, utilities.url.description);

interface JsonURL {
  readonly hash: string;
  readonly host: string;
  readonly hostname: string;
  // readonly href: string; -> removed from URL since it's repetitive in the UI
  readonly origin: string;
  readonly pathname: string;
  readonly port: string;
  readonly protocol: string;
  readonly search: string;
  readonly searchParams: Record<string, string>;
  readonly username: string;
  readonly password: string;
}

enum Action {
  VIEW = "View",
  ENCODE = "Encode",
  DECODE = "Decode",
}

async function encode(text: string): Promise<string | JsonURL> {
  return encodeURI(text);
}

async function decode(text: string): Promise<string | JsonURL> {
  return decodeURI(text);
}

async function toJson(text: string): Promise<string | JsonURL> {
  try {
    const url = new URL(text);

    return {
      hash: url.hash,
      host: url.host,
      hostname: url.hostname,
      origin: url.origin,
      password: url.password,
      pathname: url.pathname,
      port: url.port,
      protocol: url.protocol,
      search: url.search,
      searchParams: Object.fromEntries(url.searchParams),
      username: url.username,
    };
  } catch (e) {
    throw { message: "Invalid URL" };
  }
}

export default function URLRoute() {
  const actions = useMemo(
    () => ({
      [Action.VIEW]: (input: string) => toJson(input),
      [Action.ENCODE]: (input: string) => encode(input),
      [Action.DECODE]: (input: string) => decode(input),
    }),
    [],
  );

  const renderOutput = useCallback(
    (a: string, input: string, output: string | JsonURL) => {
      if (
        (a === Action.ENCODE || a === Action.DECODE) &&
        typeof output === "string"
      ) {
        return <SimpleOutput output={output} />;
      }

      return <JsonViewer json={output} />;
    },
    [],
  );

  const renderInput = useCallback(
    (input: string, setInput: (v: string) => void) => (
      <textarea
        id="input"
        rows={3}
        className="block font-mono w-full px-3 py-2 lg:text-sm border-0 bg-zinc-800 focus:ring-0 placeholder-zinc-400"
        placeholder="Paste in your URL…"
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
        <h2>What is a URL?</h2>
        <p>
          A URL, or Uniform Resource Locator, is a reference or address used to
          access resources on the internet. It's a string of characters that
          provides a way to identify and locate a particular resource, such as a
          web page, document, image, or any other file, on the World Wide Web.
        </p>

        <p>A standard URL consists of several components:</p>

        <ol>
          <li>
            <strong>Scheme</strong>: The scheme indicates the protocol used to
            access the resource. Common schemes include "http," "https," "ftp,"
            and "mailto." For example, in the URL "https://www.example.com,"
            "https" is the scheme.
          </li>

          <li>
            <strong>Hostname</strong>: The hostname identifies the domain name
            or IP address of the server hosting the resource. In the URL
            "https://www.example.com," "www.example.com" is the hostname.
          </li>

          <li>
            <strong>Port</strong>: The port number, if specified, indicates the
            specific port on the server to connect to. The default ports are
            often assumed if not explicitly mentioned (e.g., 80 for HTTP and 443
            for HTTPS).
          </li>

          <li>
            <strong>Path</strong>: The path specifies the location or route to
            the specific resource on the server. In the URL
            "https://www.example.com/path/to/resource," "/path/to/resource" is
            the path.
          </li>

          <li>
            <strong>Query Parameters</strong>: Query parameters are additional
            information sent to the server, often in the form of key-value
            pairs, to modify the request or provide additional data. They appear
            after a question mark (?) in the URL. For example, in the URL
            "https://www.example.com/search?q=query," "?q=query" represents the
            query parameter.
          </li>

          <li>
            <strong>Fragment</strong>: The fragment, indicated by a hash (#)
            symbol, specifies a specific section within the resource. It is
            often used in web pages to navigate to a particular section. For
            example, in the URL "https://www.example.com/page#section,"
            "#section" is the fragment.
          </li>
        </ol>

        <p>Here's an example of a complete URL:</p>

        <pre>
          https://www.example.com:8080/path/to/resource?param1=value1&param2=value2#section
        </pre>

        <p>In this example:</p>
        <ul>
          <li>
            <strong>Scheme</strong>: "https"
          </li>
          <li>
            <strong>Hostname</strong>: "www.example.com"
          </li>
          <li>
            <strong>Port</strong>: "8080"
          </li>
          <li>
            <strong>Path</strong>: "/path/to/resource"
          </li>
          <li>
            <strong>Query Parameters</strong>: "param1=value1" and
            "param2=value2"
          </li>
          <li>
            <strong>Fragment</strong>: "section"
          </li>
        </ul>
        <p>
          URLs are used in web browsers to access websites, and they are also
          utilized in various internet protocols and applications for resource
          identification and retrieval.
        </p>
      </>
    ),
    [],
  );

  return (
    <Utiliti
      label="URL"
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
      renderExplanation={renderExplanation}
    />
  );
}
