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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { updateMonitorErrorCondition } from "@/lib/api"

interface ErrorCondition {
  triggerOn: string
  threshold: number
}

interface MonitorEditErrorConditionDialogProps {
  monitorId: string
  currentErrorCondition?: ErrorCondition
  onUpdate: (updatedMonitor: any) => void
}

export function MonitorEditErrorConditionDialog({
  monitorId,
  currentErrorCondition,
  onUpdate,
}: MonitorEditErrorConditionDialogProps) {
  const [open, setOpen] = useState(false)
  const [triggerOn, setTriggerOn] = useState(currentErrorCondition?.triggerOn || "STATUS_CODE")
  const [threshold, setThreshold] = useState<number>(currentErrorCondition?.threshold || 200)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updatedMonitor = await updateMonitorErrorCondition(monitorId, {
        triggerOn,
        threshold,
      })

      toast({
        title: "Success",
        description: "Monitor error condition updated successfully.",
      })

      onUpdate(updatedMonitor)
      setOpen(false)
    } catch (error) {
      console.error("Failed to update error condition:", error)
      toast({
        title: "Error",
        description: "Failed to update error condition. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Alert Conditions</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Alert Conditions</DialogTitle>
          <DialogDescription>Configure when you want to be alerted about this monitor.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="triggerOn">Alert When</Label>
              <Select value={triggerOn} onValueChange={(value) => setTriggerOn(value)}>
                <SelectTrigger id="triggerOn">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STATUS_CODE">Status Code is not 2xx</SelectItem>
                  <SelectItem value="RESPONSE_TIME">Response Time exceeds threshold</SelectItem>
                  <SelectItem value="CONTENT_MATCH">Content doesn't match</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {triggerOn === "RESPONSE_TIME" && (
              <div className="grid gap-2">
                <Label htmlFor="threshold">Response Time Threshold (ms)</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(Number.parseInt(e.target.value, 10))}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
