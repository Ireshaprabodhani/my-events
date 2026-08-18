import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/admin/page-header"
import { EventStatusBadge } from "@/components/events/event-status-badge"
import { formatDate } from "@/lib/helpers/dates"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Mail, ClipboardList, Star } from "lucide-react"

interface Props {
  params: Promise<{ eventId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = await params
  const event = await prisma.event.findUnique({ where: { id: eventId } })
  return { title: event?.title ?? "Event" }
}

export default async function EventDetailPage({ params }: Props) {
  const { eventId } = await params

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      _count: {
        select: {
          guests: true,
          invitations: true,
          reviews: true,
        },
      },
    },
  })

  if (!event) notFound()

  const rsvpCount = await prisma.rSVP.count({
    where: { guest: { eventId } },
  })

  const sections = [
    {
      title: "Guests",
      value: event._count.guests,
      icon: Users,
      href: `/admin/events/${eventId}/guests`,
      description: "Manage guest list",
    },
    {
      title: "Invitations",
      value: event._count.invitations,
      icon: Mail,
      href: `/admin/events/${eventId}/invitations`,
      description: "Send & track invitations",
    },
    {
      title: "RSVPs",
      value: rsvpCount,
      icon: ClipboardList,
      href: `/admin/events/${eventId}/rsvps`,
      description: "Guest responses",
    },
    {
      title: "Reviews",
      value: event._count.reviews,
      icon: Star,
      href: `/admin/events/${eventId}/reviews`,
      description: "Post-event reviews",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={event.title}
        description={
          <span className="flex items-center gap-2">
            {formatDate(event.date)}
            {event.location && <span>— {event.location}</span>}
          </span>
        }
        action={<EventStatusBadge status={event.status} />}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Link key={section.title} href={section.href}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
                <section.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{section.value}</div>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {event.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About this event</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{event.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
