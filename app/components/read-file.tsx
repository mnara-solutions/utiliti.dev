import type { ChangeEvent } from "react";
import { useCallback } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import IconButton from "~/components/icon-button";

interface Props {
  readonly accept: string;
  readonly onLoad: (value: string) => void;
  readonly type?: "text" | "dataURL";
}

export default function ReadFile({ accept, onLoad, type = "text" }: Props) {
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

      const file = files[0];
      const maxAllowedSize = 10 * 1024 * 1024;

      // stop if we are passed a certain limit
      if (file.size > maxAllowedSize) {
        return;
      }

      // read file
      const reader = new FileReader();
      reader.addEventListener("load", function (e) {
        onLoad((e.target?.result || "").toString());
      });

      switch (type) {
        case "text":
          reader.readAsText(file);
          break;
        case "dataURL":
          reader.readAsDataURL(file);
          break;
      }
    },
    [onLoad, type],
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
        className="hidden"
        onChange={onChange}
      />
    </>
  );
}
