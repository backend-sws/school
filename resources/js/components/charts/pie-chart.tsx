"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { cn } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { PieChartIcon } from "lucide-react"

interface ChartDonutProps {
  /** Data array with { name, value, fill } */
  chartData: { name: string; value: number; fill: string }[]
  /** Title of the chart */
  title: string
  /** Description text */
  description?: string
  /** Optional class name */
  className?: string
  /** Inner radius for donut (0 for full pie) */
  innerRadius?: number
  /** Whether to show labels */
  showLabels?: boolean
  /** Format values as currency */
  isCurrency?: boolean
  /** Center label text */
  centerLabel?: string
  /** Center value text */
  centerValue?: string
}

/**
 * Reusable Donut/Pie chart component for dashboard analytics
 */
export function ChartDonut({
  chartData,
  title,
  description,
  className,
  innerRadius = 55,
  showLabels = false,
  isCurrency = false,
  centerLabel,
  centerValue,
}: ChartDonutProps) {
  // Build chart config from data
  const dynamicConfig: ChartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill }
    return acc
  }, {} as ChartConfig)

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  const formatValue = (value: number) => {
    if (isCurrency) {
      if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
      if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
      if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
      return `₹${value.toLocaleString("en-IN")}`
    }
    return value.toLocaleString()
  }

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const data = payload[0].payload
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0
    return (
      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.fill }} />
          <span className="text-xs font-medium text-muted-foreground">{data.name}</span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-bold text-foreground">{formatValue(data.value)}</span>
          <span className="text-[10px] font-medium text-muted-foreground">({percentage}%)</span>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        <CardTitle className="text-sm sm:text-base font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-4">
        {(!chartData || chartData.length === 0 || total === 0) ? (
          <div className="h-[200px] sm:h-[220px] flex flex-col items-center justify-center text-muted-foreground gap-2 border-2 border-dashed border-border/30 rounded-xl bg-muted/5">
            <PieChartIcon className="h-8 w-8 opacity-20" />
            <p className="text-xs font-medium italic">No data available</p>
          </div>
        ) : (
          <div className="relative">
            <ChartContainer config={dynamicConfig} className="h-[200px] sm:h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    animationBegin={0}
                    animationDuration={1200}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} className="outline-none" />
                    ))}
                  </Pie>
                  <Tooltip content={renderCustomTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            {/* Center label */}
            {(centerLabel || centerValue) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {centerValue && (
                  <span className="text-xl font-black tracking-tight text-foreground">{centerValue}</span>
                )}
                {centerLabel && (
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{centerLabel}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        {chartData.length > 0 && total > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <span className="text-[11px] font-medium text-muted-foreground">{item.name}</span>
                <span className="text-[10px] font-bold text-foreground/70">
                  {total > 0 ? `${((item.value / total) * 100).toFixed(0)}%` : '0%'}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
