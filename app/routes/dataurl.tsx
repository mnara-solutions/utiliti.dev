import type { MetaFunction } from "@remix-run/cloudflare";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { Utiliti } from "~/components/utiliti";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { useCallback, useMemo } from "react";

export const meta: MetaFunction = () =>
  metaHelper(utilities.dataurl.name, utilities.dataurl.description);

function isImage(dataUrl: string, fileType: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = `data:${fileType};base64,${dataUrl}`;
  });
}

async function display(text: string): Promise<string> {
  if (text.substring(0, 5) === "data:") {
    return text;
  }

  const fileTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
    "image/svg+xml",
  ];

  for (let i = 0; i < fileTypes.length; i++) {
    if (await isImage(text, fileTypes[i])) {
      return `data:${fileTypes[i]};base64,${text}`;
    }
  }

  return Promise.reject({ message: "Does not appear to be a valid Data URL." });
}

export default function DataUrl() {
  const actions = useMemo(
    () => ({
      Display: (input: string) => display(input),
    }),
    []
  );

  const renderInput = useCallback(
    (input: string, setInput: (value: string) => void) => (
      <textarea
        id="input"
        rows={10}
        className="block px-3 py-2 font-mono w-full text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
        placeholder="Paste in your Data URL…"
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
          <img className="max-w-full" alt="Output" src={output} />
        </BoxContent>
      </Box>
    ),
    []
  );

  return (
    <Utiliti
      label="DataURL"
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
    />
  );
}
