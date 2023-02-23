import type { MetaFunction } from "@remix-run/cloudflare";
import Copy from "~/components/copy";
import { useCallback, useMemo, useState } from "react";
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
import Box, { BoxContent, BoxTitle } from "~/components/box";

export const meta: MetaFunction = () =>
  metaHelper(utilities.json.name, utilities.json.description);

async function decode(text: string): Promise<object> {
  try {
    return JSON.parse(text);
  } catch (e) {
    return Promise.reject({ message: (e as SyntaxError).message });
  }
}

enum Action {
  VIEW = "View",
  FORMAT = "Format",
  MINIFY = "Minify",
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

  const actions = useMemo(
    () => ({
      [Action.VIEW]: (input: string) => decode(input),
      [Action.FORMAT]: (input: string) => decode(input),
      [Action.MINIFY]: (input: string) => decode(input),
    }),
    []
  );

  const renderOutput = useCallback(
    (a: string, input: string, output: object) => {
      const toCopy = JSON.stringify(output);

      if (a === Action.FORMAT || a === Action.MINIFY) {
        return (
          <Box>
            <BoxTitle title="Output">
              <div>
                <Copy content={toCopy} />
              </div>
            </BoxTitle>
            <BoxContent isLast={true}>
              <Code
                value={JSON.stringify(output, null, a === "Format" ? 2 : 0)}
                setValue={noop}
                readonly={true}
              />
            </BoxContent>
          </Box>
        );
      }

      return (
        <Box>
          <BoxTitle title="Output">
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
          </BoxTitle>
          <BoxContent isLast={true} className="font-mono text-sm">
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
          </BoxContent>
        </Box>
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
      actions={actions}
      renderInput={(input, setInput) => (
        <Code
          value={input}
          setValue={setInput}
          minHeight="12rem"
          readonly={false}
        />
      )}
      renderOutput={renderOutput}
      showLoadFile={true}
    />
  );
}
