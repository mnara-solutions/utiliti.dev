import Copy from "~/components/copy";
import ReadFile from "~/components/read-file";
import Button from "~/components/button";
import { Transition } from "@headlessui/react";
import { PopularUtilities } from "~/components/popular-utilities";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import Box, { BoxButtons, BoxContent, BoxTitle } from "~/components/box";

interface Props<T> {
  readonly label: string;
  // thought about using a `Map` here since it guarantees order, but we give up "DX"
  readonly actions: Record<string, (input: string) => Promise<T>>;
  readonly renderInput: (
    input: string,
    setInput: (input: string) => void
  ) => ReactNode;
  readonly renderOutput: (
    action: string,
    input: string,
    output: T
  ) => ReactNode;
  readonly renderOptions?: () => ReactNode;
  readonly showLoadFile: Boolean;
}

export function Utiliti<T>({
  label,
  renderInput,
  renderOutput,
  renderOptions,
  actions,
  showLoadFile,
}: Props<T>) {
  const [action, setAction] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onClick = useCallback(
    async (action: string, input: string) => {
      const fn = actions[action];

      if (!fn) {
        return;
      }

      setAction(action);

      fn(input)
        .then((it) => {
          setOutput(it);
          setError(null);
        })
        .catch((e) => {
          setError(e.message);
          setOutput(null);
        });
    },
    [actions]
  );

  return (
    <>
      <h1>{label}</h1>

      <Box>
        <BoxTitle title="Input">
          <div>
            <Copy content={input} />
          </div>
        </BoxTitle>

        <BoxContent isLast={false}>{renderInput(input, setInput)}</BoxContent>

        {renderOptions && renderOptions()}
        <BoxButtons>
          <div>
            {showLoadFile && (
              <ReadFile
                accept="text/plain,application/JSON"
                onLoad={setInput}
              />
            )}
          </div>
          <div className="flex gap-x-2">
            {Object.keys(actions).map((action) => (
              <Button
                key={action}
                onClick={() => onClick(action, input)}
                label={action}
              />
            ))}
          </div>
        </BoxButtons>
      </Box>

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
          action && output && renderOutput(action, input, output)
        )}
      </Transition>

      <PopularUtilities />
    </>
  );
}
