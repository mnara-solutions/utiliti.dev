import Box, { BoxContent, BoxTitle } from "~/components/box";
import React, { useState } from "react";
import ContentWrapper from "~/components/content-wrapper";
import { utilities } from "~/utilities";
import { metaHelper } from "~/utils/meta";
import Code from "~/components/code";
import { format } from "sql-formatter";
import { Transition } from "@headlessui/react";
import Copy from "~/components/copy";
import { noop } from "~/common";

export const meta = metaHelper(
  utilities.sqlFormatter.name,
  utilities.sqlFormatter.description
);

function formatSql(input: string): string | null {
  try {
    return format(input, { tabWidth: 2, keywordCase: "upper" });
  } catch (e) {
    // do nothing
  }

  return null;
}

export default function SqlFormatter() {
  // const [input, setInput] = useState(
  //   "SELECT u.name, u.hash FROM users u WHERE u.id = 2"
  // );
  const [input, setInput] = useState("");

  const formatted = formatSql(input);

  return (
    <ContentWrapper>
      <h1>{utilities.sqlFormatter.name}</h1>

      <Box>
        <BoxTitle title="Input" />

        <BoxContent isLast={true} className="px-3 py-2">
          <Code
            value={input}
            setValue={setInput}
            minHeight="12rem"
            readonly={false}
            placeholder="Paste some SQL…"
          />
        </BoxContent>
      </Box>

      <Transition
        show={!!input}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        className="mt-6"
      >
        <Box>
          <BoxTitle title="Output">
            <div>
              <Copy content={formatted || ""} />
            </div>
          </BoxTitle>
          <BoxContent isLast={true}>
            <div className="px-3 py-2">
              {formatted === null ? (
                "Error in SQL query."
              ) : (
                <Code value={formatted} setValue={noop} readonly={true} />
              )}
            </div>
          </BoxContent>
        </Box>
      </Transition>
    </ContentWrapper>
  );
}
