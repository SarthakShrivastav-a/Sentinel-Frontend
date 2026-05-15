"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createStatusPage, fetchStatusPages } from "@/lib/status-api"
import type { StatusPage } from "@/lib/types"

export default function StatusPagesPage() {
  const [pages, setPages] = useState<StatusPage[]>([])
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")

  const load = async () => setPages(await fetchStatusPages())

  useEffect(() => {
    load()
  }, [])

  const create = async () => {
    if (!name || !slug) return
    await createStatusPage({ name, slug, description: "Public Sentinel status page", published: true, components: [] })
    setName("")
    setSlug("")
    await load()
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Status Pages</h2>
      </div>
      <Card>
        <CardHeader><CardTitle>Create Status Page</CardTitle></CardHeader>
        <CardContent className="flex gap-3">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Button onClick={create}>Create</Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardHeader><CardTitle>{page.name}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{page.description}</p>
              <a className="text-sm text-primary underline" href={`/status/${page.slug}`} target="_blank">/status/{page.slug}</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
