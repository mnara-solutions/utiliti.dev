import type { ReactNode } from "react";
import { useMemo } from "react";
import Copy from "~/components/copy";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import { Utiliti } from "~/components/utiliti";
import OutputBox from "~/components/output-box";

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
          className="font-mono w-full px-0 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
          placeholder="Paste in your content…"
          required={true}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      )}
      renderOutput={(action, input, output) => (
        <OutputBox
          renderTitle={() => (
            <>
              <div className="font-bold">Output</div>
              <div>
                <Copy content={output} />
              </div>
            </>
          )}
        >
          <ReadOnlyTextArea value={output} />
        </OutputBox>
      )}
      renderOptions={renderOptions}
      showLoadFile={showLoadFile}
    />
  );
}
