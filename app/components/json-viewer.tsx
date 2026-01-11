import Copy from "~/components/copy";
import { useState, Suspense, lazy } from "react";
import IconButton from "~/components/icon-button";

// Lazy load the heavy react-json-tree dependency
const JSONTree = lazy(() =>
  import("react-json-tree").then((mod) => ({ default: mod.JSONTree })),
);
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import type { ShouldExpandNodeInitially } from "react-json-tree/src/types";
import Box, { BoxContent, BoxTitle } from "~/components/box";

interface Props {
  readonly json: object | string;
}

export default function JsonViewer({ json }: Props) {
  const [shouldExpand, setShouldExpand] = useState<boolean | null>(null);
  const [expandAfter, setExpandAfter] = useState(3);

  const shouldExpandNodeInitially: ShouldExpandNodeInitially = (
    keyPath,
    data,
    level,
  ) => {
    if (shouldExpand !== null) {
      return shouldExpand;
    }

    return level < expandAfter;
  };

  const incrementExpandAfter = () => {
    setExpandAfter(Math.min(10, expandAfter + 1));
    setShouldExpand(null);
  };
  const decrementExpandAfter = () => {
    setExpandAfter(Math.max(0, expandAfter - 1));
    setShouldExpand(null);
  };

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
              onClick={() => setShouldExpand(false)}
            />
            <IconButton
              icon={ArrowsPointingOutIcon}
              label="Expand all nodes"
              onClick={() => setShouldExpand(true)}
            />
          </div>
          <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
            <Copy content={() => JSON.stringify(json)} />
          </div>
        </div>
      </BoxTitle>

      <BoxContent isLast={true} className="font-mono text-sm pl-2">
        <Suspense
          fallback={<div className="text-zinc-400 p-2">Loading viewer...</div>}
        >
          <JSONTree
            key={`tree-${shouldExpand}-${expandAfter}`}
            data={json}
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
        </Suspense>
      </BoxContent>
    </Box>
  );
}
