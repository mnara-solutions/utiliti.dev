import type { MetaFunction } from "@remix-run/cloudflare";
import DataUrlDisplay from "~/components/dataurl-display";

export const meta: MetaFunction = () => ({
  title: "DataUrl | Utiliti",
});

function isImage(dataUrl: string, fileType: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve(true);
    };
    image.onerror = () => {
      resolve(false);
    };
    image.src = `data:${fileType};base64,${dataUrl}`;
  });
}

async function display(text: string): Promise<string> {
  try {
    if (text.substring(0, 5) === "data:") {
      return text;
    } else {
      const fileTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
        "image/gif",
        "image/svg+xml",
      ];
      for (let i = 0; i < fileTypes.length; i++) {
        if (await isImage(text, fileTypes[i]))
          return `data:${fileTypes[i]};base64,${text}`;
      }

      return "";
    }
  } catch (e) {
    return Promise.reject({ message: (e as DOMException).message });
  }
}

export default function DataUrl() {
  return <DataUrlDisplay label="DataUrl" display={display} rows={10} />;
}
