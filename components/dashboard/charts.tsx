"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const responseTimeData = [
  { name: "Mon", value: 320 },
  { name: "Tue", value: 350 },
  { name: "Wed", value: 290 },
  { name: "Thu", value: 380 },
  { name: "Fri", value: 320 },
  { name: "Sat", value: 280 },
  { name: "Sun", value: 300 },
]

const uptimeData = [
  { name: "Mon", value: 100 },
  { name: "Tue", value: 100 },
  { name: "Wed", value: 99.8 },
  { name: "Thu", value: 100 },
  { name: "Fri", value: 100 },
  { name: "Sat", value: 100 },
  { name: "Sun", value: 99.9 },
]

const alertsData = [
  { name: "Mon", value: 0 },
  { name: "Tue", value: 0 },
  { name: "Wed", value: 1 },
  { name: "Thu", value: 0 },
  { name: "Fri", value: 0 },
  { name: "Sat", value: 0 },
  { name: "Sun", value: 1 },
]

export function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Response Time</CardTitle>
          <CardDescription>Average response time over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[200px]">
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, style: { fill: "hsl(var(--primary))" } }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="border-none bg-background p-2 shadow-md"
                        label="Response Time"
                        formatter={(value) => [`${value}ms`, "Response Time"]}
                      />
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Uptime</CardTitle>
          <CardDescription>Uptime percentage over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[200px]">
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeData}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[99, 100]} tickCount={3} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary)/0.2)"
                    strokeWidth={2}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="border-none bg-background p-2 shadow-md"
                        label="Uptime"
                        formatter={(value) => [`${value}%`, "Uptime"]}
                      />
                    }
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>Number of alerts over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[200px]">
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertsData}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="border-none bg-background p-2 shadow-md"
                        label="Alerts"
                        formatter={(value) => [`${value}`, "Alerts"]}
                      />
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>
    </div>
  )
}
