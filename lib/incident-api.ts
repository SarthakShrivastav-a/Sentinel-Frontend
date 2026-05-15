import { apiRequest } from "./api"
import type { Incident, MaintenanceWindow } from "./types"

export function fetchIncidents(): Promise<Incident[]> {
  return apiRequest("/api/incidents")
}

export function createIncident(incident: Partial<Incident>): Promise<Incident> {
  return apiRequest("/api/incidents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(incident),
  })
}

export function updateIncidentState(id: string, state: string, message: string): Promise<Incident> {
  return apiRequest(`/api/incidents/${id}/state`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state, message }),
  })
}

export function summarizeIncident(id: string): Promise<any> {
  return apiRequest(`/api/copilot/incidents/${id}/summary`, { method: "POST" })
}

export function fetchMaintenanceWindows(): Promise<MaintenanceWindow[]> {
  return apiRequest("/api/maintenance-windows")
}

export function createMaintenanceWindow(window: Partial<MaintenanceWindow>): Promise<MaintenanceWindow> {
  return apiRequest("/api/maintenance-windows", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(window),
  })
}
