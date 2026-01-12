import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { useState } from "react";
import Dropdown from "~/components/dropdown";
import Utiliti from "~/components/utiliti";
import ReadFile from "~/components/read-file";
import { convertFileToDataUrl } from "~/utils/convert-image-file";
import { useFileDrop } from "~/hooks/use-file-drop";

export const meta = metaHelper(
  utilities.dataurl.name,
  "Display and decode data URLs privately. Convert images to Base64 data URLs entirely in your browser—your files never leave your device.",
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
  const handleDrop = useCallback(
    async (files: File[]) => {
      if (files.length > 0) {
        setInput(await convertFileToDataUrl(files[0], format, quality));
      }
    },
    [setInput, format, quality],
  );

  const { ref: drop, isOver } = useFileDrop({
    onDrop: handleDrop,
    accept: "image/*",
  });

  return (
    <textarea
      id="input"
      rows={10}
      className={
        "block px-2 py-2 font-mono w-full lg:text-sm bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400 " +
        (isOver
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
      <h2>Why Use Utiliti&apos;s Data URL Tool?</h2>
      <p>
        Data URLs often contain embedded images, documents, or other files that
        may be sensitive—profile pictures, scanned documents, or proprietary
        graphics. Many online data URL tools upload your files to their servers
        for processing.
      </p>
      <p>
        Utiliti&apos;s Data URL viewer runs{" "}
        <strong>entirely in your browser</strong>. Your files and data URLs
        never leave your device, making it safe to work with:
      </p>
      <ul>
        <li>
          <strong>Embedded Images</strong>: Preview Base64-encoded images from
          emails or HTML files
        </li>
        <li>
          <strong>API Responses</strong>: View images returned as data URLs from
          APIs
        </li>
        <li>
          <strong>Sensitive Documents</strong>: Decode data URLs containing
          private files
        </li>
        <li>
          <strong>Debug Assets</strong>: Inspect embedded resources in web
          applications
        </li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Auto-detection</strong>: Automatically detects the image type
          even if the data URL prefix is missing
        </li>
        <li>
          <strong>Multiple Formats</strong>: Supports JPEG, PNG, WebP, and SVG
          images
        </li>
        <li>
          <strong>Quality Control</strong>: Adjust compression quality when
          converting images to data URLs
        </li>
        <li>
          <strong>Drag & Drop</strong>: Simply drag an image file onto the input
          area to convert it
        </li>
        <li>
          <strong>Instant Preview</strong>: See the decoded image immediately
          after pasting
        </li>
      </ul>

      <h2>How to Use</h2>
      <ol>
        <li>
          <strong>Paste a data URL</strong>: Enter a complete data URL or just
          the Base64-encoded string
        </li>
        <li>
          <strong>Or upload a file</strong>: Drag and drop an image or use the
          file picker to convert an image to a data URL
        </li>
        <li>
          <strong>Choose format & quality</strong>: Select output format and
          compression level for conversions
        </li>
        <li>
          <strong>View the result</strong>: Click Display to see the decoded
          image
        </li>
      </ol>

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

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>Email Debugging</strong>: View embedded images from HTML
          emails that use data URLs
        </li>
        <li>
          <strong>CSS Development</strong>: Create data URLs for small icons to
          embed directly in stylesheets
        </li>
        <li>
          <strong>Single-File HTML</strong>: Generate data URLs for creating
          self-contained HTML documents
        </li>
        <li>
          <strong>API Testing</strong>: Inspect image data returned by APIs in
          Base64 format
        </li>
        <li>
          <strong>Performance Optimization</strong>: Convert small images to
          data URLs to reduce HTTP requests
        </li>
      </ul>

      <h2>Data URL Size Considerations</h2>
      <p>
        While data URLs are convenient, they increase the size of your HTML/CSS
        by approximately 33% compared to the original binary file (due to Base64
        encoding overhead). They&apos;re best suited for small files under 10KB.
        For larger images, traditional file references with proper caching are
        usually more efficient.
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
