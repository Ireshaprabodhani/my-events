import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { submitRsvpSchema } from "@/lib/validations/rsvp"
import type { ApiResponse } from "@/types/api"

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = submitRsvpSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 })
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: parsed.data.invitationId },
    include: { rsvp: true },
  })

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
  }

  if (invitation.rsvp) {
    return NextResponse.json({ error: "RSVP already submitted" }, { status: 409 })
  }

  const rsvp = await prisma.rSVP.create({
    data: {
      invitationId: invitation.id,
      guestId: invitation.guestId,
      response: parsed.data.response,
      plusOneName: parsed.data.plusOneName ?? null,
      dietaryNeeds: parsed.data.dietaryNeeds ?? null,
      message: parsed.data.message ?? null,
    },
  })

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { status: "RESPONDED" },
  })

  return NextResponse.json({ data: rsvp } satisfies ApiResponse, { status: 201 })
}
