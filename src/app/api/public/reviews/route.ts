import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { submitReviewSchema } from "@/lib/validations/review"
import type { ApiResponse } from "@/types/api"

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = submitReviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 })
  }

  const event = await prisma.event.findUnique({
    where: { id: parsed.data.eventId },
    select: { id: true },
  })

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  const review = await prisma.review.create({
    data: {
      eventId: parsed.data.eventId,
      reviewerName: parsed.data.reviewerName,
      rating: parsed.data.rating,
      title: parsed.data.title ?? null,
      body: parsed.data.body,
      invitationCode: parsed.data.invitationCode ?? null,
      isApproved: false,
      isPublic: false,
    },
  })

  return NextResponse.json({ data: review } satisfies ApiResponse, { status: 201 })
}
