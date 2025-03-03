import type { ChangeEvent } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import IconButton from "~/components/icon-button";

interface Props {
  readonly accept: string;
  readonly multiple?: boolean;
  readonly onLoad: (files: File[]) => void;
  readonly onError?: (error: string) => void;
}

export default function ReadFile({
  accept,

  multiple = false,
  onLoad,
  onError,
}: Props) {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];

    // stop, no file selected
    if (files.length === 0) {
      return;
    }

    const filesArray = Array.from(files);

    // ensure all files are under the size limit
    filesArray.forEach((file) => {
      const maxAllowedSize = 10 * 1024 * 1024;

      // stop if we are passed a certain limit
      if (file.size > maxAllowedSize) {
        if (onError) {
          onError(`File is too large. Max size is ${maxAllowedSize} bytes.`);
        }
        return;
      }
    });

    onLoad(filesArray);
  };

  return (
    <>
      <IconButton
        icon={PaperClipIcon}
        label="Load file"
        onClick={() => document.getElementById("file-input")?.click()}
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
