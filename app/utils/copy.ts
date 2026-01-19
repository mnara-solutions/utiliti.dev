export function copyText(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
