"use client"

import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A bar chart"

const chartConfig: ChartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
}

interface ChartBarDefaultProps {
  /** Data array to display */
  chartData: any[]
  /** Title of the chart */
  title: string
  /** Key for X-axis data */
  xAxisKey: string
  /** Key for Y-axis data */
  yAxisKey: string
  /** Optional class name */
  className?: string
  /** Footer text (trend info) */
  footerText?: string
  /** Sub text (description) */
  subText?: string
  /** Trend direction for icon */
  trend?: "up" | "down"
}

/**
 * Bar Chart component for dashboard analytics
 * Fully responsive with mobile-first design
 */
export function ChartBarDefault({
  chartData,
  title,
  xAxisKey,
  yAxisKey,
  className,
  footerText = "",
  subText = "",
  trend = "up",
}: ChartBarDefaultProps) {
  // Create dynamic chart config based on yAxisKey
  const dynamicConfig: ChartConfig = {
    [yAxisKey]: {
      label: title,
      color: "var(--chart-1)",
    },
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-sm sm:text-base font-semibold">
          {title}
        </CardTitle>
        {subText && (
          <CardDescription className="text-xs sm:text-sm">
            {subText}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pb-2 px-4 sm:px-6">
        {(!chartData || chartData.length === 0) ? (
          <div className="h-[200px] sm:h-[250px] md:h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-2 border-2 border-dashed border-border/30 rounded-xl m-2 bg-muted/5">
            <BarChart3 className="h-8 w-8 opacity-20" />
            <p className="text-[10px] sm:text-xs font-medium italic">No distribution data available</p>
          </div>
        ) : (
          <ChartContainer config={dynamicConfig} className="h-[200px] sm:h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                accessibilityLayer
                margin={{ top: 20, right: 20, left: -26, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-muted/20"
                />
                <XAxis
                  dataKey={xAxisKey}
                  tickLine={false}
                  tickMargin={12}
                  axisLine={false}
                  tickFormatter={(value: string) => value.length > 10 ? value.slice(0, 10) + '...' : value}
                  className="text-[10px] sm:text-xs text-muted-foreground font-medium"
                  tick={{ fontSize: 10, fill: 'currentColor' }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value: any) => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                  className="text-[10px] sm:text-xs text-muted-foreground"
                  tick={{ fontSize: 10, fill: 'currentColor' }}
                  width={50}
                />
                <ChartTooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.15 }}
                  content={<ChartTooltipContent hideLabel formatter={(value) => `₹${Number(value).toLocaleString()}`} />}
                />
                <Bar
                  dataKey={yAxisKey}
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>

      {footerText && (
        <CardFooter className="pt-2 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex w-full items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <div
              className={cn(
                "flex items-center gap-1 font-medium",
                trend === "up" ? "text-success" : "text-destructive"
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              )}
              <span className="truncate">{footerText}</span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
