import Box, { BoxContent, BoxTitle } from "~/components/box";
import type { ChangeEvent } from "react";
import React, { useCallback } from "react";
import ContentWrapper from "~/components/content-wrapper";
import { utilities } from "~/utilities";
import { metaHelper } from "~/utils/meta";
import Code from "~/components/code";
import type { FormatOptionsWithLanguage, KeywordCase } from "sql-formatter";
import { format } from "sql-formatter";
import { Transition } from "@headlessui/react";
import Copy from "~/components/copy";
import { noop } from "~/common";
import { useLocalStorage } from "~/hooks/use-local-storage";
import NumberInput from "~/components/number-input";
import { useHydrated } from "~/hooks/use-hydrated";

export const meta = metaHelper(
  utilities.sqlFormatter.name,
  utilities.sqlFormatter.description,
);

function formatSql(
  input: string,
  options: FormatOptionsWithLanguage,
): string | null {
  try {
    return format(input, options);
  } catch (e) {
    // do nothing
  }

  return null;
}

export default function SqlFormatter() {
  const hydrated = useHydrated();
  const [input, setInput] = useLocalStorage("sql-formatter-query", "");
  const [keywordCase, setKeywordCase] = useLocalStorage<KeywordCase>(
    "sql-formatter-kw-case",
    "upper",
  );
  const [tabWidth, setTabWidth] = useLocalStorage(
    "sql-formatter-tab-width",
    "2",
  );

  const onChangeTabWidth = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTabWidth(
        Math.min(Math.max(parseInt(e.target.value, 10), 1), 8).toString(),
      );
    },
    [setTabWidth],
  );

  // @note: this could become a performance issue as input changes quite often
  // could introduce debounce here, but going to leave it until it becomes a problem
  const formatted = formatSql(input, {
    tabWidth: parseInt(tabWidth, 10),
    keywordCase: keywordCase,
  });

  // easy way to disable server side rendering, which causes lots of issues due to saved state in localStorage
  if (!hydrated) {
    return;
  }

  return (
    <ContentWrapper>
      <h1>{utilities.sqlFormatter.name}</h1>

      <p>
        Paste any of your SQL-like queries here and have them be formatted
        before you share it with others.
      </p>

      <Box>
        <BoxTitle title="Input">
          <div className="flex flex-wrap items-center divide-x divide-gray-600">
            <div className="flex items-center pr-4">
              <label htmlFor="tabWidth" className="text-sm hidden md:block">
                Tab Width
              </label>
              <NumberInput
                id="tabWidth"
                type="number"
                min={0}
                max={8}
                value={tabWidth}
                onChange={onChangeTabWidth}
                className="ml-2"
              />
            </div>

            <div className="flex items-center pl-4">
              <label htmlFor="keywordCase" className="text-sm hidden md:block">
                Keyword Case
              </label>
              <select
                id="keywordCase"
                className="block text-sm ml-2 border rounded-lg bg-zinc-700 border-zinc-600 placeholder-zinc-400 focus:ring-orange-500 focus:border-orange-500"
                value={keywordCase}
                onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
              >
                <option value="preserve">Preserved</option>
                <option value="upper">Uppercase</option>
                <option value="lower">Lowercase</option>
              </select>
            </div>
          </div>
        </BoxTitle>

        <BoxContent isLast={true} className="px-3 py-2">
          <Code
            value={input}
            setValue={setInput}
            minHeight="12rem"
            readonly={false}
            placeholder="Paste some SQL…"
            language="sql"
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
                <Code
                  language="sql"
                  value={formatted}
                  setValue={noop}
                  readonly={true}
                />
              )}
            </div>
          </BoxContent>
        </Box>
      </Transition>
    </ContentWrapper>
  );
}
