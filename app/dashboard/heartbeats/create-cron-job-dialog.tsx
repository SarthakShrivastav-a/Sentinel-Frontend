"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { createCronJob } from "@/lib/cron-api"
import type { CronJob } from "./page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Download } from "lucide-react"

interface CreateCronJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJobCreated: (job: CronJob) => void
}

export function CreateCronJobDialog({ open, onOpenChange, onJobCreated }: CreateCronJobDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [interval, setInterval] = useState("3600") // Default 1 hour
  const [gracePeriod, setGracePeriod] = useState("10") // Default 10 minutes
  const [alertEmail, setAlertEmail] = useState("")
  const [active, setActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [createdJob, setCreatedJob] = useState<CronJob | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!interval.trim() || isNaN(Number(interval)) || Number(interval) <= 0) {
      newErrors.interval = "Interval must be a positive number"
    }

    if (!gracePeriod.trim() || isNaN(Number(gracePeriod)) || Number(gracePeriod) <= 0) {
      newErrors.gracePeriod = "Grace period must be a positive number"
    }

    if (!alertEmail.trim()) {
      newErrors.alertEmail = "Alert email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alertEmail)) {
      newErrors.alertEmail = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const newJob = await createCronJob({
        name,
        description,
        expectedIntervalSeconds: Number(interval),
        gracePeriodMinutes: Number(gracePeriod),
        alertEmail,
        active,
      })

      toast({
        title: "Success",
        description: `Cron job "${name}" has been created.`,
      })

      // Store the created job and show the success dialog
      setCreatedJob(newJob)
      setShowSuccessDialog(true)

      // Still call onJobCreated to update the parent component
      onJobCreated(newJob)
    } catch (error) {
      console.error("Failed to create cron job:", error)
      toast({
        title: "Error",
        description: "Failed to create cron job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setInterval("3600")
    setGracePeriod("10")
    setAlertEmail("")
    setActive(true)
    setErrors({})
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  const intervalOptions = [
    { value: "60", label: "1 minute" },
    { value: "300", label: "5 minutes" },
    { value: "900", label: "15 minutes" },
    { value: "1800", label: "30 minutes" },
    { value: "3600", label: "1 hour" },
    { value: "7200", label: "2 hours" },
    { value: "14400", label: "4 hours" },
    { value: "21600", label: "6 hours" },
    { value: "43200", label: "12 hours" },
    { value: "86400", label: "24 hours" },
  ]

  const gracePeriodOptions = [
    { value: "1", label: "1 minute" },
    { value: "5", label: "5 minutes" },
    { value: "10", label: "10 minutes" },
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
  ]

  const handleDownloadApiKey = () => {
    if (!createdJob) return

    const heartbeatUrl = `http://localhost:8080/api/heartbeat/${createdJob.apiKey}`

    const data = {
      jobId: createdJob.id,
      jobName: createdJob.name,
      apiKey: createdJob.apiKey,
      heartbeatUrl: heartbeatUrl,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${createdJob.name.replace(/\s+/g, "-").toLowerCase()}-api-key.json`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Add this function to close the success dialog and reset the form
  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    resetForm()
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Cron Job</DialogTitle>
            <DialogDescription>
              Set up a new cron job to monitor. You'll receive a unique URL to ping when your job runs.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                  placeholder="Database Backup"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={errors.description ? "border-destructive" : ""}
                  placeholder="Daily database backup job that runs at midnight"
                  rows={2}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="interval">Expected Interval</Label>
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger className={errors.interval ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    {intervalOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.interval && <p className="text-xs text-destructive">{errors.interval}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gracePeriod">Grace Period</Label>
                <Select value={gracePeriod} onValueChange={setGracePeriod}>
                  <SelectTrigger className={errors.gracePeriod ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select grace period" />
                  </SelectTrigger>
                  <SelectContent>
                    {gracePeriodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Time to wait after expected interval before marking as failed
                </p>
                {errors.gracePeriod && <p className="text-xs text-destructive">{errors.gracePeriod}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="alertEmail">Alert Email</Label>
                <Input
                  id="alertEmail"
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className={errors.alertEmail ? "border-destructive" : ""}
                  placeholder="alerts@example.com"
                />
                {errors.alertEmail && <p className="text-xs text-destructive">{errors.alertEmail}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" checked={active} onCheckedChange={setActive} />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Cron Job"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {createdJob && (
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cron Job Created Successfully</AlertDialogTitle>
              <AlertDialogDescription>
                Please save your API key and heartbeat URL. You will need these to configure your cron job.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="createdApiKey">API Key</Label>
                <div className="flex items-center gap-2">
                  <Input id="createdApiKey" value={createdJob.apiKey} readOnly className="font-mono text-sm bg-muted" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="heartbeatUrl">Heartbeat URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="heartbeatUrl"
                    value={`http://localhost:8080/api/heartbeat/${createdJob.apiKey}`}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Send a GET or POST request to this URL when your cron job runs
                </p>
              </div>
            </div>

            <AlertDialogFooter>
              <Button variant="outline" onClick={handleDownloadApiKey}>
                <Download className="mr-2 h-4 w-4" />
                Download as JSON
              </Button>
              <Button onClick={handleSuccessDialogClose}>Close</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
