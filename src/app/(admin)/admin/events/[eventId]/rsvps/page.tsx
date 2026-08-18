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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/helpers/dates"
import { EmptyState } from "@/components/shared/empty-state"

interface Props {
  params: Promise<{ eventId: string }>
}

export const metadata: Metadata = { title: "RSVPs" }

export default async function RsvpsPage({ params }: Props) {
  const { eventId } = await params
  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) notFound()

  const rsvps = await prisma.rSVP.findMany({
    where: { guest: { eventId } },
    include: { guest: { include: { category: true } } },
    orderBy: { submittedAt: "desc" },
  })

  const attending = rsvps.filter((r) => r.response === "ATTENDING").length
  const notAttending = rsvps.filter((r) => r.response === "NOT_ATTENDING").length
  const maybe = rsvps.filter((r) => r.response === "MAYBE").length

  return (
    <div className="space-y-6">
      <PageHeader
        title={`RSVPs — ${event.title}`}
        description={`${rsvps.length} responses received`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{attending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Not Attending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{notAttending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Maybe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{maybe}</p>
          </CardContent>
        </Card>
      </div>

      {rsvps.length === 0 ? (
        <EmptyState title="No RSVPs yet" description="RSVPs will appear here as guests respond to their invitations." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Plus One</TableHead>
                <TableHead>Dietary Needs</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rsvps.map((rsvp) => (
                <TableRow key={rsvp.id}>
                  <TableCell>
                    {rsvp.guest.firstName} {rsvp.guest.lastName}
                  </TableCell>
                  <TableCell>
                    {rsvp.guest.category ? (
                      <Badge variant="outline">{rsvp.guest.category.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        rsvp.response === "ATTENDING"
                          ? "default"
                          : rsvp.response === "NOT_ATTENDING"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {rsvp.response.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{rsvp.plusOneName ?? "—"}</TableCell>
                  <TableCell>{rsvp.dietaryNeeds ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(rsvp.submittedAt)}
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
