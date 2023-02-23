import type { MetaFunction } from "@remix-run/cloudflare";
import * as b64 from "base64-encoding";
import EncoderDecoder from "~/components/encoder-decoder";
import { useCallback, useState } from "react";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";

export const meta: MetaFunction = () =>
  metaHelper(utilities.base64.name, utilities.base64.description);

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

  return (
    <EncoderDecoder
      label="Base64"
      encode={encode}
      decode={decode}
      showLoadFile={true}
      rows={10}
      renderOptions={() => (
        <div className="flex px-5 py-2 border-t border-gray-600 bg-zinc-800/50">
          <div className="flex items-center h-5 w-5">
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
        </div>
      )}
    />
  );
}
