import Box, { BoxContent, BoxTitle } from "~/components/box";
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
import Dropdown from "~/components/dropdown";
import { type ChangeEvent } from "react";

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
  } catch {
    // do nothing
  }

  return null;
}

export default function SqlFormatter() {
  const [input, setInput] = useLocalStorage("sql-formatter-query", "");
  const [keywordCase, setKeywordCase] = useLocalStorage<KeywordCase>(
    "sql-formatter-kw-case",
    "upper",
  );
  const [tabWidth, setTabWidth] = useLocalStorage(
    "sql-formatter-tab-width",
    "2",
  );

  const onChangeTabWidth = (e: ChangeEvent<HTMLInputElement>) => {
    setTabWidth(
      Math.min(Math.max(parseInt(e.target.value, 10), 1), 8).toString(),
    );
  };

  // @note: this could become a performance issue as input changes quite often
  // could introduce debounce here, but going to leave it until it becomes a problem
  const formatted = formatSql(input, {
    tabWidth: parseInt(tabWidth, 10),
    keywordCase: keywordCase,
  });

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
              <Dropdown
                id="keywordCase"
                className="ml-2"
                value={keywordCase}
                onOptionChange={(v) => setKeywordCase(v as KeywordCase)}
                options={[
                  { id: "preserve", label: "Preserved" },
                  { id: "upper", label: "Uppercase" },
                  { id: "lower", label: "Lowercase" },
                ]}
              />
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
        as="div"
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
