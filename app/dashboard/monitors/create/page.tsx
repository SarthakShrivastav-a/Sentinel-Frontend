"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard/header"
import { useToast } from "@/components/ui/use-toast"
import { createMonitor } from "@/lib/api"
import { X } from "lucide-react"

export default function CreateMonitorPage() {
  const [url, setUrl] = useState("")
  const [triggerOn, setTriggerOn] = useState<string>("TIMEOUT")
  const [valueInput, setValueInput] = useState<string>("")
  const [values, setValues] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
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
      await createMonitor({
        url,
        errorCondition: {
          triggerOn,
          value: values,
        },
      })

      toast({
        title: "Monitor created",
        description: "Your monitor has been created successfully.",
      })

      router.push("/dashboard/monitors")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create monitor. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create Monitor</h2>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>New Monitor</CardTitle>
            <CardDescription>
              Create a new monitor to track the performance and availability of your website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="triggerOn">Trigger On</Label>
              <Select value={triggerOn} onValueChange={(value) => {
                setTriggerOn(value)
                // Reset values when changing trigger type
                setValues([])
              }}>
                <SelectTrigger id="triggerOn">
                  <SelectValue placeholder="Select a trigger condition" />
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

            <div className="space-y-2">
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/monitors")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Monitor"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}