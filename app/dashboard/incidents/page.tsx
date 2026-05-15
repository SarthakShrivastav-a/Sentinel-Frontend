"use client"

import { useEffect, useState } from "react"
import { Bot, FileText, Lightbulb, RefreshCw, Sparkles } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createIncident, draftPostmortem, fetchIncidents, fetchRootCauseHints, summarizeIncident, updateIncidentState } from "@/lib/incident-api"
import type { Incident, IncidentSummary, PostmortemDraft, RootCauseHints } from "@/lib/types"

type IncidentAiResult = {
  incidentId: string
  summary?: IncidentSummary
  rootCause?: RootCauseHints
  postmortem?: PostmortemDraft
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [title, setTitle] = useState("")
  const [aiResult, setAiResult] = useState<IncidentAiResult | null>(null)
  const [loadingAi, setLoadingAi] = useState<string | null>(null)

  const load = async () => setIncidents(await fetchIncidents())
  useEffect(() => { load() }, [])

  const create = async () => {
    if (!title) return
    await createIncident({ title, severity: "HIGH", state: "INVESTIGATING", affectedComponentIds: [] })
    setTitle("")
    await load()
  }

  const runAi = async (incident: Incident) => {
    setLoadingAi(incident.id)
    try {
      const [summary, rootCause, postmortem] = await Promise.all([
        summarizeIncident(incident.id),
        fetchRootCauseHints(incident.id),
        draftPostmortem(incident.id),
      ])
      setAiResult({ incidentId: incident.id, summary, rootCause, postmortem })
    } finally {
      setLoadingAi(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <div className="flex items-center gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Incidents</h2>
        <Badge variant="outline" className="gap-1">
          <Bot className="h-3.5 w-3.5" />
          AI enabled
        </Badge>
      </div>
      <Card>
        <CardHeader><CardTitle>Create Incident</CardTitle></CardHeader>
        <CardContent className="flex gap-3">
          <Input placeholder="Incident title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button onClick={create}>Create</Button>
        </CardContent>
      </Card>
      {aiResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Incident Copilot
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            <section className="space-y-2 rounded-lg border p-4">
              <p className="flex items-center gap-2 text-sm font-medium"><Sparkles className="h-4 w-4" /> Summary</p>
              <p className="text-sm text-muted-foreground">{aiResult.summary?.summary}</p>
              <p className="text-xs text-muted-foreground">{aiResult.summary?.likely_cause}</p>
            </section>
            <section className="space-y-2 rounded-lg border p-4">
              <p className="flex items-center gap-2 text-sm font-medium"><Lightbulb className="h-4 w-4" /> Root Cause</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {aiResult.rootCause?.hints.slice(0, 3).map((hint) => <li key={hint}>{hint}</li>)}
              </ul>
            </section>
            <section className="space-y-2 rounded-lg border p-4">
              <p className="flex items-center gap-2 text-sm font-medium"><FileText className="h-4 w-4" /> Postmortem</p>
              <p className="text-sm text-muted-foreground">{aiResult.postmortem?.executive_summary}</p>
            </section>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4">
        {incidents.map((incident) => (
          <Card key={incident.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>{incident.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{incident.severity}</Badge>
                  <Badge>{incident.state}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={() => updateIncidentState(incident.id, "RESOLVED", "Resolved from dashboard").then(load)}>Resolve</Button>
              <Button onClick={() => runAi(incident)} disabled={loadingAi === incident.id}>
                {loadingAi === incident.id ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Run AI
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
