import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { MonitorCheckHistory } from "@/lib/types"
import { MonitorStatusBadge } from "./monitor-status-badge"
import { formatDate } from "@/lib/utils"

interface MonitorCheckHistoryTableProps {
  checks?: MonitorCheckHistory[] | null
}

export function MonitorCheckHistoryTable({ checks = [] }: MonitorCheckHistoryTableProps) {
  const checkHistory = checks || []

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Response Time</TableHead>
            <TableHead>Status Code</TableHead>
            <TableHead>Content Match</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checkHistory.length > 0 ? (
            checkHistory.map((check) => (
              <TableRow key={check.id}>
                <TableCell>{formatDate(check.timestamp)}</TableCell>
                <TableCell>
                  <MonitorStatusBadge status={check.status} showText />
                </TableCell>
                <TableCell>{check.responseTime}ms</TableCell>
                <TableCell>{check.statusCode}</TableCell>
                <TableCell>{check.contentMatch ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No check history available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
