"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { MonitorCard } from "@/components/dashboard/monitor-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { useToast } from "@/components/ui/use-toast"
import type { Monitor } from "@/lib/types"
import { fetchMonitors } from "@/lib/api"

export default function MonitorsPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [filteredMonitors, setFilteredMonitors] = useState<Monitor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const getMonitors = async () => {
      try {
        const data = await fetchMonitors()
        setMonitors(data)
        setFilteredMonitors(data)
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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMonitors(monitors)
    } else {
      const filtered = monitors.filter((monitor) => monitor.url.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredMonitors(filtered)
    }
  }, [searchQuery, monitors])

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Monitors</h2>
        <Button onClick={() => router.push("/dashboard/monitors/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create Monitor
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search monitors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-[180px] animate-pulse bg-muted/40"></Card>
          ))}
        </div>
      ) : filteredMonitors.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMonitors.map((monitor) => (
            <MonitorCard key={monitor.id} monitor={monitor} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No monitors found</CardTitle>
            <CardDescription>
              {searchQuery
                ? "No monitors match your search query."
                : "You haven't created any monitors yet. Get started by creating your first monitor."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!searchQuery && (
              <Button onClick={() => router.push("/dashboard/monitors/create")}>
                <Plus className="mr-2 h-4 w-4" /> Create Monitor
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
