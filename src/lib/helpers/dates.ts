import { format, formatDistanceToNow, isPast, isValid } from "date-fns"

export function formatDate(date: Date | string, pattern = "PPP"): string {
  const d = typeof date === "string" ? new Date(date) : date
  if (!isValid(d)) return "Invalid date"
  return format(d, pattern)
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, "PPP p")
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function isExpired(date: Date | string | null | undefined): boolean {
  if (!date) return false
  const d = typeof date === "string" ? new Date(date) : date
  return isPast(d)
}
