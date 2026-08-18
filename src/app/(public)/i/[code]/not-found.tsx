import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function InvitationNotFound() {
  return (
    <div className="container max-w-md py-24 px-4">
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Invitation Not Found</CardTitle>
          <CardDescription>
            This invitation link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please check the link in your invitation message or contact the event organizer.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
