// Re-export JSZip for client-side only usage
// This file is marked as .client.ts to exclude it from the server bundle

export async function createZip(): Promise<import("jszip")> {
  const JSZip = (await import("jszip")).default;
  return new JSZip();
}

export type { default as JSZip } from "jszip";
