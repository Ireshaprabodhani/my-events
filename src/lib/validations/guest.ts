import { z } from "zod"

export const createGuestSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  categoryId: z.string().optional(),
  plusOneAllowed: z.boolean().default(false),
  notes: z.string().max(1000).optional(),
})

export type CreateGuestInput = z.infer<typeof createGuestSchema>
export const updateGuestSchema = createGuestSchema.partial()
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>
