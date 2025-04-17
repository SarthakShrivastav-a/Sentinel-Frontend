"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonitorCard } from "@/components/dashboard/monitor-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import type { Monitor } from "@/lib/types"
import { fetchMonitors } from "@/lib/api"
import { DashboardCharts } from "@/components/dashboard/charts"

export default function DashboardPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const getMonitors = async () => {
      try {
        const data = await fetchMonitors()
        setMonitors(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch monitors. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    getMonitors()
  }, [toast])

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button onClick={() => router.push("/dashboard/monitors/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create Monitor
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Monitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monitors.length}</div>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? "Loading..." : `${monitors.length} active monitors`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-muted-foreground">+0.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">320ms</div>
                <p className="text-xs text-muted-foreground">-12ms from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">In the last 24 hours</p>
              </CardContent>
            </Card>
          </div>

          <DashboardCharts />

          <h3 className="text-xl font-bold">Recent Monitors</h3>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-[180px] animate-pulse bg-muted/40"></Card>
              ))}
            </div>
          ) : monitors.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {monitors.slice(0, 6).map((monitor) => (
                <MonitorCard key={monitor.id} monitor={monitor} />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No monitors found</CardTitle>
                <CardDescription>
                  You haven't created any monitors yet. Get started by creating your first monitor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/dashboard/monitors/create")}>
                  <Plus className="mr-2 h-4 w-4" /> Create Monitor
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics for your monitors will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Analytics dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view reports for your monitors.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Reports dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
