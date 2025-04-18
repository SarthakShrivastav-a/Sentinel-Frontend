"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { PlusCircle, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { fetchCronJobs, deleteCronJob } from "@/lib/cron-api"
import { CreateCronJobDialog } from "./create-cron-job-dialog"
import { EditCronJobDialog } from "./edit-cron-job-dialog"
import { ConfirmDialog } from "./confirm-dialog"
import { CronJobStatusBadge } from "./cron-job-status-badge"
import { formatDateTime, formatDuration } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface CronJob {
  id: string
  userId: string
  name: string
  description: string
  expectedIntervalSeconds: number
  lastHeartbeat: string | null
  nextExpectedHeartbeat: string | null
  gracePeriodMinutes: number
  active: boolean
  alertEmail: string
  apiKey: string
  heartbeatUrl?: string
  currentStatus?: string
}

export default function HeartbeatsPage() {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCronJobs()
  }, [])

  const loadCronJobs = async () => {
    setIsLoading(true)
    try {
      const jobs = await fetchCronJobs()
      setCronJobs(jobs)
    } catch (error) {
      console.error("Failed to fetch cron jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load cron jobs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteJob = async () => {
    if (!jobToDelete) return

    try {
      await deleteCronJob(jobToDelete)
      setCronJobs(cronJobs.filter((job) => job.id !== jobToDelete))
      toast({
        title: "Success",
        description: "Cron job deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete cron job:", error)
      toast({
        title: "Error",
        description: "Failed to delete cron job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setJobToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleJobCreated = (newJob: CronJob) => {
    setCronJobs([...cronJobs, newJob])
    setIsCreateDialogOpen(false)
  }

  const handleJobUpdated = (updatedJob: CronJob) => {
    setCronJobs(cronJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)))
  }

  const confirmDelete = (jobId: string) => {
    setJobToDelete(jobId)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Heartbeats</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Cron Job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cron Jobs</CardTitle>
          <CardDescription>
            Monitor your scheduled tasks with heartbeats to ensure they're running as expected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : cronJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="mb-4 text-muted-foreground">You don't have any cron jobs yet.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>Create your first cron job</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Interval</TableHead>
                    <TableHead>Last Heartbeat</TableHead>
                    <TableHead>Next Expected</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cronJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <div className="font-medium">{job.name}</div>
                        <div className="text-xs text-muted-foreground">{job.description}</div>
                      </TableCell>
                      <TableCell>
                        <CronJobStatusBadge status={job.currentStatus || "UNKNOWN"} />
                      </TableCell>
                      <TableCell>{formatDuration(job.expectedIntervalSeconds)}</TableCell>
                      <TableCell>{job.lastHeartbeat ? formatDateTime(job.lastHeartbeat) : "Never"}</TableCell>
                      <TableCell>
                        {job.nextExpectedHeartbeat ? formatDateTime(job.nextExpectedHeartbeat) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <EditCronJobDialog job={job} onUpdateJob={handleJobUpdated} />
                          <Button variant="outline" size="icon" onClick={() => confirmDelete(job.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateCronJobDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onJobCreated={handleJobCreated}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Cron Job"
        description="Are you sure you want to delete this cron job? This action cannot be undone."
        onConfirm={handleDeleteJob}
      />
    </div>
  )
}
