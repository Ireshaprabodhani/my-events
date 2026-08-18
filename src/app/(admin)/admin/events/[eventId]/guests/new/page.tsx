import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/admin/page-header"
import { GuestForm } from "@/components/guests/guest-form"

interface Props {
  params: Promise<{ eventId: string }>
}

export const metadata: Metadata = { title: "Add Guest" }

export default async function NewGuestPage({ params }: Props) {
  const { eventId } = await params
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { guestCategories: true },
  })

  if (!event) notFound()

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Add Guest"
        description={`Add a new guest to ${event.title}`}
      />
      <GuestForm eventId={eventId} categories={event.guestCategories} />
    </div>
  )
}
