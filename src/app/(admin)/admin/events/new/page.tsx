import type { Metadata } from "next"
import { PageHeader } from "@/components/admin/page-header"
import { EventForm } from "@/components/events/event-form"

export const metadata: Metadata = {
  title: "New Event",
}

export default function NewEventPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Create Event"
        description="Set up a new event to start managing guests and invitations."
      />
      <EventForm />
    </div>
  )
}
