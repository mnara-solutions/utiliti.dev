import type { ReactNode } from "react";
import { useMemo } from "react";
import Copy from "~/components/copy";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import { Utiliti } from "~/components/utiliti";
import Box, { BoxContent, BoxTitle } from "~/components/box";

interface Props {
  readonly label: string;
  readonly encode: (text: string) => Promise<string>;
  readonly decode: (text: string) => Promise<string>;
  readonly showLoadFile: Boolean;
  readonly renderOptions?: () => ReactNode;
  readonly rows: number;
}

export default function EncoderDecoder({
  label,
  encode,
  decode,
  showLoadFile,
  renderOptions,
  rows,
}: Props) {
  const actions = useMemo(
    () => ({
      Encode: (input: string) => encode(input),
      Decode: (input: string) => decode(input),
    }),
    [decode, encode]
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
      renderOutput={(action, input, output) => (
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
      )}
      renderOptions={renderOptions}
      showLoadFile={showLoadFile}
    />
  );
}
