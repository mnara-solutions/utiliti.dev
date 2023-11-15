import ContentWrapper from "~/components/content-wrapper";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import Copy from "~/components/copy";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import { v1, v4 } from "uuid";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import NumberInput from "~/components/number-input";
import Dropdown from "~/components/dropdown";

export const meta = metaHelper(utilities.uuid.name, utilities.uuid.description);

export default function UuidGenerator() {
  const [number, setNumber] = useState(1);
  const [version, setVersion] = useState<number>(4);

  const onChangeNumber = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNumber(Math.min(Math.max(parseInt(e.target.value, 10), 1), 500));
    },
    [setNumber],
  );

  const onChangeVersion = useCallback(
    (v: string) => {
      setVersion(parseInt(v, 10));
    },
    [setVersion],
  );

  const output = Array.from(Array(number), () =>
    version === 1 ? v1() : v4(),
  ).join("\n");

  return (
    <ContentWrapper>
      <h1>UUID</h1>

      <p>
        Generate random Universally Unique IDentifiers (UUID) that match the{" "}
        <a
          href="https://www.ietf.org/rfc/rfc4122.txt"
          target="_blank"
          rel="noreferrer"
        >
          RFC4122
        </a>{" "}
        specification.
      </p>

      <Box>
        <BoxTitle title="">
          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
            <div className="flex items-center space-x-1 sm:pr-4">
              <Dropdown
                defaultValue={4}
                options={[
                  { id: "1", label: "v1" },
                  { id: "4", label: "v4" },
                ]}
                onOptionChange={onChangeVersion}
              />
            </div>

            <div className="flex items-center space-x-1 sm:px-4">
              <div className="sm:px text-center">
                <NumberInput
                  type="number"
                  min={1}
                  max={500}
                  value={number}
                  onChange={onChangeNumber}
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
