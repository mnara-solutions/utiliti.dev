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

function encode(text: string): Promise<string | JsonURL> {
  return Promise.resolve(encodeURI(text));
}

function decode(text: string): Promise<string | JsonURL> {
  return Promise.resolve(decodeURI(text));
}

function toJson(text: string): Promise<string | JsonURL> {
  const url = new URL(text);

  return Promise.resolve({
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
  });
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

  return (
    <Utiliti
      label="URL"
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
    />
  );
}
