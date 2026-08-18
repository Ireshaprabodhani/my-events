import { customAlphabet } from "nanoid"

// Uppercase alphanumeric, no ambiguous chars (0, O, I, 1)
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const generateCode = customAlphabet(alphabet, 8)

export function generateInvitationCode(): string {
  return generateCode()
}
