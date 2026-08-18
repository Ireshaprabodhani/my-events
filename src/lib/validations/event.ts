import { z } from "zod"

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  date: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  location: z.string().optional(),
  locationDetails: z.string().optional(),
  maxGuests: z.coerce.number().int().positive().optional(),
  rsvpDeadline: z.coerce.date().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).default("DRAFT"),
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export const updateEventSchema = createEventSchema.partial()
export type UpdateEventInput = z.infer<typeof updateEventSchema>
