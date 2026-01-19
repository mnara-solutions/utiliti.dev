import SimpleOutput from "~/components/simple-output";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Utiliti from "~/components/utiliti";
import { lazy } from "react";

const JsonViewer = lazy(() => import("~/components/json-viewer.client"));

export const meta = metaHelper(utilities.url);

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

//the usage of this function expects a protocol in the url, so we need to add the protocol if its not in the text
function textToUrl(text: string) {
  // decode encoded text - we check index of "://" since it could be https or http
  if (text.indexOf("%3A%2F%2F") <= 5) {
    return decodeURIComponent(text);
  // if text starts with http (or https), we return text as is 
  } else if (text.startsWith("http")) {
    return text;
  }
  // if text does not include protocol, we add it.
  return `https://${text}`;
}

async function encode(text: string): Promise<string | JsonURL> {
  const url = textToUrl(text);

  try {
    return encodeURI(url);
  } catch {
    return encodeURIComponent(url);
  }
}

async function decode(text: string): Promise<string | JsonURL> {
  const url = textToUrl(text);

  try {
    return decodeURI(url);
  } catch {
    return decodeURIComponent(url);
  }
}

async function toJson(text: string): Promise<string | JsonURL> {
  try {
    const url = new URL(textToUrl(text));

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
  } catch {
    throw { message: "Invalid URL." };
  }
}

export default function URLRoute() {
  const actions = {
    [Action.VIEW]: (input: string) => toJson(input),
    [Action.ENCODE]: (input: string) => encode(input),
    [Action.DECODE]: (input: string) => decode(input),
  };

  const renderOutput = (a: string, input: string, output: string | JsonURL) => {
    if (
      (a === Action.ENCODE || a === Action.DECODE) &&
      typeof output === "string"
    ) {
      return <SimpleOutput output={output} />;
    }

    return <JsonViewer json={output} />;
  };

  const renderInput = (input: string, setInput: (v: string) => void) => (
    <textarea
      id="input"
      rows={3}
      className="block font-mono w-full px-3 py-2 lg:text-sm border-0 bg-zinc-800 focus:ring-0 placeholder-zinc-400"
      placeholder="Paste in your URL…"
      required={true}
      value={input}
      onChange={(e) => setInput(e.target.value)}
    ></textarea>
  );

  const renderExplanation = () => (
    <>
      <h2>Why Use Utiliti&apos;s URL Tool?</h2>
      <p>
        URLs often contain sensitive information—authentication tokens, API
        keys, user IDs, session parameters, or tracking data. Many online URL
        encoders send your URLs to their servers for processing, potentially
        exposing this sensitive data.
      </p>
      <p>
        Utiliti&apos;s URL encoder and decoder runs{" "}
        <strong>entirely in your browser</strong>. Your URLs never leave your
        device, making it safe to work with:
      </p>
      <ul>
        <li>
          <strong>OAuth Callbacks</strong>: URLs containing authorization codes
          or tokens
        </li>
        <li>
          <strong>API Endpoints</strong>: URLs with API keys or authentication
          parameters
        </li>
        <li>
          <strong>Tracking URLs</strong>: Marketing URLs with campaign data you
          want to inspect
        </li>
        <li>
          <strong>Debug URLs</strong>: URLs from error logs that may contain
          user data
        </li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>View</strong>: Parse any URL into its components (protocol,
          host, path, query parameters, fragment) displayed in an interactive
          tree view
        </li>
        <li>
          <strong>Encode</strong>: Convert special characters to percent-encoded
          format for safe URL transmission
        </li>
        <li>
          <strong>Decode</strong>: Convert percent-encoded URLs back to
          human-readable format
        </li>
        <li>
          <strong>Auto-detection</strong>: Automatically detects if input is
          already encoded and handles it appropriately
        </li>
      </ul>

      <h2>How to Use</h2>
      <ol>
        <li>
          <strong>Paste your URL</strong>: Enter any URL—encoded or decoded—into
          the input field
        </li>
        <li>
          <strong>Choose an action</strong>: Click View to parse it, Encode to
          percent-encode it, or Decode to convert it back to readable text
        </li>
        <li>
          <strong>Copy the result</strong>: Use the copy button to grab your
          processed URL
        </li>
      </ol>

      <h2>What is a URL?</h2>
      <p>
        A URL, or Uniform Resource Locator, is a reference or address used to
        access resources on the internet. It&apos;s a string of characters that
        provides a way to identify and locate a particular resource, such as a
        web page, document, image, or any other file, on the World Wide Web.
      </p>

      <p>A standard URL consists of several components:</p>

      <ol>
        <li>
          <strong>Scheme</strong>: The scheme indicates the protocol used to
          access the resource. Common schemes include &quot;http&quot;,
          &quot;https&quot;, &quot;ftp&quot;, and &quot;mailto&quot;. For
          example, in the URL &quot;https://www.example.com&quot;,
          &quot;https&quot; is the scheme.
        </li>

        <li>
          <strong>Hostname</strong>: The hostname identifies the domain name or
          IP address of the server hosting the resource. In the URL
          &quot;https://www.example.com&quot;, &quot;www.example.com&quot; is
          the hostname.
        </li>

        <li>
          <strong>Port</strong>: The port number, if specified, indicates the
          specific port on the server to connect to. The default ports are often
          assumed if not explicitly mentioned (e.g., 80 for HTTP and 443 for
          HTTPS).
        </li>

        <li>
          <strong>Path</strong>: The path specifies the location or route to the
          specific resource on the server. In the URL
          &quot;https://www.example.com/path/to/resource&quot;,
          &quot;/path/to/resource&quot; is the path.
        </li>

        <li>
          <strong>Query Parameters</strong>: Query parameters are additional
          information sent to the server, often in the form of key-value pairs,
          to modify the request or provide additional data. They appear after a
          question mark (?) in the URL. For example, in the URL
          &quot;https://www.example.com/search?q=query&quot;,
          &quot;?q=query&quot; represents the query parameter.
        </li>

        <li>
          <strong>Fragment</strong>: The fragment, indicated by a hash (#)
          symbol, specifies a specific section within the resource. It is often
          used in web pages to navigate to a particular section. For example, in
          the URL &quot;https://www.example.com/page#section&quot;,
          &quot;#section&quot; is the fragment.
        </li>
      </ol>

      <p>Here&apos;s an example of a complete URL:</p>

      <pre>
        https://www.example.com:8080/path/to/resource?param1=value1&param2=value2#section
      </pre>

      <p>In this example:</p>
      <ul>
        <li>
          <strong>Scheme</strong>: &quot;https&quot;
        </li>
        <li>
          <strong>Hostname</strong>: &quot;www.example.com&quot;
        </li>
        <li>
          <strong>Port</strong>: &quot;8080&quot;
        </li>
        <li>
          <strong>Path</strong>: &quot;/path/to/resource&quot;
        </li>
        <li>
          <strong>Query Parameters</strong>: &quot;param1=value1&quot; and
          &quot;param2=value2&quot;
        </li>
        <li>
          <strong>Fragment</strong>: &quot;section&quot;
        </li>
      </ul>
      <p>
        URLs are used in web browsers to access websites, and they are also
        utilized in various internet protocols and applications for resource
        identification and retrieval.
      </p>

      <h2>What is URL Encoding?</h2>
      <p>
        URL encoding, also known as percent-encoding, is a mechanism for
        encoding special characters in a URL. Since URLs can only contain a
        limited set of characters (letters, digits, and a few special
        characters), any other characters must be encoded.
      </p>
      <p>
        For example, a space becomes <code>%20</code>, an ampersand becomes{" "}
        <code>%26</code>, and a question mark becomes <code>%3F</code>. This
        ensures that URLs remain valid and can be transmitted correctly across
        the internet.
      </p>

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>Debugging API Calls</strong>: Decode URLs from network logs to
          see what parameters were actually sent
        </li>
        <li>
          <strong>Building Query Strings</strong>: Properly encode parameter
          values before constructing URLs
        </li>
        <li>
          <strong>Analyzing Redirects</strong>: Parse complex redirect URLs to
          understand the flow
        </li>
        <li>
          <strong>Inspecting Deep Links</strong>: Break down mobile app deep
          links to understand their structure
        </li>
        <li>
          <strong>Fixing Broken URLs</strong>: Identify encoding issues in URLs
          that aren&apos;t working correctly
        </li>
      </ul>
    </>
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
