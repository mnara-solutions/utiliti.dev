import Button from "~/components/button";
import { useCallback, useRef, useState } from "react";
import type { MetaFunction } from "@remix-run/cloudflare";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import { copyText } from "~/utils/copy";
import * as b64 from "base64-encoding";
import ReadFile from "~/components/read-file";

export const meta: MetaFunction = () => ({
  title: "Base64 | Utiliti",
});

export default function Base64() {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlSafe, setUrlSafe] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const encode = useCallback(async () => {
    if (!inputRef.current) {
      return;
    }

    try {
      const encoder = await new b64.Base64Encoder({ url: urlSafe }).optimize();

      setOutput(
        encoder.encode(new TextEncoder().encode(inputRef.current.value || ""))
      );
      setError(null);
    } catch (e) {
      setError((e as DOMException).message);
      setOutput(null);
    }
  }, [setOutput, urlSafe]);

  const decode = useCallback(async () => {
    if (!inputRef.current) {
      return;
    }

    try {
      const decoder = await new b64.Base64Decoder().optimize();

      setOutput(
        new TextDecoder().decode(decoder.decode(inputRef.current.value || ""))
      );
      setError(null);
    } catch (e) {
      setError((e as DOMException).message);
      setOutput(null);
    }
  }, [setOutput]);

  return (
    <>
      <h1>base64</h1>

      <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600">
          <div className="font-bold">Input</div>
          <div>
            <button
              type="button"
              className="p-2 rounded cursor-pointer sm:ml-auto text-zinc-400 hover:text-white hover:bg-zinc-600"
              onClick={() => {
                copyText(inputRef.current?.value || "");
              }}
            >
              <DocumentDuplicateIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Copy to clipboard</span>
            </button>
          </div>
        </div>
        <div className="px-4 py-2 bg-zinc-800">
          <label htmlFor="input" className="sr-only">
            Your input
          </label>
          <textarea
            id="input"
            ref={inputRef}
            rows={4}
            className="w-full px-0 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
            placeholder="Paste in your content..."
            required={true}
          ></textarea>
        </div>
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
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-600">
          <div>
            <ReadFile
              accept="text/plain"
              onLoad={(text) => {
                if (inputRef.current) {
                  inputRef.current.value = text;
                }
              }}
            />
          </div>

          <div className="flex gap-x-2">
            <Button onClick={encode} label="encode" />
            <Button onClick={decode} label="decode" />
          </div>
        </div>
      </div>

      <div className="h-4" />

      <Transition
        show={output != null || error != null}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        {error ? (
          <div
            className="p-4 mb-4 text-sm rounded-lg bg-zinc-700 text-red-500"
            role="alert"
          >
            <span className="font-medium">Error: </span> {error}
          </div>
        ) : (
          <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600 font-bold">
              <div>Output</div>
              <div>
                <button
                  type="button"
                  className="p-2 rounded cursor-pointer sm:ml-auto text-zinc-400 hover:text-white hover:bg-zinc-600"
                  onClick={() => copyText(output || "")}
                >
                  <DocumentDuplicateIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Copy to clipboard</span>
                </button>
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-800 rounded-b-lg">
              <label htmlFor="input" className="sr-only">
                Your output
              </label>
              <textarea
                id="output"
                rows={4}
                className="w-full px-0 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
                placeholder="Paste in your content..."
                readOnly={true}
                value={output || ""}
              />
            </div>
          </div>
        )}
      </Transition>
    </>
  );
}
