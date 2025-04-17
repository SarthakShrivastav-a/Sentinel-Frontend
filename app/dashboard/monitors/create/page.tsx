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

export default function CreateMonitorPage() {
  const [url, setUrl] = useState("")
  const [triggerOn, setTriggerOn] = useState<string>("RESPONSE_TIME")
  const [threshold, setThreshold] = useState<number>(500)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createMonitor({
        url,
        errorCondition: {
          triggerOn,
          threshold,
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
