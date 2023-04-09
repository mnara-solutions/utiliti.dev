import Copy from "~/components/copy";
import { useCallback, useMemo } from "react";
import Code from "~/components/code";
import { noop } from "~/common";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { Utiliti } from "~/components/utiliti";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import JsonViewer from "~/components/json-viewer";

export const meta = metaHelper(utilities.json.name, utilities.json.description);

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
      if (a === Action.FORMAT || a === Action.MINIFY) {
        return (
          <Box>
            <BoxTitle title="Output">
              <div>
                <Copy content={JSON.stringify(output)} />
              </div>
            </BoxTitle>
            <BoxContent isLast={true}>
              <div className="px-3 py-2">
                <Code
                  value={JSON.stringify(output, null, a === "Format" ? 2 : 0)}
                  setValue={noop}
                  readonly={true}
                />
              </div>
            </BoxContent>
          </Box>
        );
      }

      return <JsonViewer json={output} />;
    },
    []
  );

  return (
    <Utiliti
      label="JSON"
      actions={actions}
      renderInput={(input, setInput) => (
        <div className="px-3 py-2">
          <Code
            value={input}
            setValue={setInput}
            minHeight="12rem"
            readonly={false}
          />
        </div>
      )}
      renderOutput={renderOutput}
      showLoadFile={true}
    />
  );
}
