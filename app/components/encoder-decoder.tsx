import { ReactNode, useCallback } from "react";
import { useMemo } from "react";
import Copy from "~/components/copy";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import { Utiliti } from "~/components/utiliti";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { URLJsonFormatData } from "~/types/url";
import { JsonOutput } from "./json-output";

interface Props {
  readonly label: string;
  readonly encode: (text: string) => string;
  readonly decode: (text: string) => string;
  readonly toJson: (text: string) => URLJsonFormatData;
  readonly showLoadFile: Boolean;
  readonly renderOptions?: () => ReactNode;
  readonly rows: number;
}

enum Action {
  Encode = "Encode",
  Decode = "Decode",
  toJson = "toJson",
}

export default function EncoderDecoder({
  label,
  encode,
  decode,
  toJson,
  showLoadFile,
  renderOptions,
  rows,
}: Props) {
  const actions = useMemo(
    () => ({
      Encode: (input: string) => encode(input),
      Decode: (input: string) => decode(input),
      toJson: (input: string) => toJson(input),
    }),
    [decode, encode, toJson]
  );

  const renderOutput = useCallback(
    (a: string, input: string, output: string) => {
      if (a === Action.Encode || a === Action.Decode) {
        return (
          <Box>
            <BoxTitle title="Output">
              <div>
                <Copy content={output} />
              </div>
            </BoxTitle>
            <BoxContent isLast={true}>
              <ReadOnlyTextArea value={output} />
            </BoxContent>
          </Box>
        );
      }

      const toCopy = JSON.stringify(output);
      return <JsonOutput toCopy={toCopy} output={output} />;
    },
    []
  );

  return (
    <Utiliti
      label={label}
      actions={actions}
      renderInput={(input, setInput) => (
        <textarea
          id="input"
          rows={rows}
          className="block font-mono w-full px-3 py-2 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
          placeholder="Paste in your content…"
          required={true}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      )}
      renderOutput={renderOutput}
      renderOptions={renderOptions}
      showLoadFile={showLoadFile}
    />
  );
}
