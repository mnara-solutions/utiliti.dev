export default function convertFilesToText(files: File[]): Promise<string[]> {
  return Promise.all(files.map((f) => f.text()));
}

export async function setTextInputFromFiles(
  files: File[],
  setInput: (text: string) => void,
) {
  setInput((await convertFilesToText(files))[0]);
}
