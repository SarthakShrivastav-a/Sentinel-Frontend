"use client"

import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { MonitorCheckHistory } from "@/lib/types"
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { formatDate } from "@/lib/utils"

interface MonitorDetailChartsProps {
  recentChecks?: MonitorCheckHistory[] | null
}

export function MonitorDetailCharts({ recentChecks }: MonitorDetailChartsProps) {
  // Safely handle the case when recentChecks is undefined, null, or empty
  const checkHistory = recentChecks || []

  // Create chart data only if we have valid check history
  const chartData =
    checkHistory.length > 0
      ? [...checkHistory].reverse().map((check) => ({
          name: formatDate(check.timestamp, "short"),
          responseTime: check.responseTime,
          statusCode: check.statusCode,
          status: check.status === "UP" ? 1 : 0,
        }))
      : [
          // Provide default data when no check history is available
          {
            name: "No data",
            responseTime: 0,
            statusCode: 0,
            status: 0,
          },
        ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="mb-2 text-sm font-medium">Response Time (ms)</h3>
        <Chart className="h-[300px]">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => (value.includes(" ") ? value.split(" ")[1] : value)}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--primary))" }}
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
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Status History</h3>
        <Chart className="h-[300px]">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => (value.includes(" ") ? value.split(" ")[1] : value)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 1]}
                  tickFormatter={(value) => (value === 1 ? "UP" : "DOWN")}
                />
                <Area type="monotone" dataKey="status" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="border-none bg-background p-2 shadow-md"
                      label="Status"
                      formatter={(value) => [value === 1 ? "UP" : "DOWN", "Status"]}
                    />
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Chart>
      </div>

      <div className="md:col-span-2">
        <h3 className="mb-2 text-sm font-medium">Status Code Distribution</h3>
        <Chart className="h-[200px]">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => (value.includes(" ") ? value.split(" ")[1] : value)}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="statusCode" stroke="#f59e0b" fill="#f59e0b20" strokeWidth={2} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="border-none bg-background p-2 shadow-md"
                      label="Status Code"
                      formatter={(value) => [`${value}`, "Status Code"]}
                    />
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Chart>
      </div>
    </div>
  )
}
