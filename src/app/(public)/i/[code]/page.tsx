import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/helpers/dates"
import { isExpired } from "@/lib/helpers/dates"
import { RsvpForm } from "@/components/rsvp/rsvp-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

interface Props {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const invitation = await prisma.invitation.findUnique({
    where: { code },
    include: { event: true },
  })
  if (!invitation) return { title: "Invitation Not Found" }
  return { title: `You're invited to ${invitation.event.title}` }
}

export default async function InvitationPage({ params }: Props) {
  const { code } = await params

  const invitation = await prisma.invitation.findUnique({
    where: { code },
    include: {
      guest: true,
      event: true,
      rsvp: true,
    },
  })

  if (!invitation) notFound()

  // Mark as viewed on first open
  if (!invitation.viewedAt) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { viewedAt: new Date(), status: "VIEWED" },
    })
  }

  const expired = isExpired(invitation.expiresAt)

  return (
    <div className="container max-w-2xl py-12 px-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="mb-4">
            Personal Invitation
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{invitation.event.title}</h1>
          <p className="text-xl text-muted-foreground">
            Dear {invitation.guest.firstName},<br />
            you are cordially invited.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{formatDate(invitation.event.date, "PPPP")}</span>
            </div>
            {invitation.event.location && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{invitation.event.location}</span>
              </div>
            )}
            {invitation.event.locationDetails && (
              <p className="text-sm text-muted-foreground pl-7">
                {invitation.event.locationDetails}
              </p>
            )}
          </CardContent>
        </Card>

        {invitation.event.description && (
          <p className="text-center text-muted-foreground">{invitation.event.description}</p>
        )}

        <Card>
          <CardHeader>
            <CardTitle>RSVP</CardTitle>
            <CardDescription>
              {invitation.rsvp
                ? "You have already submitted your response. Thank you!"
                : expired
                ? "The RSVP deadline has passed."
                : "Please let us know if you can attend."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitation.rsvp ? (
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="font-medium">
                  Your response:{" "}
                  <Badge>
                    {invitation.rsvp.response.replace("_", " ")}
                  </Badge>
                </p>
                {invitation.rsvp.message && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    &ldquo;{invitation.rsvp.message}&rdquo;
                  </p>
                )}
              </div>
            ) : expired ? (
              <p className="text-sm text-muted-foreground text-center">
                The RSVP deadline has passed. Please contact the organizer directly.
              </p>
            ) : (
              <RsvpForm
                invitationId={invitation.id}
                guestFirstName={invitation.guest.firstName}
                plusOneAllowed={invitation.guest.plusOneAllowed}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
