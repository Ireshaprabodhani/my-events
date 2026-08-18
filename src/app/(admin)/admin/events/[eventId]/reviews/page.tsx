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
import { Star } from "lucide-react"

interface Props {
  params: Promise<{ eventId: string }>
}

export const metadata: Metadata = { title: "Reviews" }

export default async function ReviewsPage({ params }: Props) {
  const { eventId } = await params
  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) notFound()

  const reviews = await prisma.review.findMany({
    where: { eventId },
    orderBy: { submittedAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Reviews — ${event.title}`}
        description={`${reviews.length} reviews, ${reviews.filter((r) => !r.isApproved).length} pending moderation`}
      />

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Reviews submitted by guests will appear here." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.reviewerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{review.rating}/5</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {review.title && (
                      <p className="font-medium text-sm">{review.title}</p>
                    )}
                    <p className="text-sm text-muted-foreground truncate">{review.body}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={review.isApproved ? "default" : "secondary"}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(review.submittedAt)}
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
