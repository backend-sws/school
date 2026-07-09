import * as React from "react"
import { cn } from "@/lib/utils"
import Each from "@/components/Each"
import { Card, CardContent } from "@/components/ui/card"

/* ============================================
   SKELETON COMPONENTS
   ============================================ */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

/**
 * Base Skeleton component for loading states
 * Uses pulse animation with proper ARIA labels
 */
function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading..."
      className={cn(
        "animate-skeleton rounded-md bg-muted",
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Card skeleton preset for dashboard cards
 */
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 space-y-4", className)}>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

/**
 * Stat card skeleton for dashboard metrics
 */
function StatSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

/**
 * Table row skeleton for data tables
 */
function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3">
      <Each
        of={Array.from({ length: columns }, (_, i) => i)}
        render={(_, i) => (
          <Skeleton
            className={cn(
              "h-4",
              i === 0 ? "w-32" : "flex-1"
            )}
          />
        )}
      />
    </div>
  )
}

/**
 * Table skeleton for data tables
 */
function TableSkeleton({
  rows = 5,
  columns = 4,
  className
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-1 divide-y divide-border", className)}>
      {/* Header */}
      <div className="flex items-center gap-4 py-3 bg-muted/50 rounded-t-lg px-4">
        <Each
          of={Array.from({ length: columns }, (_, i) => i)}
          render={() => <Skeleton className="h-4 flex-1" />}
        />
      </div>
      {/* Rows */}
      <div className="px-4">
        <Each
          of={Array.from({ length: rows }, (_, i) => i)}
          render={() => <TableRowSkeleton columns={columns} />}
        />
      </div>
    </div>
  )
}

/**
 * Chart skeleton for Recharts containers
 */
function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card overflow-hidden", className)}>
      {/* Header */}
      <div className="p-6 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      {/* Chart area */}
      <div className="px-6 pb-6">
        <div className="relative h-[200px] flex items-end gap-2">
          <Each
            of={Array.from({ length: 6 }, (_, i) => i)}
            render={(_, i) => (
              <Skeleton
                className="flex-1 rounded-t-md"
                style={{ height: `${35 + (i * 8) % 55}%` }}
              />
            )}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Form skeleton for loading form states
 */
function FormSkeleton({
  fields = 3,
  className
}: {
  fields?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-6", className)}>
      <Each
        of={Array.from({ length: fields }, (_, i) => i)}
        render={() => (
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
      />
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  )
}

/**
 * Media card skeleton for image-based cards (banners, galleries)
 * Use for loading states of visual content cards with aspect-video image area
 */
function MediaCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden border rounded-lg flex flex-col", className)}>
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between gap-2">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="flex justify-between pt-2 border-t">
          <Skeleton className="h-3 w-16" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Media card skeleton with description lines (for gallery cards)
 */
function MediaCardWithDescriptionSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden border rounded-lg flex flex-col", className)}>
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between gap-2">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between pt-2 border-t">
          <Skeleton className="h-3 w-20" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Article card skeleton for text-heavy cards (ticker, news)
 * Use for loading states of horizontal article-style cards
 */
function ArticleCardSkeleton({
  contentLines = 1,
  className
}: {
  contentLines?: 1 | 2 | 3
  className?: string
}) {
  return (
    <Card className={cn("border rounded-lg", className)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between gap-2">
          <Skeleton className="h-4 flex-1 max-w-[200px]" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 w-40" />
        {contentLines >= 2 && <Skeleton className="h-4 w-full" />}
        {contentLines >= 3 && <Skeleton className="h-4 w-3/4" />}
      </CardContent>
    </Card>
  )
}

/* ============================================
   LOADING WRAPPER COMPONENT
   ============================================ */

type SkeletonType =
  | "card"
  | "stat"
  | "table"
  | "chart"
  | "form"
  | "custom"

interface LoadingWrapperProps {
  /** Whether content is loading */
  isLoading: boolean
  /** The content to render when not loading */
  children: React.ReactNode
  /** Type of skeleton to show during loading */
  skeletonType?: SkeletonType
  /** Custom skeleton component for 'custom' type */
  skeleton?: React.ReactNode
  /** Number of skeleton items to show (for lists/grids) */
  count?: number
  /** Additional class name for the skeleton container */
  className?: string
  /** Props for table skeleton */
  tableProps?: { rows?: number; columns?: number }
  /** Props for form skeleton */
  formProps?: { fields?: number }
  /** Error state to show error UI instead */
  error?: Error | null
  /** Custom error UI */
  errorFallback?: React.ReactNode
}

/**
 * LoadingWrapper - Reusable component for handling loading states
 * 
 * @example
 * // Basic usage with card skeleton
 * <LoadingWrapper isLoading={isLoading} skeletonType="card">
 *   <DashboardCard data={data} />
 * </LoadingWrapper>
 * 
 * @example
 * // Multiple skeletons for a grid
 * <LoadingWrapper isLoading={isLoading} skeletonType="stat" count={4}>
 *   {stats.map(stat => <StatCard key={stat.id} {...stat} />)}
 * </LoadingWrapper>
 * 
 * @example
 * // Custom skeleton
 * <LoadingWrapper 
 *   isLoading={isLoading} 
 *   skeletonType="custom"
 *   skeleton={<MySkeleton />}
 * >
 *   <MyComponent />
 * </LoadingWrapper>
 */
function LoadingWrapper({
  isLoading,
  children,
  skeletonType = "card",
  skeleton,
  count = 1,
  className,
  tableProps,
  formProps,
  error,
  errorFallback,
}: LoadingWrapperProps) {
  // Handle error state
  if (error) {
    if (errorFallback) {
      return <>{errorFallback}</>
    }
    return (
      <div
        role="alert"
        className={cn(
          "rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center",
          className
        )}
      >
        <p className="text-destructive font-medium">
          Something went wrong
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {error.message || "Please try again later."}
        </p>
      </div>
    )
  }

  // Handle loading state
  if (isLoading) {
    const renderSkeleton = () => {
      switch (skeletonType) {
        case "card":
          return <CardSkeleton className={className} />
        case "stat":
          return <StatSkeleton className={className} />
        case "table":
          return (
            <TableSkeleton
              className={className}
              rows={tableProps?.rows}
              columns={tableProps?.columns}
            />
          )
        case "chart":
          return <ChartSkeleton className={className} />
        case "form":
          return <FormSkeleton className={className} fields={formProps?.fields} />
        case "custom":
          return skeleton || <Skeleton className={cn("h-32 w-full", className)} />
        default:
          return <CardSkeleton className={className} />
      }
    }

    // Render multiple skeletons if count > 1
    if (count > 1) {
      return (
        <Each
          of={Array.from({ length: count }, (_, i) => i)}
          render={() => <>{renderSkeleton()}</>}
        />
      )
    }

    return renderSkeleton()
  }

  // Render children when not loading
  return <>{children}</>
}

/* ============================================
   INLINE LOADING COMPONENT
   ============================================ */

interface InlineLoadingProps {
  /** Whether loading */
  isLoading: boolean
  /** Size of the skeleton line */
  size?: "sm" | "md" | "lg"
  /** Width of the skeleton */
  width?: string
  /** The content to show when not loading */
  children: React.ReactNode
}

/**
 * InlineLoading - For inline text/value loading states
 * 
 * @example
 * <p>Total: <InlineLoading isLoading={loading} width="w-16">{total}</InlineLoading></p>
 */
function InlineLoading({
  isLoading,
  size = "md",
  width = "w-20",
  children,
}: InlineLoadingProps) {
  if (isLoading) {
    const heightClass = size === "sm" ? "h-3" : size === "lg" ? "h-6" : "h-4"
    return <Skeleton className={cn("inline-block", heightClass, width)} />
  }
  return <>{children}</>
}

export {
  Skeleton,
  CardSkeleton,
  StatSkeleton,
  TableSkeleton,
  TableRowSkeleton,
  ChartSkeleton,
  FormSkeleton,
  MediaCardSkeleton,
  MediaCardWithDescriptionSkeleton,
  ArticleCardSkeleton,
  LoadingWrapper,
  InlineLoading,
}
