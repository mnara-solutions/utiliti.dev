import Copy from "~/components/copy";
import ReadFile from "~/components/read-file";
import Button from "~/components/button";
import { Transition } from "@headlessui/react";
import { PopularUtilities } from "~/components/popular-utilities";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

interface Props {
  readonly label: string;
  readonly buttons: string[];
  readonly renderInput: (input: string) => ReactNode;
  readonly onAction: (action: string, input: string) => Promise<ReactNode>;
  readonly showLoadFile: Boolean;
}

export function Utiliti({
  label,
  renderInput,
  buttons,
  onAction,
  showLoadFile,
}: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const action = useCallback(
    async (action: string, input: string) => {
      onAction(action, input)
        .then((it) => {
          setOutput(it);
          setError(null);
        })
        .catch((e) => {
          setError(e.message);
          setOutput(null);
        });
    },
    [onAction]
  );

  return (
    <>
      <h1>{label}</h1>

      <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600">
          <div className="font-bold">Input</div>
          <div>
            <Copy content={input} />
          </div>
        </div>
        <div className="px-4 py-2 bg-zinc-800 max-h-96 overflow-auto">
          {renderInput(input)}
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-600">
          <div>
            {showLoadFile && (
              <ReadFile
                accept="text/plain,application/JSON"
                onLoad={setInput}
              />
            )}
          </div>
          <div className="flex gap-x-2">
            {buttons.map((b) => (
              <Button key={b} onClick={() => action(b, input)} label={b} />
            ))}
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
          output
        )}
      </Transition>

      <PopularUtilities />
    </>
  );
}
