"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditTeamMemberDialog } from "./edit-team-member-dialog"
import type { TeamMember } from "@/lib/types"
import { deleteTeamMember, updateTeamMemberActiveStatus } from "@/lib/team-api"
import { Trash2 } from "lucide-react"

interface TeamMembersTableProps {
  members: TeamMember[]
  onUpdateMember: (member: TeamMember) => void
  onDeleteMember: (email: string) => void
  onToggleActive: (email: string, active: boolean) => void
}

export function TeamMembersTable({ members, onUpdateMember, onDeleteMember, onToggleActive }: TeamMembersTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDeleteClick = (member: TeamMember) => {
    setMemberToDelete(member)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return

    setIsDeleting(true)
    try {
      await deleteTeamMember(memberToDelete.email)
      onDeleteMember(memberToDelete.email)
      toast({
        title: "Success",
        description: `${memberToDelete.firstName} ${memberToDelete.lastName} has been removed from the team.`,
      })
    } catch (error) {
      console.error("Failed to delete team member:", error)
      toast({
        title: "Error",
        description: "Failed to delete team member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setMemberToDelete(null)
    }
  }

  const handleToggleActive = async (member: TeamMember) => {
    setIsUpdatingStatus(member.email)
    try {
      const newStatus = !member.active
      await updateTeamMemberActiveStatus(member.email, newStatus)
      onToggleActive(member.email, newStatus)
      toast({
        title: "Success",
        description: `${member.firstName} ${member.lastName} is now ${newStatus ? "active" : "inactive"}.`,
      })
    } catch (error) {
      console.error("Failed to update member status:", error)
      toast({
        title: "Error",
        description: "Failed to update member status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingStatus(null)
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.email}>
              <TableCell className="font-medium">
                {member.firstName} {member.lastName}
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={member.active}
                    disabled={isUpdatingStatus === member.email}
                    onCheckedChange={() => handleToggleActive(member)}
                  />
                  <span className={member.active ? "text-green-600" : "text-slate-500"}>
                    {member.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EditTeamMemberDialog member={member} onUpdateMember={onUpdateMember} />
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(member)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {memberToDelete?.firstName} {memberToDelete?.lastName} from your team. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
