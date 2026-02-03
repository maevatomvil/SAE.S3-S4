import crypto from "crypto"

export function createSessionToken() {
  return crypto.randomUUID()
}
