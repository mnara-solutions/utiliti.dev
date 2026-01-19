import Box, { BoxContent, BoxTitle } from "~/components/box";
import ContentWrapper from "~/components/content-wrapper";
import { utilities } from "~/utilities";
import { Routes } from "~/routes";
import { metaHelper } from "~/utils/meta";
import Code from "~/components/code";
import FadeIn from "~/components/fade-in";
import Copy from "~/components/copy";
import { noop } from "~/common";
import { useLocalStorage } from "~/hooks/use-local-storage";
import NumberInput from "~/components/number-input";
import Dropdown from "~/components/dropdown";
import { type ChangeEvent, useState, useEffect } from "react";
import { formatSql } from "~/utils/sql-formatter.client";

export const meta = metaHelper(
  utilities.sqlFormatter.name,
  "Format and beautify SQL queries instantly. Supports multiple SQL dialects with customizable formatting. Client-side processing keeps your queries private.",
  Routes.SQL_FORMATTER,
);

type KeywordCase = "preserve" | "upper" | "lower";

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
  const [formatted, setFormatted] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeTabWidth = (e: ChangeEvent<HTMLInputElement>) => {
    setTabWidth(
      Math.min(Math.max(parseInt(e.target.value, 10), 1), 8).toString(),
    );
  };

  useEffect(() => {
    if (!input) {
      setFormatted(null);
      return;
    }

    let cancelled = false;

    async function doFormat() {
      setIsLoading(true);
      try {
        const result = await formatSql(input, {
          tabWidth: parseInt(tabWidth, 10),
          keywordCase: keywordCase,
        });

        if (!cancelled) {
          setFormatted(result);
        }
      } catch {
        if (!cancelled) {
          setFormatted(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    doFormat();

    return () => {
      cancelled = true;
    };
  }, [input, tabWidth, keywordCase]);

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

      <FadeIn show={!!input} className="mt-6">
        <Box>
          <BoxTitle title="Output">
            <div>
              <Copy content={formatted || ""} />
            </div>
          </BoxTitle>
          <BoxContent isLast={true}>
            <div className="px-3 py-2">
              {isLoading ? (
                <span className="text-zinc-400">Formatting...</span>
              ) : formatted === null ? (
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
      </FadeIn>

      <h2>What is SQL Formatting?</h2>
      <p>
        SQL formatting (also called SQL beautifying or SQL prettifying) is the
        process of restructuring SQL code to make it more readable and
        maintainable. Raw SQL queries—especially those generated by ORMs or
        copied from logs—are often compressed into a single line or poorly
        indented, making them difficult to understand and debug.
      </p>
      <p>
        A well-formatted SQL query uses consistent indentation, proper keyword
        capitalization, and logical line breaks to clearly show the structure of
        the query. This makes it easier to spot errors, understand complex
        joins, and share queries with teammates.
      </p>

      <h2>Why Format SQL Client-Side?</h2>
      <p>
        Many online SQL formatters send your queries to their servers for
        processing. This is a significant security risk—your queries might
        contain sensitive table names, column names, or even data values that
        reveal information about your database schema.
      </p>
      <p>
        Utiliti&apos;s SQL Formatter runs entirely in your browser. Your SQL
        queries are never transmitted to our servers, making it safe to format
        queries containing:
      </p>
      <ul>
        <li>
          <strong>Sensitive Schema Information</strong>: Table and column names
          that reveal your data model
        </li>
        <li>
          <strong>Query Parameters</strong>: Values that might contain PII or
          business-sensitive data
        </li>
        <li>
          <strong>Proprietary Logic</strong>: Complex queries that represent
          business logic you want to keep private
        </li>
      </ul>

      <h2>Formatting Options</h2>
      <p>Customize the output to match your team&apos;s coding standards:</p>
      <ul>
        <li>
          <strong>Tab Width</strong>: Set the number of spaces for each
          indentation level (1-8 spaces).
        </li>
        <li>
          <strong>Keyword Case</strong>: Choose uppercase (SELECT), lowercase
          (select), or preserve the original case.
        </li>
      </ul>

      <h2>Supported SQL Dialects</h2>
      <p>
        Our formatter supports standard SQL syntax that works across most
        database systems, including:
      </p>
      <ul>
        <li>PostgreSQL</li>
        <li>MySQL / MariaDB</li>
        <li>Microsoft SQL Server (T-SQL)</li>
        <li>Oracle PL/SQL</li>
        <li>SQLite</li>
        <li>BigQuery</li>
        <li>Redshift</li>
      </ul>

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>Debugging</strong>: Format minified queries from application
          logs to understand what&apos;s being executed.
        </li>
        <li>
          <strong>Code Reviews</strong>: Clean up SQL before sharing in pull
          requests or documentation.
        </li>
        <li>
          <strong>Learning</strong>: Better understand complex queries by seeing
          their structure clearly.
        </li>
        <li>
          <strong>Documentation</strong>: Create readable SQL examples for
          technical documentation.
        </li>
        <li>
          <strong>Standardization</strong>: Ensure consistent SQL style across
          your team&apos;s codebase.
        </li>
      </ul>

      <h2>Tips for Better SQL</h2>
      <p>Beyond formatting, here are some best practices for writing SQL:</p>
      <ul>
        <li>
          Use meaningful table aliases (e.g., <code>users AS u</code> instead of{" "}
          <code>users AS t1</code>)
        </li>
        <li>
          Put each column in a SELECT statement on its own line for easier
          version control diffs
        </li>
        <li>
          Use consistent capitalization for SQL keywords throughout your
          codebase
        </li>
        <li>Add comments to explain complex logic or business rules</li>
      </ul>
    </ContentWrapper>
  );
}
