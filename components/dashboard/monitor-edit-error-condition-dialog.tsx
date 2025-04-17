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
import { Edit } from "lucide-react"
import type { ErrorCondition, Monitor } from "@/lib/types"
import { updateMonitorErrorCondition } from "@/lib/api"

interface MonitorEditErrorConditionDialogProps {
  monitorId: string
  currentErrorCondition: ErrorCondition
  onUpdate: (updatedMonitor: Monitor) => void
}

export function MonitorEditErrorConditionDialog({
  monitorId,
  currentErrorCondition,
  onUpdate,
}: MonitorEditErrorConditionDialogProps) {
  const [open, setOpen] = useState(false)
  const [triggerOn, setTriggerOn] = useState(currentErrorCondition.triggerOn)
  const [threshold, setThreshold] = useState(currentErrorCondition.threshold)
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
        title: "Error condition updated",
        description: "The monitor error condition has been updated successfully.",
      })

      onUpdate(updatedMonitor)
      setOpen(false)
    } catch (error) {
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
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Error Condition
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Error Condition</DialogTitle>
            <DialogDescription>Update the error condition for this monitor.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="triggerOn">Trigger On</Label>
              <Select value={triggerOn} onValueChange={(value) => setTriggerOn(value)}>
                <SelectTrigger id="triggerOn">
                  <SelectValue placeholder="Select a trigger condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESPONSE_TIME">Response Time</SelectItem>
                  <SelectItem value="STATUS_CODE">Status Code</SelectItem>
                  <SelectItem value="CONTENT">Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold</Label>
              <Input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number.parseInt(e.target.value))}
                required
              />
              <p className="text-xs text-muted-foreground">
                {triggerOn === "RESPONSE_TIME"
                  ? "Alert when response time exceeds this value (in milliseconds)"
                  : triggerOn === "STATUS_CODE"
                    ? "Alert when status code is greater than or equal to this value"
                    : "Alert when content does not contain expected string"}
              </p>
            </div>
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
