import ContentWrapper from "~/components/content-wrapper";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import Copy from "~/components/copy";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import { v1, v4 } from "uuid";

export default function UuidGenerator() {
  const [number, setNumber] = useState(1);
  const [version, setVersion] = useState<number>(4);

  const onChangeNumber = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNumber(Math.min(Math.max(parseInt(e.target.value, 10), 1), 500));
    },
    [setNumber]
  );

  const onChangeVersion = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setVersion(parseInt(e.target.value, 10));
    },
    [setVersion]
  );

  const output = Array.from(Array(number), () =>
    version === 1 ? v1() : v4()
  ).join("\n");

  return (
    <ContentWrapper>
      <h1>UUID</h1>

      <Box>
        <BoxTitle title="">
          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
            <div className="flex items-center space-x-1 sm:pr-4">
              <select
                defaultValue={4}
                className="block text-sm ml-2 border rounded-lg bg-zinc-700 border-zinc-600 placeholder-zinc-400 text-white focus:ring-orange-500 focus:border-orange-500"
                onChange={onChangeVersion}
              >
                <option value={1}>v1</option>
                <option value={4}>v4</option>
              </select>
            </div>

            <div className="flex items-center space-x-1 sm:px-4">
              <div className="sm:px text-center">
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={number}
                  onChange={onChangeNumber}
                  className="block text-sm ml-2 border rounded-lg bg-zinc-700 border-zinc-600 placeholder-zinc-400 text-white focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
              <Copy content={output} />
            </div>
          </div>
        </BoxTitle>

        <BoxContent isLast={true}>
          <ReadOnlyTextArea value={output} />
        </BoxContent>
      </Box>
    </ContentWrapper>
  );
}
