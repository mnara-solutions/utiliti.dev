import { cleanSvg, encodeSvg } from "~/utils/svg-utils";
import { ResizeType } from "~/routes/image-converter";

const imageFormats: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function extensionFromFormat(extension: string): string {
  return (
    Object.keys(imageFormats).find((key) => imageFormats[key] === extension) ||
    "jpg"
  );
}

export function convertFileToDataUrl(
  file: File,
  format: string,
  quality: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", function (e) {
      let value = (e.target?.result || "").toString();
      if (format === "svg") {
        value = cleanSvg(value);
        // Replace double quotes with single quotes
        value = value.replace(/"/g, "'");
        value = encodeSvg(value);
        value = `data:image/svg+xml;utf8,${value}`;
      }
      resolve(value);
    });

    reader.addEventListener("error", function (e) {
      reject((e.target?.error || "").toString());
    });

    const fileFormat = extensionFromFormat(file.type);
    if (format === "svg") {
      reader.readAsText(file);
    } else if (
      (fileFormat && fileFormat !== format) ||
      (quality != "0" && format !== "png")
    ) {
      convertToFileFormat(file, format, parseFloat(quality), ResizeType.none, 0)
        .then((dataUrl) => resolve(dataUrl))
        .catch((_) => {
          console.error(
            "Something went wrong, trying plain old read as DataURL.",
          );
          reader.readAsDataURL(file);
        });
    } else {
      reader.readAsDataURL(file);
    }
  });
}

export function convertToFileFormat(
  file: File | string,
  format: string,
  quality: number,
  resize: ResizeType,
  size: number,
): Promise<string> {
  return new Promise(
    (
      resolve: (dataUrl: string) => void,
      reject: (error: string) => void,
    ): void => {
      const img = new Image();

      // Set up an onload event handler to execute the conversion when the image is loaded
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        switch (resize) {
          case ResizeType.large:
            if (width > height) {
              width = size;
              height = (size * img.height) / img.width;
            } else {
              height = size;
              width = (size * img.width) / img.height;
            }
            break;
          case ResizeType.small:
            if (width > height) {
              height = size;
              width = (size * img.width) / img.height;
            } else {
              width = size;
              height = (size * img.height) / img.width;
            }
            break;
          case ResizeType.width:
            width = size;
            height = (size * img.height) / img.width;
            break;
          case ResizeType.height:
            height = size;
            width = (size * img.width) / img.height;
            break;
          case ResizeType.square:
            width = size;
            height = size;
            break;
        }

        canvas.width = width;
        canvas.height = height;
        // Get the 2D context of the canvas
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);
        } else {
          reject("Unable to get context");
        }

        // Convert the canvas content to a data URL (PNG format)
        if (quality !== 0) {
          resolve(canvas.toDataURL(imageFormats[format], quality));
        } else {
          resolve(canvas.toDataURL(imageFormats[format]));
        }
      };

      // Set the source of the image to the JPEG file
      if (typeof file === "string") {
        img.src = file;
      } else {
        img.src = URL.createObjectURL(file);
      }
    },
  );
}
