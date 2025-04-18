import { apiRequest } from "./api"
import type { CronJob } from "../app/dashboard/heartbeats/page"

// Fetch all cron jobs
export async function fetchCronJobs(): Promise<CronJob[]> {
  return apiRequest("/api/jobs")
}

// Fetch a specific cron job's details
export async function fetchCronJobDetails(id: string): Promise<any> {
  return apiRequest(`/api/jobs/${id}`)
}

// Create a new cron job
export async function createCronJob(jobData: {
  name: string
  description: string
  expectedIntervalSeconds: number
  gracePeriodMinutes: number
  alertEmail: string
  active: boolean
}): Promise<CronJob> {
  return apiRequest("/api/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  })
}

// Update an existing cron job
export async function updateCronJob(
  jobId: string,
  jobData: {
    name: string
    description: string
    expectedIntervalSeconds: number
    gracePeriodMinutes: number
    alertEmail: string
    active: boolean
  },
): Promise<any> {
  return apiRequest(`/api/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  })
}

// Delete a cron job
export async function deleteCronJob(jobId: string): Promise<void> {
  return apiRequest(`/api/jobs/${jobId}`, {
    method: "DELETE",
  })
}

// Get logs for a specific cron job
export async function fetchCronJobLogs(jobId: string): Promise<any[]> {
  return apiRequest(`/api/jobs/${jobId}/logs`)
}

// Regenerate API key for a cron job
export async function regenerateCronJobApiKey(jobId: string): Promise<CronJob> {
  return apiRequest(`/api/jobs/${jobId}/regenerate-key`, {
    method: "POST",
  })
}
