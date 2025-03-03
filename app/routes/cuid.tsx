import ContentWrapper from "~/components/content-wrapper";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { useState, type ChangeEvent } from "react";
import Copy from "~/components/copy";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import { init } from "@paralleldrive/cuid2";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import NumberInput from "~/components/number-input";

export const meta = metaHelper(utilities.cuid.name, utilities.cuid.description);

export default function UuidGenerator() {
  const [number, setNumber] = useState(1);
  const [length, setLength] = useState(24);

  // cuid is already secure enough, but there could be an improvement by passing
  // in our own browser based CSPRNG. This functionality is not ready yet.
  // https://github.com/paralleldrive/cuid2/issues/18
  // const random = init({ random: crypto.getRandomValues });

  const onChangeLength = (e: ChangeEvent<HTMLInputElement>) => {
    setLength(Math.min(Math.max(parseInt(e.target.value, 10), 5), 50));
  };

  const onChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setNumber(Math.min(Math.max(parseInt(e.target.value, 10), 1), 500));
  };

  const random = init({ length });
  const output = Array.from(Array(number), () => random()).join("\n");

  return (
    <ContentWrapper>
      <h1>CUID v2</h1>
      <p>
        Secure, collision-resistant ids optimized for horizontal scaling and
        performance.{" "}
        <a
          href="https://github.com/paralleldrive/cuid2"
          target="_blank"
          rel="noreferrer"
        >
          Learn More.
        </a>
      </p>

      <Box>
        <BoxTitle title="">
          <div className="flex items-center justify-start grow">
            <label
              htmlFor="length"
              className="block text-sm font-medium text-gray-900 dark:text-white pr-2"
            >
              Length:
            </label>
            <NumberInput
              id="length"
              type="number"
              min={5}
              max={50}
              value={length}
              onChange={onChangeLength}
            />
          </div>
          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
            <div className="flex items-center space-x-1 sm:px-4">
              <div className="sm:px text-center">
                <NumberInput
                  id="length"
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
