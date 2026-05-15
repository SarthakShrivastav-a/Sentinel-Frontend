"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createMaintenanceWindow, fetchMaintenanceWindows } from "@/lib/incident-api"
import type { MaintenanceWindow } from "@/lib/types"

export default function MaintenancePage() {
  const [windows, setWindows] = useState<MaintenanceWindow[]>([])
  const [title, setTitle] = useState("")

  const load = async () => setWindows(await fetchMaintenanceWindows())
  useEffect(() => { load() }, [])

  const create = async () => {
    if (!title) return
    const now = new Date()
    const later = new Date(now.getTime() + 60 * 60 * 1000)
    await createMaintenanceWindow({ title, description: "Scheduled maintenance", startsAt: now.toISOString(), endsAt: later.toISOString(), affectedResourceIds: [] })
    setTitle("")
    await load()
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <h2 className="text-3xl font-bold tracking-tight">Maintenance</h2>
      <Card>
        <CardHeader><CardTitle>Schedule Maintenance</CardTitle></CardHeader>
        <CardContent className="flex gap-3">
          <Input placeholder="Maintenance title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button onClick={create}>Schedule 1h Window</Button>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        {windows.map((window) => (
          <Card key={window.id}>
            <CardHeader><CardTitle>{window.title}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{window.startsAt} - {window.endsAt}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
