const formatImage: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function convertToFileFormat(
  file: File | string,
  format: string,
  quality: number,
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
        canvas.width = img.width;
        canvas.height = img.height;

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
          resolve(canvas.toDataURL(formatImage[format], quality));
        } else {
          resolve(canvas.toDataURL(formatImage[format]));
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
