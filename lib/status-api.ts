import { apiRequest } from "./api"
import type { StatusPage } from "./types"

export function fetchStatusPages(): Promise<StatusPage[]> {
  return apiRequest("/api/status-pages")
}

export function createStatusPage(page: Partial<StatusPage>): Promise<StatusPage> {
  return apiRequest("/api/status-pages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(page),
  })
}

export async function fetchPublicStatusPage(slug: string): Promise<StatusPage> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const response = await fetch(`${baseUrl}/api/public/status-pages/${slug}`, { cache: "no-store" })
  if (!response.ok) throw new Error("Status page not found")
  return response.json()
}
