import Button from "~/components/button";
import { useCallback, useRef, useState } from "react";
import type { MetaFunction } from "@remix-run/cloudflare";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import { copyText } from "~/utils/copy";

export const meta: MetaFunction = () => ({
  title: "Base64 | Utiliti",
});

export default function Index() {
  const [output, setOutput] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const encode = useCallback(() => {
    if (!inputRef.current) {
      return;
    }

    setOutput(btoa(inputRef.current.value || ""));
  }, [setOutput]);

  const decode = useCallback(() => {
    if (!inputRef.current) {
      return;
    }

    setOutput(atob(inputRef.current.value || ""));
  }, [setOutput]);

  return (
    <>
      <h1>base64</h1>

      <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
        <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
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
            required
          ></textarea>
        </div>
        <div className="flex items-center justify-end px-3 py-2 border-t dark:border-gray-600 gap-x-2">
          <Button onClick={encode} label="encode" />
          <Button onClick={decode} label="decode" />
        </div>
      </div>

      <Transition
        show={output != null}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600 transition ease-in-out">
          <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600 font-bold">
            <div>Output</div>
            <div>
              <button
                type="button"
                className="p-2 rounded cursor-pointer sm:ml-auto text-zinc-400 hover:text-white hover:bg-zinc-600"
                onClick={() => {
                  copyText(output || "");
                }}
              >
                <DocumentDuplicateIcon className="h-5 w-5" aria-hidden="true" />
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
              required
            >
              {output}
            </textarea>
          </div>
        </div>
      </Transition>
    </>
  );
}
