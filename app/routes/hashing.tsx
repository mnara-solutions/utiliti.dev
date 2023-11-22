import { useCallback, useMemo, useState } from "react";
import Utiliti from "~/components/utiliti";
import { BoxOptions } from "~/components/box";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import SimpleOutput from "~/components/simple-output";
import Dropdown from "~/components/dropdown";

export const meta = metaHelper(
  utilities.hashing.name,
  utilities.hashing.description,
);

enum Action {
  HASH = "Hash",
}

export default function QrCode() {
  const [algorithm, setAlgorithm] = useState("SHA-512");

  const actions = useMemo(
    () => ({
      [Action.HASH]: async (input: string) => {
        const msgUint8 = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      },
    }),
    [algorithm],
  );

  const renderOutput = useCallback(
    (a: string, input: string, output: string) => {
      return <SimpleOutput output={output} />;
    },
    [algorithm],
  );

  const renderOptions = useCallback(
    () => (
      <BoxOptions isLast={false}>
        <Dropdown
          onOptionChange={setAlgorithm}
          options={["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map((it) => ({
            id: it,
            label: it,
          }))}
          defaultValue={algorithm}
        />
      </BoxOptions>
    ),
    [algorithm],
  );

  const renderInput = useCallback(
    (input: string, setInput: (v: string) => void) => (
      <textarea
        id="input"
        rows={10}
        className="block font-mono w-full px-3 py-2 lg:text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
        placeholder="Paste in your content…"
        required={true}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
    ),
    [],
  );

  return (
    <Utiliti
      label={utilities.hashing.name}
      actions={actions}
      renderInput={renderInput}
      renderOptions={renderOptions}
      renderOutput={renderOutput}
      showLoadFile={true}
    />
  );
}
