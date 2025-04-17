"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { TeamMembersTable } from "./team-members-table"
import { AddTeamMemberDialog } from "./add-team-member-dialog"
import { useToast } from "@/components/ui/use-toast"
import { fetchTeam, fetchTeamMembers } from "@/lib/team-api"
import type { TeamMember } from "@/lib/types"

export default function TeamSettingsPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [teamId, setTeamId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setIsLoading(true)
        // First try to fetch the team
        const teamData = await fetchTeam()
        setTeamId(teamData.teamId)

        // Then fetch team members
        const members = await fetchTeamMembers()
        setTeamMembers(members)
      } catch (error) {
        console.error("Failed to load team data:", error)
        toast({
          title: "Error",
          description: "Failed to load team data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTeamData()
  }, [toast])

  const handleAddMember = (newMember: TeamMember) => {
    setTeamMembers((prev) => [...prev, newMember])
  }

  const handleUpdateMember = (updatedMember: TeamMember) => {
    setTeamMembers((prev) => prev.map((member) => (member.email === updatedMember.email ? updatedMember : member)))
  }

  const handleDeleteMember = (email: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.email !== email))
  }

  const handleToggleActive = (email: string, active: boolean) => {
    setTeamMembers((prev) => prev.map((member) => (member.email === email ? { ...member, active } : member)))
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Team Settings</h2>
        <AddTeamMemberDialog onAddMember={handleAddMember} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members and their permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Loading team members...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center gap-4">
              <p className="text-muted-foreground">No team members found</p>
              <AddTeamMemberDialog
                onAddMember={handleAddMember}
                variant="outline"
                buttonText="Add your first team member"
              />
            </div>
          ) : (
            <TeamMembersTable
              members={teamMembers}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
              onToggleActive={handleToggleActive}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
