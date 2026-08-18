import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createGuestSchema } from "@/lib/validations/guest"
import type { ApiResponse } from "@/types/api"

interface Params {
  params: Promise<{ eventId: string }>
}

export async function GET(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { eventId } = await params
  const guests = await prisma.guest.findMany({
    where: { eventId },
    include: { category: true, rsvp: true, invitation: true },
    orderBy: { lastName: "asc" },
  })

  return NextResponse.json({ data: guests } satisfies ApiResponse)
}

export async function POST(req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { eventId } = await params
  const body = await req.json()
  const parsed = createGuestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 })
  }

  // Convert empty string email to null
  const email = parsed.data.email || null

  const guest = await prisma.guest.create({
    data: {
      ...parsed.data,
      email,
      eventId,
    },
  })

  return NextResponse.json({ data: guest } satisfies ApiResponse, { status: 201 })
}
