import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateInvitationCode } from "@/lib/helpers/invitation-code"
import type { ApiResponse } from "@/types/api"

interface Params {
  params: Promise<{ eventId: string }>
}

export async function GET(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { eventId } = await params
  const invitations = await prisma.invitation.findMany({
    where: { eventId },
    include: { guest: true, rsvp: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ data: invitations } satisfies ApiResponse)
}

// POST — generate invitations for all guests in the event who don't have one yet
export async function POST(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { eventId } = await params

  const guestsWithoutInvitation = await prisma.guest.findMany({
    where: { eventId, invitation: null },
  })

  const invitations = await Promise.all(
    guestsWithoutInvitation.map(async (guest) => {
      const code = generateInvitationCode()
      return prisma.invitation.create({
        data: { code, guestId: guest.id, eventId },
      })
    })
  )

  return NextResponse.json(
    { data: invitations, message: `${invitations.length} invitations created` } satisfies ApiResponse,
    { status: 201 }
  )
}
