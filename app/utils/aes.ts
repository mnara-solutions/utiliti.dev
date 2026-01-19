const ALGORITHM = "AES-GCM";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function encrypt(
  plaintext: string,
  password: string,
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: iv },
    key,
    encoder.encode(plaintext),
  );

  const combined = new Uint8Array(
    salt.length + iv.length + ciphertext.byteLength,
  );
  combined.set(salt);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

  return arrayToBase64(combined);
}

export async function decrypt(
  ciphertext: string,
  password: string,
): Promise<string> {
  const decoded = base64ToArray(ciphertext);
  const salt = decoded.slice(0, 16);
  const iv = decoded.slice(16, 28);
  const cipher = decoded.slice(28);
  const key = await deriveKey(password, salt);

  const plaintext = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: iv },
    key,
    cipher,
  );
  return decoder.decode(plaintext);
}

async function deriveKey(password: string, salt: BufferSource) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

function base64ToArray(data: string) {
  return Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
}

/**
 * Previously this function performed `String.fromCharCode(...data)` which blew through the maximum call stack size,
 * as the spread operator was building up a stack. Let's make sure we don't do that again.
 * @param data
 */
function arrayToBase64(data: Uint8Array<ArrayBuffer>) {
  return btoa(data.reduce((acc, it) => acc + String.fromCharCode(it), ""));
}
