import Copy from "~/components/copy";
import { useCallback, useMemo } from "react";
import Code from "~/components/code";
import { noop } from "~/common";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Utiliti from "~/components/utiliti";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import ReadFile from "~/components/read-file";
import { setTextInputFromFiles } from "~/utils/convert-text-file";
import { useLocalStorage } from "~/hooks/use-local-storage";
import Dropdown from "~/components/dropdown";
import * as prettier from "prettier";
import html from "prettier/plugins/html";
import estree from "prettier/plugins/estree";
import typescript from "prettier/plugins/typescript";
import postcss from "prettier/plugins/postcss";

export const meta = metaHelper(
  utilities.prettier.name,
  utilities.prettier.description,
);

enum Action {
  FORMAT = "Format",
}

type Language = "html" | "typescript";

export default function Prettier() {
  const [language, setLanguage] = useLocalStorage<Language>(
    "prettier-language",
    "html",
  );

  const actions = useMemo(() => {
    return {
      [Action.FORMAT]: async (input: string) =>
        prettier.format(input, {
          parser: language,
          plugins: [html, typescript, estree, postcss],
        }),
    };
  }, [language]);

  const renderInput = useCallback(
    (input: string, setInput: (v: string) => void) => (
      <div className="px-3 py-2">
        <Code
          placeholder="Paste some HTML…"
          value={input}
          setValue={setInput}
          minHeight="12rem"
          readonly={false}
          language="xml"
        />
      </div>
    ),
    [],
  );

  const renderOutput = useCallback(
    (a: string, input: string, output: string) => {
      return (
        <Box>
          <BoxTitle title="Output">
            <div>
              <Copy content={output} />
            </div>
          </BoxTitle>
          <BoxContent isLast={true}>
            <div className="px-3 py-2">
              <Code
                value={output}
                setValue={noop}
                readonly={true}
                language={language == "html" ? "xml" : language}
              />
            </div>
          </BoxContent>
        </Box>
      );
    },
    [language],
  );

  const renderReadFile = useCallback(
    (setInput: (value: string) => void) => {
      return (
        <div className="flex gap-x-2">
          <Dropdown
            onOptionChange={(it) => setLanguage(it as Language)}
            options={[
              { id: "html", label: "HTML" },
              { id: "typescript", label: "Javascript" },
              { id: "css", label: "CSS" },
            ]}
            value={language}
          />

          <ReadFile
            accept="text/plain,application/JSON"
            onLoad={(files) => setTextInputFromFiles(files, setInput)}
          />
        </div>
      );
    },
    [language],
  );

  return (
    <Utiliti
      label={utilities.prettier.name}
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
      renderReadFile={renderReadFile}
    />
  );
}
