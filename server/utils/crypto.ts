/**
 * AES-GCM encrypt/decrypt utilities using the Web Crypto API.
 * Available globally in Node 18+ — no imports required.
 *
 * Output format: base64url( iv[12 bytes] || ciphertext )
 *
 * Key derivation: PBKDF2 with 1 iteration over a fixed salt.
 * The low iteration count is intentional — NUXT_CRYPTO_SECRET is expected
 * to be a high-entropy random string, not a human password. The fixed salt
 * provides determinism (same secret → same key) which is required for
 * stateless decryption across requests.
 */

const SALT = new TextEncoder().encode('zeemic-proxy-v1')

async function deriveKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: SALT, iterations: 1, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    usage,
  )
}

/**
 * Encrypt a plaintext string.
 * Returns a base64url-encoded string of (12-byte random IV || AES-GCM ciphertext).
 * A fresh random IV is generated per call — no IV reuse is possible.
 */
export async function encryptParam(value: string, secret: string): Promise<string> {
  const key = await deriveKey(secret, ['encrypt'])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder()

  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(value))

  const combined = new Uint8Array(12 + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), 12)

  return Buffer.from(combined).toString('base64url')
}

/**
 * Decrypt a base64url-encoded string produced by encryptParam.
 */
export async function decryptParam(ciphertext: string, secret: string): Promise<string> {
  const key = await deriveKey(secret, ['decrypt'])
  const data = Buffer.from(ciphertext, 'base64url')
  const iv = data.subarray(0, 12)
  const encrypted = data.subarray(12)

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)
  return new TextDecoder().decode(decrypted)
}

/**
 * Encrypts cursor/limit params for GET /job and GET /business, per the
 * backend's `parseQueryParams` contract. This is a *different* wire format
 * from encryptParam/decryptParam above:
 *  - key is the raw UTF-8 bytes of the secret, imported directly (no PBKDF2)
 *  - output is "<ivBase64>:<ciphertextBase64>", not a single concatenated blob
 *  - plaintext is double-JSON-wrapped (the backend calls JSON.parse twice)
 */
export async function encryptListQuery(
  payload: { cursor?: string; limit?: number },
  secret: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  )
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = JSON.stringify({ q: JSON.stringify(payload) })

  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext))

  const ivB64 = Buffer.from(iv).toString('base64')
  const cipherB64 = Buffer.from(ciphertext).toString('base64')
  return `${ivB64}:${cipherB64}`
}
