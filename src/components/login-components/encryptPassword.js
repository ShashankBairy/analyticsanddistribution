// encrptPassword.js
import CryptoJS from "crypto-js";

const PRE_SHARED_KEY_B64 = "R42FYg7zESO28+PZ7mIZte8H5ZiN6Fw5uQHWgcPqHko="; // same as server
const NUM_CHARS = 1; // MUST match server's NUM_CHARS_REMOVED

// --- helpers ---
function asciiToBytes(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i);
  return out;
}
function concatBytes(...parts) {
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}
function bytesToBase64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

// AES-ECB/PKCS7 → base64(ciphertext)
export function aesEncryptToBase64(plaintext) {
  const key = CryptoJS.enc.Base64.parse(PRE_SHARED_KEY_B64); // 32 bytes
  const pt = CryptoJS.enc.Utf8.parse(plaintext);

  const encrypted = CryptoJS.AES.encrypt(pt, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Ensure we get *ciphertext only* as base64:
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

/**
 * Produces the obfuscated payload (base64) expected by the server:
 * payload = base64( [cutIndex byte] + ASCII(modifiedBase64) + ASCII(removedChars) )
 *
 * Rules:
 * - Remove exactly NUM_CHARS chars starting at cutIndex.
 * - cutIndex chosen so that removed slice does NOT touch base64 padding at the end.
 */
export function encryptAndManipulate(plaintext, numChars=NUM_CHARS) {
  const base64 = aesEncryptToBase64(plaintext);

  // Count padding at end
  const padCount = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;

  if (numChars < 0) throw new Error("numChars must be >= 0");
  if (numChars > 3) throw new Error("numChars too large for this scheme (max 3 recommended)");

  // Max starting index to avoid cutting into final padding
  const maxCut = base64.length - padCount - numChars;
  if (maxCut < 0) {
    throw new Error("Base64 too short for requested numChars (would touch padding)");
  }

  // Choose a deterministic cutIndex (or random if you prefer)
  let cutIndex = Math.min(16, maxCut); // e.g., 16 if possible; otherwise clamp

  const removed = base64.slice(cutIndex, cutIndex + numChars);
  const modified = base64.slice(0, cutIndex) + base64.slice(cutIndex + numChars);

  const cutIndexByte = new Uint8Array([cutIndex & 0xff]);
  const payloadBytes = concatBytes(cutIndexByte, asciiToBytes(modified), asciiToBytes(removed));
  return bytesToBase64(payloadBytes);
}
