import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { GuestTable } from "@/components/guests/guest-table"

interface Props {
  params: Promise<{ eventId: string }>
}

export const metadata: Metadata = { title: "Guests" }

export default async function GuestsPage({ params }: Props) {
  const { eventId } = await params
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      guests: {
        include: { category: true, rsvp: true, invitation: true },
        orderBy: { lastName: "asc" },
      },
      guestCategories: true,
    },
  })

  if (!event) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Guests — ${event.title}`}
        description={`${event.guests.length} guests`}
        action={
          <Button render={<Link href={`/admin/events/${eventId}/guests/new`} />}>
            <Plus className="mr-2 h-4 w-4" />
            Add Guest
          </Button>
        }
      />
      <GuestTable guests={event.guests} eventId={eventId} />
    </div>
  )
}
