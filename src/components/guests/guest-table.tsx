import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

type Guest = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  category: { name: string; color: string | null } | null
  rsvp: { response: string } | null
  invitation: { code: string; status: string } | null
}

interface GuestTableProps {
  guests: Guest[]
  eventId: string
}

export function GuestTable({ guests, eventId }: GuestTableProps) {
  if (guests.length === 0) {
    return (
      <EmptyState
        title="No guests yet"
        description="Start adding guests to send them invitations."
        action={
          <Button render={<Link href={`/admin/events/${eventId}/guests/new`} />}>
            <Plus className="mr-2 h-4 w-4" />
            Add Guest
          </Button>
        }
      />
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Invitation</TableHead>
            <TableHead>RSVP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell className="font-medium">
                {guest.firstName} {guest.lastName}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {guest.email ?? guest.phone ?? "—"}
              </TableCell>
              <TableCell>
                {guest.category ? (
                  <Badge variant="outline">{guest.category.name}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell>
                {guest.invitation ? (
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {guest.invitation.code}
                  </code>
                ) : (
                  <span className="text-muted-foreground text-sm">Not sent</span>
                )}
              </TableCell>
              <TableCell>
                {guest.rsvp ? (
                  <Badge
                    variant={
                      guest.rsvp.response === "ATTENDING"
                        ? "default"
                        : guest.rsvp.response === "NOT_ATTENDING"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {guest.rsvp.response.replace("_", " ")}
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
  )
}
