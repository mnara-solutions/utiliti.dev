import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { useCallback, useMemo, useState } from "react";
import Dropdown from "~/components/dropdown";
import Utiliti from "~/components/utiliti";
import ReadFile from "~/components/read-file";

export const meta = metaHelper(
  utilities.dataurl.name,
  utilities.dataurl.description,
);

enum Action {
  DISPLAY = "Display",
}

function isImage(dataUrl: string, fileType: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = `data:${fileType};base64,${dataUrl}`;
  });
}

export default function DataUrl() {
  const [format, setFormat] = useState("jpg");
  const [quality, setQuality] = useState("0");
  const actions = useMemo(
    () => ({
      [Action.DISPLAY]: async (input: string) => {
        if (input.substring(0, 5) === "data:") {
          return input;
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
          if (await isImage(input, fileTypes[i])) {
            return `data:${fileTypes[i]};base64,${input}`;
          }
        }

        return Promise.reject({
          message: "Does not appear to be a valid Data URL.",
        });
      },
    }),
    [],
  );

  const renderInput = useCallback(
    (input: string, setInput: (v: string) => void) => (
      <textarea
        id="input"
        rows={10}
        className="block px-3 py-2 font-mono w-full lg:text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
        placeholder="Paste in your Data URL…"
        required={true}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    ),
    [],
  );

  const renderOutput = useCallback(
    (a: string, input: string, output: string) => {
      return (
        <Box>
          <BoxTitle title="Output"></BoxTitle>
          <BoxContent
            isLast={true}
            className="max-h-full flex justify-center py-4"
          >
            <img className="max-w-full" alt="Output" src={output} />
          </BoxContent>
        </Box>
      );
    },
    [],
  );

  const renderReadFile = useCallback(
    (setInput: (value: string) => void) => {
      return (
        <div className="flex gap-x-2">
          <Dropdown
            onOptionChange={setFormat}
            options={[
              { id: "jpg", label: "Jpeg" },
              { id: "png", label: "Png" },
              { id: "webp", label: "Webp" },
            ]}
            defaultValue={format}
          />

          {format !== "png" ? (
            <Dropdown
              onOptionChange={setQuality}
              options={[
                { id: "0", label: "Default" },
                { id: "1", label: "Full (100%)" },
                { id: ".9", label: "Very High (90%)" },
                { id: ".8", label: "High (80%)" },
                { id: ".75", label: "Good (75%)" },
                { id: ".6", label: "Medium (60%)" },
                { id: ".5", label: "Low (50%)" },
                { id: ".25", label: "Poor (25%)" },
              ]}
              defaultValue={quality.toString()}
            />
          ) : null}

          <ReadFile
            accept="image/*"
            onLoad={setInput}
            type="dataURL"
            format={format}
            quality={quality}
          />
        </div>
      );
    },
    [format, quality],
  );

  return (
    <Utiliti
      label="DataURL"
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
      renderReadFile={renderReadFile}
    />
  );
}
