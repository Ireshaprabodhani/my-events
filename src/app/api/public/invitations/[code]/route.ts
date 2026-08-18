import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { ApiResponse } from "@/types/api"

interface Params {
  params: Promise<{ code: string }>
}

export async function GET(_req: Request, { params }: Params) {
  const { code } = await params

  const invitation = await prisma.invitation.findUnique({
    where: { code },
    select: {
      id: true,
      code: true,
      status: true,
      expiresAt: true,
      guest: {
        select: {
          firstName: true,
          lastName: true,
          plusOneAllowed: true,
        },
      },
      event: {
        select: {
          title: true,
          date: true,
          location: true,
          locationDetails: true,
          description: true,
        },
      },
      rsvp: {
        select: { response: true },
      },
    },
  })

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
  }

  return NextResponse.json({ data: invitation } satisfies ApiResponse)
}
