import type { ChangeEvent } from "react";
import { useCallback } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";

interface Props {
  readonly accept: string;
  readonly onLoad: (value: string) => void;
}
export default function ReadFile({ accept, onLoad }: Props) {
  const onButtonClick = useCallback(
    () => document.getElementById("file-input")?.click(),
    []
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
      reader.readAsText(file);
    },
    [onLoad]
  );

  return (
    <button
      type="button"
      className="inline-flex justify-center p-2 rounded cursor-pointer text-gray-400 hover:text-white hover:bg-zinc-600"
      onClick={onButtonClick}
    >
      <input
        type="file"
        id="file-input"
        accept={accept}
        className="hidden"
        onChange={onChange}
      />
      <PaperClipIcon className="w-5 h-5" />
      <span className="sr-only">Load file</span>
    </button>
  );
}
