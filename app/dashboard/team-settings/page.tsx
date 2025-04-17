import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"

export default function TeamSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Team Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Settings</CardTitle>
          <CardDescription>Manage your team settings and permissions.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Team settings coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}
