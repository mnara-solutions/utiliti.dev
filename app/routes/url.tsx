import { EncoderDecoderOutput } from "~/components/encoder-decoder-output";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { useCallback, useMemo } from "react";
import Copy from "~/components/copy";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import { Utiliti } from "~/components/utiliti";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { URLJsonFormatData } from "~/types/url";
import { JsonViewerOutput } from "~/components/json-viewer-output";

export const meta = metaHelper(utilities.url.name, utilities.url.description);

enum Action {
  toJson = "toJson",
  Encode = "Encode",
  Decode = "Decode",
}

function encode(text: string): string {
  return encodeURI(text);
}

function decode(text: string): string {
  return decodeURI(text);
}

function toJson(text: string) {
  const url = new URL(text);

  const data: URLJsonFormatData = {
    hash: url.hash,
    host: url.host,
    hostname: url.hostname,
    href: url.href,
    origin: url.origin,
    password: url.password,
    pathname: url.pathname,
    port: url.port,
    protocol: url.protocol,
    search: url.search,
    searchParams: Object.fromEntries(url.searchParams),
    username: url.username,
  };

  return data;
}

export default function URLRoute() {
  const actions = useMemo(
    () => ({
      Encode: (input: string) => encode(input),
      Decode: (input: string) => decode(input),
      toJson: (input: string) => toJson(input),
    }),
    [decode, encode, toJson]
  );

  const renderOutput = useCallback(
    (a: string, input: string, output: string) => {
      if (a === Action.Encode || a === Action.Decode) {
        return <EncoderDecoderOutput output={output} />;
      }

      const toCopy = JSON.stringify(output);
      return <JsonViewerOutput toCopy={toCopy} output={output} />;
    },
    []
  );

  return (
    <Utiliti
      label="URL"
      actions={actions}
      renderInput={(input, setInput) => (
        <textarea
          id="input"
          rows={3}
          className="block font-mono w-full px-3 py-2 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
          placeholder="Paste in your content…"
          required={true}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      )}
      renderOutput={renderOutput}
      showLoadFile={false}
    />
  );
}
