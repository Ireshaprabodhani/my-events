import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { ApiResponse } from "@/types/api"

interface Params {
  params: Promise<{ eventId: string }>
}

export async function GET(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { eventId } = await params
  const reviews = await prisma.review.findMany({
    where: { eventId },
    orderBy: { submittedAt: "desc" },
  })

  return NextResponse.json({ data: reviews } satisfies ApiResponse)
}

// PATCH — approve a review
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { eventId } = await params
  const { reviewId, isApproved } = await req.json()

  const review = await prisma.review.update({
    where: { id: reviewId, eventId },
    data: { isApproved, isPublic: isApproved },
  })

  return NextResponse.json({ data: review } satisfies ApiResponse)
}
