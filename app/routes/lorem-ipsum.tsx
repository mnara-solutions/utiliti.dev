import { useCallback, useMemo } from "react";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { Utiliti } from "~/components/utiliti";

export default function LoremIpsum() {
  const actions = useMemo(
    () => ({
      Generate: async (input: string) => "Hello World",
    }),
    []
  );

  const renderInput = useCallback(
    (input: string, setInput: (value: string) => void) => (
      <textarea
        id="input"
        rows={10}
        className="block px-3 py-2 font-mono w-full text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
        placeholder="Coming Soon."
        required={true}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    ),
    []
  );

  const renderOutput = useCallback(
    (action: string, input: string, output: string) => (
      <Box>
        <BoxTitle title="Output"></BoxTitle>
        <BoxContent isLast={true} className="max-h-full flex justify-center">
          {output}
        </BoxContent>
      </Box>
    ),
    []
  );

  return (
    <Utiliti
      label="Lorem Ipsum"
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
    />
  );
}
