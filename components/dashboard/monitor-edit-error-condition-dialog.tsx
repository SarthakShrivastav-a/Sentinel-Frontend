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
import { X } from "lucide-react"

interface ErrorCondition {
  triggerOn: string
  value: number[]
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
  const [triggerOn, setTriggerOn] = useState(currentErrorCondition?.triggerOn || "STATUS_NOT")
  const [values, setValues] = useState<number[]>(currentErrorCondition?.value || [])
  const [valueInput, setValueInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddValue = () => {
    const numValue = parseInt(valueInput, 10)
    if (!isNaN(numValue) && valueInput.trim() !== "") {
      setValues([...values, numValue])
      setValueInput("")
    }
  }

  const handleRemoveValue = (index: number) => {
    const newValues = [...values]
    newValues.splice(index, 1)
    setValues(newValues)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (values.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one value.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)

    try {
      const updatedMonitor = await updateMonitorErrorCondition(monitorId, {
        triggerOn,
        value: values,
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

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Reset to current values when opening dialog
      setTriggerOn(currentErrorCondition?.triggerOn || "STATUS_NOT")
      setValues(currentErrorCondition?.value || [])
      setValueInput("")
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              <Select value={triggerOn} onValueChange={(value) => {
                setTriggerOn(value)
                // Reset values when changing trigger type
                setValues([])
              }}>
                <SelectTrigger id="triggerOn">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STATUS_NOT">Status Not</SelectItem>
                  <SelectItem value="RESPONSE_CONTAINS">Response Contains</SelectItem>
                  <SelectItem value="TIMEOUT">Timeout</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {triggerOn === "STATUS_NOT"
                  ? "Alert when status code is not in the list of allowed codes"
                  : triggerOn === "RESPONSE_CONTAINS"
                    ? "Alert when status code matches any in the list"
                    : "Alert when request times out or exceeds the specified duration (in seconds)"}
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="value">
                {triggerOn === "TIMEOUT" ? "Timeout Duration (seconds)" : "Status Codes"}
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="value"
                  type="number"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  placeholder={triggerOn === "TIMEOUT" ? "e.g. 5" : "e.g. 200, 404"}
                />
                <Button type="button" onClick={handleAddValue}>
                  Add
                </Button>
              </div>
            </div>

            {values.length > 0 && (
              <div className="border rounded-md p-3">
                <Label>Current Values:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-center bg-slate-100 rounded-md px-3 py-1">
                      <span>{value}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-2"
                        onClick={() => handleRemoveValue(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
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