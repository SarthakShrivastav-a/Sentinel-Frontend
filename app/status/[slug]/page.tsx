"use client"

import { use, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchPublicStatusPage } from "@/lib/status-api"
import type { StatusPage } from "@/lib/types"

export default function PublicStatusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [page, setPage] = useState<StatusPage | null>(null)

  useEffect(() => {
    fetchPublicStatusPage(slug).then(setPage).catch(() => setPage(null))
  }, [slug])

  if (!page) {
    return <main className="min-h-screen bg-background p-8 text-foreground">Status page not found.</main>
  }

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold">{page.name}</h1>
          <p className="text-muted-foreground">{page.description}</p>
        </div>
        <Card>
          <CardHeader><CardTitle>Current Status</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {page.components.length === 0 ? (
              <p className="text-sm text-muted-foreground">No components configured yet.</p>
            ) : page.components.map((component) => (
              <div key={component.name} className="flex items-center justify-between border-b py-2">
                <span>{component.name}</span>
                <span className="text-sm text-primary">{component.state}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
