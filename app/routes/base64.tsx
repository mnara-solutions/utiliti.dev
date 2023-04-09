import * as b64 from "base64-encoding";
import { EncoderDecoderOutput } from "~/components/encoder-decoder-output";
import { useCallback, useMemo, useState } from "react";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { BoxOptions } from "~/components/box";
import { Utiliti } from "~/components/utiliti";

export const meta = metaHelper(
  utilities.base64.name,
  utilities.base64.description
);

enum Action {
  ENCODE = "Encode",
  DECODE = "Decode",
}

async function decode(text: string): Promise<string> {
  try {
    const decoder = await new b64.Base64Decoder().optimize();

    return new TextDecoder().decode(decoder.decode(text));
  } catch (e) {
    return Promise.reject({ message: (e as DOMException).message });
  }
}

export default function Base64() {
  const [urlSafe, setUrlSafe] = useState(false);

  const renderOutput = useCallback(
    (a: string, input: string, output: string) => {
      return <EncoderDecoderOutput output={output} />;
    },
    []
  );

  const encode = useCallback(
    async (text: string) => {
      try {
        const encoder = await new b64.Base64Encoder({
          url: urlSafe,
        }).optimize();

        return encoder.encode(new TextEncoder().encode(text));
      } catch (e) {
        return Promise.reject({ message: (e as DOMException).message });
      }
    },
    [urlSafe]
  );

  const actions = useMemo(
    () => ({
      [Action.ENCODE]: (input: string) => encode(input),
      [Action.DECODE]: (input: string) => decode(input),
    }),
    [encode]
  );

  return (
    <Utiliti
      label="Base64"
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
      showLoadFile={true}
      renderOptions={() => (
        <BoxOptions>
          <div className="flex items-center h-5 w-5 ml-2">
            <input
              id="url-safe"
              type="checkbox"
              checked={urlSafe}
              className="w-4 h-4 border rounded focus:ring-3 bg-zinc-700 border-zinc-600 focus:ring-orange-600 ring-offset-zinc-800 focus:ring-offset-zinc-800 text-orange-600"
              onChange={(e) => setUrlSafe(e.target.checked)}
            />
          </div>
          <label
            htmlFor="url-safe"
            className="ml-2 text-sm font-medium text-gray-300"
          >
            URL Safe
          </label>
        </BoxOptions>
      )}
    />
  );
}
