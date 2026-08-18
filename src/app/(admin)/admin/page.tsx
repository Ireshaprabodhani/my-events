import type { Metadata } from "next"
import { PageHeader } from "@/components/admin/page-header"
import { StatsCard } from "@/components/admin/stats-card"
import { prisma } from "@/lib/prisma"
import { Calendar, Users, ClipboardList, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const [eventCount, guestCount, rsvpCount, pendingReviews] = await Promise.all([
    prisma.event.count(),
    prisma.guest.count(),
    prisma.rSVP.count(),
    prisma.review.count({ where: { isApproved: false } }),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of all your events and guests"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Events"
          value={eventCount}
          icon={Calendar}
          href="/admin/events"
        />
        <StatsCard
          title="Total Guests"
          value={guestCount}
          icon={Users}
        />
        <StatsCard
          title="RSVPs Received"
          value={rsvpCount}
          icon={ClipboardList}
        />
        <StatsCard
          title="Pending Reviews"
          value={pendingReviews}
          icon={Star}
          description="Awaiting moderation"
        />
      </div>
    </div>
  )
}
