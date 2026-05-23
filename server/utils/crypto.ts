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
