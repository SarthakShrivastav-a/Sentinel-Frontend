import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MonitorStatusBadgeProps {
  status: string
  showText?: boolean
}

export function MonitorStatusBadge({ status, showText = false }: MonitorStatusBadgeProps) {
  const isUp = status === "UP"

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2 py-0.5 text-xs font-medium",
        isUp
          ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
          : "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
      )}
    >
      <span className={cn("mr-1 inline-block h-2 w-2 rounded-full", isUp ? "bg-green-500" : "bg-red-500")} />
      {showText && (isUp ? "Online" : "Offline")}
    </Badge>
  )
}
