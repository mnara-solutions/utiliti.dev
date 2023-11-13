import type { ChangeEvent } from "react";
import { useCallback } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import IconButton from "~/components/icon-button";

interface Props {
  readonly accept: string;
  readonly onLoad: (value: string) => void;
  readonly type?: "text" | "dataURL";
  readonly format?: string;
  readonly quality?: string;
}

const imageFormats: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

const formatImage: Record<string, string> = {
     "jpg" :"image/jpeg",
     "png" : "image/png",
    "webp":"image/webp",
};

function convertToFileFormat(file: File, format: string, quality:number):Promise<string> {
    return new Promise((resolve:(dataUrl:string) => void, reject:(error:string) => void):void => {
        const img = new Image();

        // Set up an onload event handler to execute the conversion when the image is loaded
        img.onload = () => {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            // Get the 2D context of the canvas
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0);
            } else {
                reject("Unable to get context");
            }

            // Convert the canvas content to a data URL (PNG format)
            if (quality !== 0) {
                resolve( canvas.toDataURL(formatImage[format], quality));
            } else {
                resolve( canvas.toDataURL(formatImage[format]));
            }


        };

        // Set the source of the image to the JPEG file
        img.src = URL.createObjectURL(file);
    });
}

export default function ReadFile({ accept, onLoad, type = "text", format = "jpg", quality = "0" }: Props) {
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
          const fileFormat = imageFormats[file.type];
          if ((fileFormat && fileFormat !== format) || (quality != "0" && format !== 'png')) {
              convertToFileFormat(file, format || "jpg", parseFloat(quality)).then(dataUrl => {
                  onLoad(dataUrl);
              }).catch(_ => {
                  console.error('Something went wrong, trying plain old read as dataurl');
                  reader.readAsDataURL(file);
              })
          } else {
              reader.readAsDataURL(file);
          }
          break;
      }
    },
    [onLoad, type, format, quality],
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
