import type { Monitor, MonitorDetails } from "./types"

// Base URL for all API requests
const API_BASE_URL = "http://localhost:8080"

// Helper function to handle API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("auth_token")
  const url = `${API_BASE_URL}${endpoint}`

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  // Check if the response is JSON
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

// Auth API
export async function getUserDetails() {
  return apiRequest("/api/user/details")
}

// Monitors API
export async function fetchMonitors(): Promise<Monitor[]> {
  return apiRequest("/api/monitor/fetch")
}
export async function fetchMonitorDetails(id: string): Promise<MonitorDetails> {
  const data = await apiRequest(`/api/monitor/${id}/details`)

  // Return the data directly as it already matches the MonitorDetails interface
  // No need for transformation since the backend DTO structure matches our interface
  return data as MonitorDetails
}

export async function createMonitor(monitorData: any): Promise<Monitor> {
  return apiRequest("/api/monitor/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(monitorData),
  })
}


// Add this function if it doesn't exist already
export async function updateMonitorErrorCondition(
  monitorId: string,
  errorCondition: { triggerOn: string; threshold: number },
): Promise<any> {
  const response = await apiRequest(`/api/monitor/${monitorId}/error-condition`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(errorCondition),
  })

  return response
}


export async function deleteMonitor(id: string): Promise<void> {
  return apiRequest(`/api/monitor/${id}`, {
    method: "DELETE",
  })
}