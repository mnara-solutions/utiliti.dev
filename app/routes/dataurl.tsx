import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Box, { BoxButtons, BoxContent, BoxTitle } from "~/components/box";
import { useCallback, useState } from "react";
import ContentWrapper from "~/components/content-wrapper";
import Copy from "~/components/copy";
import ReadFile from "~/components/read-file";
import Button from "~/components/button";
import { Transition } from "@headlessui/react";

export const meta = metaHelper(
  utilities.dataurl.name,
  utilities.dataurl.description
);

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
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onClick = useCallback(async () => {
    display(input)
      .then((it) => {
        setOutput(it);
        setError(null);
      })
      .catch((e) => {
        setError(e.message);
        setOutput(null);
      });
  }, [input]);

  const onLoad = useCallback((dataUrl: string) => {
    setInput(dataUrl);
    setOutput(dataUrl);
  }, []);

  return (
    <ContentWrapper>
      <h1>DataURL</h1>

      <Box>
        <BoxTitle title="Input">
          <div>
            <Copy content={input} />
          </div>
        </BoxTitle>

        <BoxContent isLast={false}>
          <textarea
            id="input"
            rows={10}
            className="block px-3 py-2 font-mono w-full text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
            placeholder="Paste in your Data URL…"
            required={true}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </BoxContent>

        <BoxButtons>
          <div>
            <ReadFile accept="image/*" onLoad={onLoad} type="dataURL" />
          </div>
          <div className="flex gap-x-2">
            <Button onClick={onClick} label="Display" />
          </div>
        </BoxButtons>
      </Box>

      <Transition
        show={output != null || error != null}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        className="mt-6"
      >
        {error ? (
          <Box>
            <BoxTitle title="Error" />
            <BoxContent isLast={true} className="px-3 py-2 text-red-400">
              {error}
            </BoxContent>
          </Box>
        ) : (
          output && (
            <Box>
              <BoxTitle title="Output"></BoxTitle>
              <BoxContent
                isLast={true}
                className="max-h-full flex justify-center"
              >
                <img className="max-w-full" alt="Output" src={output} />
              </BoxContent>
            </Box>
          )
        )}
      </Transition>
    </ContentWrapper>
  );
}
