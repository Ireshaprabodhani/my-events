import type { DefaultSession } from "next-auth"

export type AdminSession = {
  user: {
    id: string
    name: string
    email: string
    role: string
  } & DefaultSession["user"]
}
