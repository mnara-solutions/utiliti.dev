import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import { copyText } from "~/utils/copy";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import Button from "~/components/button";
import { Transition } from "@headlessui/react";
import ReadFile from "~/components/read-file";

interface Props {
  readonly label: string;
  readonly encode: (text: string) => Promise<string>;
  readonly decode: (text: string) => Promise<string>;
  readonly showLoadFile: Boolean;
  readonly renderOptions?: () => ReactNode;
}

export default function EncoderDecoder({
  label,
  encode,
  decode,
  showLoadFile,
  renderOptions,
}: Props) {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const process = useCallback(
    (e: boolean) => {
      const text = inputRef.current?.value || "";
      const fun = e ? encode : decode;

      fun(text)
        .then((it) => {
          setOutput(it);
          setError(null);
        })
        .catch((e) => {
          setError(e.message);
          setOutput(null);
        });
    },
    [encode, decode]
  );

  return (
    <>
      <h1>{label}</h1>

      <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600">
          <div className="font-bold">Input</div>
          <div>
            <button
              type="button"
              className="p-2 rounded cursor-pointer sm:ml-auto text-zinc-400 hover:text-white hover:bg-zinc-600"
              onClick={() => copyText(inputRef.current?.value || "")}
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

        {renderOptions && renderOptions()}

        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-600">
          <div>
            {showLoadFile && (
              <ReadFile
                accept="text/plain,application/JSON"
                onLoad={(text) => {
                  if (inputRef.current) {
                    inputRef.current.value = text;
                  }
                }}
              />
            )}
          </div>
          <div className="flex gap-x-2">
            <Button onClick={() => process(true)} label="encode" />
            <Button onClick={() => process(false)} label="decode" />
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
