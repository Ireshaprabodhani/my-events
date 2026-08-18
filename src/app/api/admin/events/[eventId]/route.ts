import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateEventSchema } from "@/lib/validations/event"
import type { ApiResponse } from "@/types/api"

interface Params {
  params: Promise<{ eventId: string }>
}

export async function GET(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { eventId } = await params
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      guestCategories: true,
      _count: { select: { guests: true, invitations: true, reviews: true } },
    },
  })

  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 })

  return NextResponse.json({ data: event } satisfies ApiResponse)
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { eventId } = await params
  const body = await req.json()
  const parsed = updateEventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 })
  }

  const event = await prisma.event.update({
    where: { id: eventId },
    data: parsed.data,
  })

  return NextResponse.json({ data: event } satisfies ApiResponse)
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { eventId } = await params
  await prisma.event.delete({ where: { id: eventId } })

  return NextResponse.json({ message: "Event deleted" } satisfies ApiResponse)
}
