import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createEventSchema } from "@/lib/validations/event"
import { generateEventSlug } from "@/lib/utils"
import type { ApiResponse } from "@/types/api"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { guests: true } } },
  })

  return NextResponse.json({ data: events } satisfies ApiResponse)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createEventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", message: parsed.error.message },
      { status: 400 }
    )
  }

  const slug = generateEventSlug(parsed.data.title, new Date(parsed.data.date))

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      slug,
      createdById: session.user.id,
    },
  })

  return NextResponse.json({ data: event } satisfies ApiResponse, { status: 201 })
}
