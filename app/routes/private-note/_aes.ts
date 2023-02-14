const ALGORITHM = "AES-GCM";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function encrypt(
  plaintext: string,
  password: string
): Promise<string> {
  const key = await generateKey(password);
  const iv = await crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: iv },
    key,
    encoder.encode(plaintext)
  );

  return arrayToBase64(
    Array.from(iv).concat(Array.from(new Uint8Array(ciphertext)))
  );
}

export async function decrypt(
  ciphertext: string,
  password: string
): Promise<string> {
  const key = await generateKey(password);
  const decoded = base64ToArray(ciphertext);
  const iv = decoded.slice(0, 12);
  const cipher = decoded.slice(12);

  return decoder.decode(
    await crypto.subtle.decrypt({ name: ALGORITHM, iv: iv }, key, cipher)
  );
}

async function generateKey(password: string): Promise<CryptoKey> {
  const keyData = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(password)
  );

  return await crypto.subtle.importKey("raw", keyData, ALGORITHM, false, [
    "encrypt",
    "decrypt",
  ]);
}

function base64ToArray(data: string) {
  return Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
}

function arrayToBase64(data: number[]) {
  return btoa(String.fromCharCode(...data));
}
