import { Badge } from "@/components/ui/badge"

interface CronJobStatusBadgeProps {
  status: string
}

export function CronJobStatusBadge({ status }: CronJobStatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
  let label = status

  switch (status.toUpperCase()) {
    case "UP":
    case "SUCCESS":
    case "ACTIVE":
      variant = "default"
      label = "Active"
      break
    case "DOWN":
    case "FAILED":
    case "ERROR":
      variant = "destructive"
      label = "Failed"
      break
    case "PENDING":
    case "WAITING":
      variant = "secondary"
      label = "Pending"
      break
    case "UNKNOWN":
    default:
      variant = "outline"
      label = "Unknown"
  }

  return <Badge variant={variant}>{label}</Badge>
}
