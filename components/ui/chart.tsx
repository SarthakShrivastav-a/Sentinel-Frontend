"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("relative", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("absolute left-0 top-0 h-full w-full", className)} ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("pointer-events-none", className)} ref={ref} {...props} />
  },
)
ChartTooltip.displayName = "ChartTooltip"

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  value?: string
  formatter?: (value: any) => string[]
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ className, label, value, formatter, ...props }, ref) => {
    const formatted = formatter?.(value) || [value, label]
    return (
      <div className={cn("rounded-md border bg-popover p-4 text-sm shadow-sm", className)} ref={ref} {...props}>
        {label && <div className="font-medium">{label}</div>}
        {formatted && (
          <div className="grid gap-1">
            <div className="text-muted-foreground">{formatted[1]}</div>
            <div>{formatted[0]}</div>
          </div>
        )}
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("flex items-center space-x-2", className)} ref={ref} {...props} />
  },
)
ChartLegend.displayName = "ChartLegend"

interface ChartLegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string
  label: string
}

const ChartLegendItem = React.forwardRef<HTMLDivElement, ChartLegendItemProps>(
  ({ className, color, label, ...props }, ref) => {
    return (
      <div className={cn("flex items-center space-x-2 text-sm", className)} ref={ref} {...props}>
        <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span>{label}</span>
      </div>
    )
  },
)
ChartLegendItem.displayName = "ChartLegendItem"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }
