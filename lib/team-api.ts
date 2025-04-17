import { apiRequest } from "./api"
import type { TeamMember, Team } from "./types"

// Team API endpoints
export async function fetchTeam(): Promise<Team> {
  return apiRequest("/api/teams")
}

export async function createTeam(): Promise<Team> {
  return apiRequest("/api/teams", {
    method: "POST",
  })
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  return apiRequest("/api/teams/members")
}

export async function addTeamMember(memberData: Omit<TeamMember, "id">): Promise<TeamMember> {
  return apiRequest("/api/teams/members", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberData),
  })
}

export async function updateTeamMember(email: string, memberData: Omit<TeamMember, "id">): Promise<TeamMember> {
  return apiRequest(`/api/teams/members/${email}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberData),
  })
}

export async function deleteTeamMember(email: string): Promise<void> {
  return apiRequest(`/api/teams/members/${email}`, {
    method: "DELETE",
  })
}

export async function updateTeamMemberActiveStatus(email: string, active: boolean): Promise<TeamMember> {
  return apiRequest(`/api/teams/members/${email}/active`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ active }),
  })
}
