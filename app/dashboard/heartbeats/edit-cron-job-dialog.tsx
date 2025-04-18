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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { updateCronJob, regenerateCronJobApiKey } from "@/lib/cron-api"
import type { CronJob } from "./page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, RefreshCw } from "lucide-react"

interface EditCronJobDialogProps {
  job: CronJob
  onUpdateJob: (job: CronJob) => void
}

export function EditCronJobDialog({ job, onUpdateJob }: EditCronJobDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(job.name)
  const [description, setDescription] = useState(job.description)
  const [interval, setInterval] = useState(job.expectedIntervalSeconds.toString())
  const [gracePeriod, setGracePeriod] = useState(job.gracePeriodMinutes.toString())
  const [alertEmail, setAlertEmail] = useState(job.alertEmail)
  const [active, setActive] = useState(job.active)
  const [apiKey, setApiKey] = useState(job.apiKey)
  const [isLoading, setIsLoading] = useState(false)
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

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
      await updateCronJob(job.id, {
        name,
        description,
        expectedIntervalSeconds: Number(interval),
        gracePeriodMinutes: Number(gracePeriod),
        alertEmail,
        active,
      })

      const updatedJob = {
        ...job,
        name,
        description,
        expectedIntervalSeconds: Number(interval),
        gracePeriodMinutes: Number(gracePeriod),
        alertEmail,
        active,
      }

      toast({
        title: "Success",
        description: `Cron job "${name}" has been updated.`,
      })

      onUpdateJob(updatedJob)
      setOpen(false)
    } catch (error) {
      console.error("Failed to update cron job:", error)
      toast({
        title: "Error",
        description: "Failed to update cron job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerateApiKey = async () => {
    setIsRegeneratingKey(true)
    try {
      const updatedJob = await regenerateCronJobApiKey(job.id)
      setApiKey(updatedJob.apiKey)

      toast({
        title: "Success",
        description: "API key regenerated successfully.",
      })

      onUpdateJob(updatedJob)
    } catch (error) {
      console.error("Failed to regenerate API key:", error)
      toast({
        title: "Error",
        description: "Failed to regenerate API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRegeneratingKey(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Reset to current values when opening dialog
      setName(job.name)
      setDescription(job.description)
      setInterval(job.expectedIntervalSeconds.toString())
      setGracePeriod(job.gracePeriodMinutes.toString())
      setAlertEmail(job.alertEmail)
      setActive(job.active)
      setApiKey(job.apiKey)
      setErrors({})
    }
    setOpen(newOpen)
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

  const heartbeatUrl = job.heartbeatUrl || `http://localhost:8080/api/heartbeat/${apiKey}`

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Cron Job</DialogTitle>
          <DialogDescription>Update your cron job settings and monitoring preferences.</DialogDescription>
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
              />
              {errors.alertEmail && <p className="text-xs text-destructive">{errors.alertEmail}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="active" checked={active} onCheckedChange={setActive} />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="grid gap-2 pt-2">
              <Label htmlFor="heartbeatUrl">Heartbeat URL</Label>
              <div className="flex gap-2">
                <Input id="heartbeatUrl" value={heartbeatUrl} readOnly className="flex-1 bg-muted" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => navigator.clipboard.writeText(heartbeatUrl)}
                  title="Copy to clipboard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-copy"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Send a GET or POST request to this URL when your cron job runs
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <Input id="apiKey" value={apiKey} readOnly className="flex-1 bg-muted font-mono text-sm" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRegenerateApiKey}
                  disabled={isRegeneratingKey}
                  title="Regenerate API key"
                >
                  <RefreshCw className={`h-4 w-4 ${isRegeneratingKey ? "animate-spin" : ""}`} />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Warning: Regenerating the API key will invalidate the previous key
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
