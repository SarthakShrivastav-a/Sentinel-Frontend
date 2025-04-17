"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface MonitorStatsSummaryProps {
  totalChecks: number
  upChecks: number
  downChecks: number
  currentStatus: string
  cumulativeDowntime: number
  cumulativeResponse: number
  consecutiveDowntimeCount: number
  averageResponseTime: number
}

export function MonitorStatsSummary({
  totalChecks,
  upChecks,
  downChecks,
  currentStatus,
  cumulativeDowntime,
  cumulativeResponse,
  consecutiveDowntimeCount,
  averageResponseTime,
}: MonitorStatsSummaryProps) {
  // Calculate uptime percentage
  const uptimePercentage = totalChecks > 0 ? (upChecks / totalChecks) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">
            {uptimePercentage > 95 ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : uptimePercentage > 80 ? (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uptimePercentage.toFixed(2)}%</div>
          <Progress
            value={uptimePercentage}
            className="h-2 mt-2"
            indicatorClassName={
              uptimePercentage > 95 ? "bg-green-500" : uptimePercentage > 80 ? "bg-amber-500" : "bg-red-500"
            }
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Total: {totalChecks}</span>
            <span className="text-green-600">Up: {upChecks}</span>
            <span className="text-red-600">Down: {downChecks}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageResponseTime.toFixed(2)}ms</div>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="text-xs font-normal">
              Cumulative: {cumulativeResponse}ms
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs font-normal ${averageResponseTime < 100 ? "bg-green-100 text-green-800 border-green-200" : averageResponseTime < 300 ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-red-100 text-red-800 border-red-200"}`}
            >
              {averageResponseTime < 100 ? "Fast" : averageResponseTime < 300 ? "Average" : "Slow"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Downtime</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cumulativeDowntime}s</div>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="text-xs font-normal">
              Consecutive: {consecutiveDowntimeCount}
            </Badge>
            <Badge variant={consecutiveDowntimeCount > 5 ? "destructive" : "outline"} className="text-xs font-normal">
              {consecutiveDowntimeCount > 5 ? "Critical" : "Normal"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`${currentStatus === "DOWN" ? "border-red-500 bg-red-50/30 dark:bg-red-950/10" : "border-green-500 bg-green-50/30 dark:bg-green-950/10"}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Status</CardTitle>
          {currentStatus === "DOWN" ? (
            <XCircle className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div
              className={`text-2xl font-bold ${currentStatus === "DOWN" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
            >
              {currentStatus}
            </div>
            <div
              className={`ml-2 h-3 w-3 rounded-full ${currentStatus === "DOWN" ? "bg-red-500 animate-pulse" : "bg-green-500 animate-pulse"}`}
            ></div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {currentStatus === "DOWN" ? (
              <span className="text-red-600">Site is currently experiencing issues</span>
            ) : (
              <span className="text-green-600">Site is operating normally</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
