import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Monitor } from "@/lib/types"
import { MonitorStatusBadge } from "./monitor-status-badge"
import { formatDate } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

interface MonitorCardProps {
  monitor: Monitor
}

export function MonitorCard({ monitor }: MonitorCardProps) {
  return (
    <Link href={`/dashboard/monitors/${monitor.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="truncate text-base">{monitor.url}</CardTitle>
            <MonitorStatusBadge status="UP" />
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Trigger On</p>
              <p className="font-medium">{monitor.errorCondition.triggerOn}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Threshold</p>
              <p className="font-medium">{monitor.errorCondition.threshold}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-2">
          <p className="text-xs text-muted-foreground">Created: {formatDate(monitor.createdAt)}</p>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </CardFooter>
      </Card>
    </Link>
  )
}
