export async function copyText(text: string) {
  try {
    return await navigator.clipboard.writeText(text);
  } catch (err) {
    console.log("Could not copy to clipboard.", err);
    return Promise.reject(err);
  }
}
