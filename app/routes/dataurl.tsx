import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { useState } from "react";
import Dropdown from "~/components/dropdown";
import Utiliti from "~/components/utiliti";
import ReadFile from "~/components/read-file";
import { convertFileToDataUrl } from "~/utils/convert-image-file";
import { NativeTypes } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";

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

function DroppableInput({
  input,
  setInput,
  format,
  quality,
}: {
  readonly input: string;
  readonly setInput: (v: string) => void;
  readonly format: string;
  readonly quality: string;
}) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    async drop(item: { files: File[] }) {
      setInput(await convertFileToDataUrl(item.files[0], format, quality));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <textarea
      id="input"
      rows={10}
      className={
        "block px-2 py-2 font-mono w-full lg:text-sm bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400 " +
        (isOver && canDrop
          ? "border-green-700 focus:border-green-700"
          : "border-zinc-800 focus:border-zinc-800")
      }
      placeholder="Paste in your Data URL, drag and drop a file, or click on the attachment icon below and select a file."
      required={true}
      ref={drop}
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
}

export default function DataUrl() {
  const [format, setFormat] = useState("jpg");
  const [quality, setQuality] = useState("0");
  const actions = {
    [Action.DISPLAY]: async (input: string) => {
      if (!input || input.substring(0, 5) === "data:") {
        return input;
      }

      const fileTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
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
  };

  const renderInput = (input: string, setInput: (v: string) => void) => {
    return (
      <DroppableInput
        input={input}
        setInput={setInput}
        format={format}
        quality={quality}
      />
    );
  };

  const renderOutput = (a: string, input: string, output: string) => {
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
  };

  const renderReadFile = (setInput: (value: string) => void) => {
    return (
      <div className="flex gap-x-2">
        <Dropdown
          onOptionChange={setFormat}
          options={[
            { id: "jpg", label: "Jpeg" },
            { id: "png", label: "Png" },
            { id: "webp", label: "Webp" },
            { id: "svg", label: "Svg" },
          ]}
          defaultValue={format}
        />

        {format !== "png" && format !== "svg" ? (
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
          accept={format === "svg" ? "image/svg+xml" : "image/*"}
          onLoad={async (files) =>
            setInput(await convertFileToDataUrl(files[0], format, quality))
          }
        />
      </div>
    );
  };

  const renderExplanation = () => (
    <>
      <h2>What is a Data URL?</h2>
      <p>
        A data URL (Uniform Resource Locator) is a type of URI (Uniform Resource
        Identifier) scheme that allows you to include data in-line in web pages
        as if they were external resources. Instead of referencing an external
        file, the data URL allows you to embed the actual data directly within
        the URL itself.
      </p>
      <p>The general syntax of a data URL looks like this:</p>
      <pre>data:[&#x3C;mediatype&#x3E;][;base64],&#x3C;data&#x3E;</pre>
      <p>Here&apos;s a breakdown of the components:</p>
      <ul>
        <li>
          <code>&#x3C;mediatype&#x3E;</code>: This is an optional parameter that
          specifies the MIME type of the data. For example,
          &quot;text/plain&quot;, &quot;image/jpeg&quot;,
          &quot;application/pdf&quot;, etc.
        </li>
        <li>
          <code>;base64</code>: This is an optional parameter indicating that
          the data is Base64-encoded. If present, it means that the data portion
          is encoded in Base64 format.
        </li>
        <li>
          <code>&#x3C;data&#x3E;</code>: This is the actual data that you want
          to include. If ;base64 is used, this data is encoded in Base64;
          otherwise, it is in plain text.
        </li>
      </ul>
      <p>
        Data URLs are commonly used for small amounts of data, such as small
        images, CSS stylesheets, or even small scripts. They can be useful in
        situations where external file references are impractical or when you
        want to reduce the number of HTTP requests for external resources,
        potentially improving page load performance. However, they may not be
        suitable for large files due to increased URL length and other
        considerations.
      </p>
    </>
  );

  return (
    <Utiliti
      label="DataURL"
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
      renderReadFile={renderReadFile}
      renderExplanation={renderExplanation}
    />
  );
}
