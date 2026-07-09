"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
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

export const description = "A line chart"

// Default enrollment data
const defaultChartData = [
  { month: "January", enrolled: 1800, graduated: 120 },
  { month: "February", enrolled: 1850, graduated: 0 },
  { month: "March", enrolled: 1900, graduated: 0 },
  { month: "April", enrolled: 1950, graduated: 0 },
  { month: "May", enrolled: 2000, graduated: 350 },
  { month: "June", enrolled: 2050, graduated: 0 },
]

const chartConfig: ChartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
}

interface ChartLineDefaultProps {
  /** Data array to display */
  chartData: any[]
  /** Key for X-axis data */
  xAxisKey: string
  /** Key for Y-axis data */
  yAxisKey: string
  /** Title of the chart */
  title: string
  /** Description text */
  description?: string
  /** Footer text (trend info) */
  footerText?: string
  /** Sub text */
  subText?: string
  /** Trend direction */
  trend?: "up" | "down"
  /** Optional class name */
  className?: string
}

/**
 * Line Chart component for trend visualization
 * Fully responsive with mobile-first design
 */
export function ChartLineDefault({
  chartData,
  xAxisKey,
  yAxisKey,
  title,
  description: desc,
  footerText,
  subText,
  trend = "up",
  className,
}: ChartLineDefaultProps) {
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
        {desc && (
          <CardDescription className="text-xs sm:text-sm">
            {desc}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        {(!chartData || chartData.length === 0) ? (
          <div className="h-[200px] sm:h-[250px] md:h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-2 border-2 border-dashed border-border/30 rounded-xl m-2 bg-muted/5">
            <TrendingUp className="h-8 w-8 opacity-20" />
            <p className="text-xs font-medium italic">No trend data available for this period</p>
          </div>
        ) : (
          <ChartContainer
            config={dynamicConfig}
            className="h-[200px] sm:h-[250px] md:h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: -26,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
                  axisLine={false}
                  tickMargin={12}
                  tickFormatter={(value: any) => value.toString().split('-').slice(1).join('/')}
                  className="text-[10px] sm:text-xs text-muted-foreground font-medium"
                  tick={{ fontSize: 10, fill: 'currentColor' }}
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
                  cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4" }}
                  content={<ChartTooltipContent formatter={(value) => `₹${Number(value).toLocaleString()}`} />}
                />
                <Area
                  dataKey={yAxisKey}
                  type="monotone"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                  activeDot={{ r: 5, fill: "hsl(var(--primary))", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>

      {(footerText || subText) && (
        <CardFooter className="flex-col items-start gap-1.5 sm:gap-2 text-xs sm:text-sm px-4 sm:px-6 pb-4 sm:pb-6">
          {footerText && (
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
              <span>{footerText}</span>
            </div>
          )}
          {subText && (
            <div className="text-muted-foreground text-[10px] sm:text-xs">
              {subText}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
