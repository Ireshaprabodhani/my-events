import { z } from "zod"

export const submitRsvpSchema = z.object({
  invitationId: z.string(),
  response: z.enum(["ATTENDING", "NOT_ATTENDING", "MAYBE"]),
  plusOneName: z.string().max(200).optional(),
  dietaryNeeds: z.string().max(500).optional(),
  message: z.string().max(1000).optional(),
})

export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>
