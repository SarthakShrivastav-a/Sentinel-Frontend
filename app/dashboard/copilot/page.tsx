"use client"

import { useEffect, useMemo, useState } from "react"
import { Bot, FileText, Lightbulb, RefreshCw, Sparkles } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { draftPostmortem, fetchIncidents, fetchRootCauseHints, summarizeIncident } from "@/lib/incident-api"
import type { Incident, IncidentSummary, PostmortemDraft, RootCauseHints } from "@/lib/types"

type CopilotResults = {
  summary?: IncidentSummary
  rootCause?: RootCauseHints
  postmortem?: PostmortemDraft
}

export default function CopilotPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selectedIncidentId, setSelectedIncidentId] = useState("")
  const [results, setResults] = useState<CopilotResults>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchIncidents()
      .then((data) => {
        setIncidents(data)
        setSelectedIncidentId(data[0]?.id ?? "")
      })
      .catch(() => {
        toast({
          title: "Failed to load incidents",
          description: "Create or sync an incident before using Copilot.",
          variant: "destructive",
        })
      })
  }, [toast])

  const selectedIncident = useMemo(
    () => incidents.find((incident) => incident.id === selectedIncidentId),
    [incidents, selectedIncidentId],
  )

  const runCopilot = async () => {
    if (!selectedIncidentId) return
    setLoading(true)
    try {
      const [summary, rootCause, postmortem] = await Promise.all([
        summarizeIncident(selectedIncidentId),
        fetchRootCauseHints(selectedIncidentId),
        draftPostmortem(selectedIncidentId),
      ])
      setResults({ summary, rootCause, postmortem })
    } catch {
      toast({
        title: "Copilot failed",
        description: "The incident AI workflow could not be completed.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Bot className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">AI Copilot</h2>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Generate incident summaries, root-cause hints, and postmortem drafts from live Sentinel incident data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Workspace</CardTitle>
          <CardDescription>Select an incident and run the complete AI workflow.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <Select value={selectedIncidentId} onValueChange={setSelectedIncidentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an incident" />
            </SelectTrigger>
            <SelectContent>
              {incidents.map((incident) => (
                <SelectItem key={incident.id} value={incident.id}>
                  {incident.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={runCopilot} disabled={!selectedIncidentId || loading}>
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Run Copilot
          </Button>
        </CardContent>
      </Card>

      {selectedIncident && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{selectedIncident.title}</CardTitle>
                <CardDescription>{selectedIncident.id}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{selectedIncident.severity}</Badge>
                <Badge>{selectedIncident.state}</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="root-cause">Root Cause</TabsTrigger>
          <TabsTrigger value="postmortem">Postmortem</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Incident Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {results.summary ? (
                <>
                  <p>{results.summary.summary}</p>
                  <Separator />
                  <div>
                    <p className="font-medium">Likely Cause</p>
                    <p className="text-muted-foreground">{results.summary.likely_cause}</p>
                  </div>
                  <div>
                    <p className="font-medium">Recommended Actions</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                      {results.summary.recommended_actions.map((action) => <li key={action}>{action}</li>)}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Run Copilot to generate a concise incident summary.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="root-cause">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Root-Cause Hints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {results.rootCause ? (
                <>
                  <Badge variant="outline">Confidence: {results.rootCause.confidence}</Badge>
                  <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                    {results.rootCause.hints.map((hint) => <li key={hint}>{hint}</li>)}
                  </ul>
                </>
              ) : (
                <p className="text-muted-foreground">Run Copilot to generate investigation hints.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="postmortem">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Postmortem Draft
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {results.postmortem ? (
                <>
                  <section>
                    <p className="font-medium">Executive Summary</p>
                    <p className="text-muted-foreground">{results.postmortem.executive_summary}</p>
                  </section>
                  <section>
                    <p className="font-medium">Impact</p>
                    <p className="text-muted-foreground">{results.postmortem.impact}</p>
                  </section>
                  <section>
                    <p className="font-medium">Timeline</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                      {results.postmortem.timeline.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </section>
                  <section>
                    <p className="font-medium">Prevention Tasks</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                      {results.postmortem.prevention_tasks.map((task) => <li key={task}>{task}</li>)}
                    </ul>
                  </section>
                </>
              ) : (
                <p className="text-muted-foreground">Run Copilot to draft a postmortem.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
