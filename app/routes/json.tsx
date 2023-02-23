import type { MetaFunction } from "@remix-run/cloudflare";
import Copy from "~/components/copy";
import { useCallback, useState } from "react";
import { JSONTree } from "react-json-tree";
import Code from "~/components/code";
import { noop } from "~/common";
import IconButton from "~/components/icon-button";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import type { ShouldExpandNodeInitially } from "react-json-tree/src/types";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { Utiliti } from "~/components/utiliti";

export const meta: MetaFunction = () =>
  metaHelper(utilities.json.name, utilities.json.description);

async function decode(text: string): Promise<object> {
  try {
    return JSON.parse(text);
  } catch (e) {
    return Promise.reject({ message: (e as SyntaxError).message });
  }
}

export default function JSONEncoder() {
  const [shouldExpand, setShouldExpand] = useState<boolean | null>(null);
  const [expandAfter, setExpandAfter] = useState(3);

  const shouldExpandNodeInitially = useCallback<ShouldExpandNodeInitially>(
    (keyPath, data, level) => {
      if (shouldExpand !== null) {
        return shouldExpand;
      }

      return level < expandAfter;
    },
    [shouldExpand, expandAfter]
  );

  const expandAll = useCallback(() => setShouldExpand(true), [setShouldExpand]);
  const collapseALl = useCallback(
    () => setShouldExpand(false),
    [setShouldExpand]
  );
  const incrementExpandAfter = useCallback(() => {
    setExpandAfter(Math.min(10, expandAfter + 1));
    setShouldExpand(null);
  }, [expandAfter]);
  const decrementExpandAfter = useCallback(() => {
    setExpandAfter(Math.max(0, expandAfter - 1));
    setShouldExpand(null);
  }, [expandAfter]);

  const onAction = useCallback(async (action: string, input: string) => {
    return await decode(input);
  }, []);

  const renderOutput = useCallback(
    (action: string, input: string, output: object) => {
      const toCopy = JSON.stringify(output);

      if (action === "Format" || action === "Minify") {
        return (
          <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600 font-bold">
              <div>Output</div>
              <div>
                <Copy content={toCopy} />
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-800 rounded-b-lg">
              <Code
                value={JSON.stringify(
                  output,
                  null,
                  action === "Format" ? 2 : 0
                )}
                setValue={noop}
                readonly={true}
              />
            </div>
          </div>
        );
      }

      return (
        <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600 font-bold">
            <div>Output</div>
            <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
              <div className="flex items-center space-x-1 sm:pr-4">
                <IconButton
                  icon={MinusIcon}
                  label="Decrement level at which nodes are auto expanded"
                  onClick={decrementExpandAfter}
                />
                <div className="sm:px text-center">{expandAfter}</div>
                <IconButton
                  icon={PlusIcon}
                  label="Increment level at which nodes are auto expanded"
                  onClick={incrementExpandAfter}
                />
              </div>
              <div className="flex items-center space-x-1 sm:px-4">
                <IconButton
                  icon={ArrowsPointingInIcon}
                  label="Collapse all nodes"
                  onClick={collapseALl}
                />
                <IconButton
                  icon={ArrowsPointingOutIcon}
                  label="Expand all nodes"
                  onClick={expandAll}
                />
              </div>
              <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
                <Copy content={toCopy} />
              </div>
            </div>
          </div>
          <div className="px-4 py-2 bg-zinc-800 rounded-b-lg not-prose text-sm font-mono">
            <JSONTree
              key={`tree-${shouldExpand}-${expandAfter}`}
              data={output}
              hideRoot={true}
              shouldExpandNodeInitially={shouldExpandNodeInitially}
              theme={{
                base00: "#27272a", // background
                base0D: "#9876aa", // label + arrow
                base09: "#6897bb", // number + boolean
                base0B: "#6a8759", // string + date + item string
                base03: "#6a8759", // item string expanded
              }}
            />
          </div>
        </div>
      );
    },
    [
      collapseALl,
      decrementExpandAfter,
      expandAfter,
      expandAll,
      incrementExpandAfter,
      shouldExpand,
      shouldExpandNodeInitially,
    ]
  );

  return (
    <Utiliti
      label="JSON"
      buttons={["View", "Format", "Minify"]}
      renderInput={(input, setInput) => (
        <Code
          value={input}
          setValue={setInput}
          minHeight="12rem"
          readonly={false}
        />
      )}
      renderOutput={renderOutput}
      onAction={onAction}
      showLoadFile={true}
    />
  );
}
