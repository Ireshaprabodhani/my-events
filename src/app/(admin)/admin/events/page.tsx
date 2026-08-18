import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/admin/page-header"
import { prisma } from "@/lib/prisma"
import { EventStatusBadge } from "@/components/events/event-status-badge"
import { formatDate } from "@/lib/helpers/dates"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"

export const metadata: Metadata = {
  title: "Events",
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: {
      _count: { select: { guests: true } },
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Manage all your events"
        action={
          <Button render={<Link href="/admin/events/new" />}>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        }
      />

      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create your first event to get started."
          action={
            <Button render={<Link href="/admin/events/new" />}>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12.5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      {event.location && (
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(event.date)}
                  </TableCell>
                  <TableCell>{event._count.guests}</TableCell>
                  <TableCell>
                    <EventStatusBadge status={event.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      render={<Link href={`/admin/events/${event.id}`} />}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
