"use client"

import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { MonitorCheckHistory } from "@/lib/types"
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { formatDate } from "@/lib/utils"

interface MonitorDetailChartsProps {
  recentChecks: MonitorCheckHistory[]
}

export function MonitorDetailCharts({ recentChecks }: MonitorDetailChartsProps) {
  // Reverse the array to show oldest to newest (left to right)
  const chartData = [...recentChecks].reverse().map((check) => ({
    name: formatDate(check.timestamp, "short"),
    responseTime: check.responseTime,
    statusCode: check.statusCode,
    status: check.status === "UP" ? 1 : 0,
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
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
                  tickFormatter={(value) => value.split(" ")[1]}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
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
        <h3 className="mb-2 text-sm font-medium">Status</h3>
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
                  tickFormatter={(value) => value.split(" ")[1]}
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
    </div>
  )
}
