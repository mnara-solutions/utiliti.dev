import type { ChangeEvent } from "react";
import { useCallback } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import IconButton from "~/components/icon-button";
import { convertToFileFormat } from "~/utils/convert-image-file";

interface Props {
  readonly accept: string;
  readonly onLoad: (value: string, fileName: string) => void;
  readonly onError?: (error: string) => void;
  readonly type?: "text" | "dataURL";
  readonly format?: string;
  readonly quality?: string;
  readonly multiple?: boolean;
}

const imageFormats: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export default function ReadFile({
  accept,
  onLoad,
  onError = undefined,
  multiple = false,
  type = "text",
  format = "jpg",
  quality = "0",
}: Props) {
  const onButtonClick = useCallback(
    () => document.getElementById("file-input")?.click(),
    [],
  );
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files || [];

      // stop, no file selected
      if (files.length === 0) {
        return;
      }

      Array.from(files).forEach((file) => {
        const maxAllowedSize = 10 * 1024 * 1024;

        // stop if we are passed a certain limit
        if (file.size > maxAllowedSize) {
          if (onError) {
            onError(`File is too large. Max size is ${maxAllowedSize} bytes.`);
          }
          return;
        }

        // read file
        const reader = new FileReader();

        reader.addEventListener("load", function (e) {
          onLoad((e.target?.result || "").toString(), file.name);
        });

        reader.addEventListener("error", function (e) {
          if (onError) {
            onError((e.target?.error || "").toString());
          }
        });

        switch (type) {
          case "text":
            reader.readAsText(file);
            break;
          case "dataURL":
            const fileFormat = imageFormats[file.type];
            if (
              (fileFormat && fileFormat !== format) ||
              (quality != "0" && format !== "png")
            ) {
              convertToFileFormat(file, format || "jpg", parseFloat(quality))
                .then((dataUrl) => {
                  onLoad(dataUrl, file.name);
                })
                .catch((_) => {
                  console.error(
                    "Something went wrong, trying plain old read as dataurl",
                  );
                  reader.readAsDataURL(file);
                });
            } else {
              reader.readAsDataURL(file);
            }
            break;
        }
      });
    },
    [onLoad, onError, type, format, quality],
  );

  return (
    <>
      <IconButton
        icon={PaperClipIcon}
        label="Load file"
        onClick={onButtonClick}
        tooltipPlacement="bottom"
      />
      <input
        type="file"
        id="file-input"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={onChange}
      />
    </>
  );
}
