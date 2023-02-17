import { useCallback, useRef, useState } from "react";
import Button from "~/components/button";
import { Transition } from "@headlessui/react";
import Copy from "~/components/copy";

interface Props {
  readonly label: string;
  readonly display: (text: string) => Promise<string>;
  readonly rows: number;
}

export default function DataUrlDisplay({ label, display, rows }: Props) {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const process = useCallback(() => {
    const text = inputRef.current?.value || "";

    display(text)
      .then((it) => {
        if (it.length > 0) {
          setOutput(it);
          setError(null);
        } else {
          setError("Does not appear to be a valid data URL.");
          setOutput(null);
        }
      })
      .catch((e) => {
        setError(e.message);
        setOutput(null);
      });
  }, [display]);

  const imageStyle = {
    maxWidth: "100%",
  };

  return (
    <>
      <h1>{label}</h1>

      <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600">
          <div className="font-bold">Input</div>
          <div>
            <Copy content={inputRef.current?.value || ""} />
          </div>
        </div>
        <div className="px-4 py-2 bg-zinc-800">
          <label htmlFor="input" className="sr-only">
            Your input
          </label>
          <textarea
            id="input"
            ref={inputRef}
            rows={rows}
            className="font-mono w-full px-0 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
            placeholder="Paste in your content..."
            required={true}
          ></textarea>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-600">
          <div className="flex gap-x-2">
            <Button onClick={() => process()} label="Display" />
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
            <div className="flex px-3 py-2 border-b border-gray-600 font-bold">
              <div className="flex items-center mr-3">Output</div>
              <div className="flex grow items-center justify-center">
                {output ? (
                  <img style={imageStyle} alt="" id="output" src={output}></img>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
}
