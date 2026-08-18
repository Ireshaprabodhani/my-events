import { z } from "zod"

export const submitReviewSchema = z.object({
  eventId: z.string(),
  reviewerName: z.string().min(1, "Name is required").max(200),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().min(1, "Review text is required").max(2000),
  invitationCode: z.string().optional(),
})

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>
