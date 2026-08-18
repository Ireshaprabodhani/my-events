import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/admin/page-header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/helpers/dates"
import { EmptyState } from "@/components/shared/empty-state"

interface Props {
  params: Promise<{ eventId: string }>
}

export const metadata: Metadata = { title: "Invitations" }

const statusColors: Record<string, string> = {
  PENDING: "secondary",
  SENT: "default",
  VIEWED: "outline",
  RESPONDED: "default",
}

export default async function InvitationsPage({ params }: Props) {
  const { eventId } = await params
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      invitations: {
        include: { guest: true, rsvp: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!event) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Invitations — ${event.title}`}
        description={`${event.invitations.length} invitations`}
      />

      {event.invitations.length === 0 ? (
        <EmptyState
          title="No invitations yet"
          description="Add guests first, then generate invitation links for them."
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>RSVP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.invitations.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    {inv.guest.firstName} {inv.guest.lastName}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {inv.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[inv.status] as "default" | "secondary" | "outline" | "destructive"}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {inv.sentAt ? formatDate(inv.sentAt) : "—"}
                  </TableCell>
                  <TableCell>
                    {inv.rsvp ? (
                      <Badge variant={inv.rsvp.response === "ATTENDING" ? "default" : "secondary"}>
                        {inv.rsvp.response}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Pending</span>
                    )}
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
