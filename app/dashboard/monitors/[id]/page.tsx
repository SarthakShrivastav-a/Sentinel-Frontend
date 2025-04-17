"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/header"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Trash } from "lucide-react"
import type { MonitorDetails } from "@/lib/types"
import { fetchMonitorDetails, deleteMonitor } from "@/lib/api"
import { MonitorStatusBadge } from "@/components/dashboard/monitor-status-badge"
import { MonitorCheckHistoryTable } from "@/components/dashboard/monitor-check-history-table"
import { MonitorEditErrorConditionDialog } from "@/components/dashboard/monitor-edit-error-condition-dialog"
import { MonitorDetailCharts } from "@/components/dashboard/monitor-detail-charts"
import { formatDate } from "@/lib/utils"
import { MonitorStatsSummary } from "@/components/dashboard/monitor-stats-summary"

export default function MonitorDetailsPage({ params }: { params: { id: string } }) {
  const [monitorDetails, setMonitorDetails] = useState<MonitorDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Unwrap the params object using React.use()
  const monitorId = use(params).id

  useEffect(() => {
    const getMonitorDetails = async () => {
      try {
        // Use the unwrapped monitorId instead of params.id
        const data = await fetchMonitorDetails(monitorId)
        setMonitorDetails(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch monitor details. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard/monitors")
      } finally {
        setIsLoading(false)
      }
    }

    getMonitorDetails()
  }, [monitorId, router, toast])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this monitor?")) {
      setIsDeleting(true)
      try {
        await deleteMonitor(monitorId)
        toast({
          title: "Monitor deleted",
          description: "Your monitor has been deleted successfully.",
        })
        router.push("/dashboard/monitors")
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete monitor. Please try again.",
          variant: "destructive",
        })
        setIsDeleting(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <div className="flex items-center justify-center h-[400px]">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!monitorDetails) {
    return (
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <Card>
          <CardHeader>
            <CardTitle>Monitor not found</CardTitle>
            <CardDescription>
              The monitor you are looking for does not exist or you do not have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/monitors")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Monitors
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Safely access checkHistory and get the latest check
  const checkHistory = monitorDetails.checkHistory || []
  const latestCheck = checkHistory.length > 0 ? checkHistory[0] : null

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/monitors")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{monitorDetails.url}</h2>
          {latestCheck && <MonitorStatusBadge status={latestCheck.status} />}
        </div>
        <div className="flex items-center gap-2">
          <MonitorEditErrorConditionDialog
            monitorId={monitorDetails.monitorId}
            currentErrorCondition={monitorDetails.errorCondition}
            onUpdate={(updatedMonitor) => {
              setMonitorDetails({
                ...monitorDetails,
                ...updatedMonitor,
              })
            }}
          />
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            <Trash className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <MonitorStatsSummary
        totalChecks={monitorDetails.totalChecks || 0}
        upChecks={monitorDetails.upChecks || 0}
        downChecks={monitorDetails.downChecks || 0}
        currentStatus={monitorDetails.currentStatus || "Unknown"}
        cumulativeDowntime={monitorDetails.cumulativeDowntime || 0}
        cumulativeResponse={monitorDetails.cumulativeResponse || 0}
        consecutiveDowntimeCount={monitorDetails.consecutiveDowntimeCount || 0}
        averageResponseTime={monitorDetails.averageResponseTime || 0}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Check History</TabsTrigger>
          <TabsTrigger value="ssl">SSL Information</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitor Performance</CardTitle>
              <CardDescription>View the performance metrics for this monitor over time.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <MonitorDetailCharts recentChecks={monitorDetails.checkHistory} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Check History </CardTitle>
              <CardDescription>Recent check history for this monitor.</CardDescription>
            </CardHeader>
            <CardContent>
              <MonitorCheckHistoryTable checks={monitorDetails.checkHistory || []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ssl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SSL Certificate Information</CardTitle>
              <CardDescription>Details about the SSL certificate for this domain.</CardDescription>
            </CardHeader>
            <CardContent>
              {monitorDetails.sslInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Domain</h3>
                      <p>{monitorDetails.sslInfo?.domainInfo?.name || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">IP Address</h3>
                      <p>{monitorDetails.sslInfo?.domainInfo?.ipAddress || "Unknown"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Valid From</h3>
                      <p>{monitorDetails.sslInfo.validFrom ? formatDate(monitorDetails.sslInfo.validFrom) : "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Valid To</h3>
                      <p>{monitorDetails.sslInfo.validTo ? formatDate(monitorDetails.sslInfo.validTo) : "N/A"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No SSL information available for this monitor.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
