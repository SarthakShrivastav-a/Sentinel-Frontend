"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createIncident, fetchIncidents, summarizeIncident, updateIncidentState } from "@/lib/incident-api"
import type { Incident } from "@/lib/types"

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState<any>(null)

  const load = async () => setIncidents(await fetchIncidents())
  useEffect(() => { load() }, [])

  const create = async () => {
    if (!title) return
    await createIncident({ title, severity: "HIGH", state: "INVESTIGATING", affectedComponentIds: [] })
    setTitle("")
    await load()
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <h2 className="text-3xl font-bold tracking-tight">Incidents</h2>
      <Card>
        <CardHeader><CardTitle>Create Incident</CardTitle></CardHeader>
        <CardContent className="flex gap-3">
          <Input placeholder="Incident title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button onClick={create}>Create</Button>
        </CardContent>
      </Card>
      {summary && (
        <Card>
          <CardHeader><CardTitle>Incident Copilot</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{summary.summary}</p>
            <p className="text-muted-foreground">{summary.likely_cause}</p>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4">
        {incidents.map((incident) => (
          <Card key={incident.id}>
            <CardHeader><CardTitle>{incident.title}</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">{incident.severity} / {incident.state}</span>
              <Button variant="outline" onClick={() => updateIncidentState(incident.id, "RESOLVED", "Resolved from dashboard").then(load)}>Resolve</Button>
              <Button onClick={() => summarizeIncident(incident.id).then(setSummary)}>Summarize</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
