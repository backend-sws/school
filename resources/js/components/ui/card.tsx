import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRipple } from "@/hooks/use-ripple"

/* ============================================
   CARD COMPONENT SYSTEM (UX 4.0)
   ============================================ */

const cardVariants = cva(
  "rounded-xl border transition-all duration-300 outline-none relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-card border-border text-card-foreground",
        flat: "bg-muted/30 border-none text-card-foreground",
        outline: "bg-transparent border-border/60 text-card-foreground",
        glass: "bg-card/60 backdrop-blur-xl border-white/10 dark:border-white/5 text-card-foreground",
        elevated: "bg-card border-border shadow-md text-card-foreground",
        metrics: "bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-neutral-200/50 dark:border-zinc-800/50 text-card-foreground",
        action: "bg-primary/5 border-primary/20 text-card-foreground hover:bg-primary/10 hover:border-primary/40",
        destructive: "bg-destructive/5 border-destructive/20 text-destructive dark:text-destructive/80",
        secondary: "bg-secondary/50 border-secondary/20 text-secondary-foreground",
        ghost: "bg-transparent border-transparent text-card-foreground",
        gradient: "bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 text-card-foreground",
      },
      hoverable: {
        true: "hover:border-primary/30 hover:bg-white/80 dark:hover:bg-zinc-900/80 hover:-translate-y-0.5",
        false: "",
      },
      interactive: {
        true: "cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hoverable: false,
      interactive: false,
    },
  }
)

interface CardProps
  extends React.ComponentPropsWithoutRef<"div">,
  VariantProps<typeof cardVariants> {
  asChild?: boolean
  animated?: boolean
  delay?: number
  ripple?: boolean
}

const variantDefaults: Record<string, Partial<CardProps>> = {
  default: { animated: false, hoverable: false, interactive: false, ripple: false },
  flat: { animated: false, hoverable: false, interactive: false, ripple: false },
  outline: { animated: false, hoverable: false, interactive: false, ripple: false },
  glass: { animated: true, hoverable: true, interactive: false, ripple: false },
  elevated: { animated: true, hoverable: true, interactive: false, ripple: false },
  metrics: { animated: true, hoverable: true, interactive: false, ripple: false },
  action: { animated: true, hoverable: true, interactive: true, ripple: true },
  gradient: { animated: true, hoverable: true, interactive: false, ripple: false },
  destructive: { animated: true, hoverable: false, interactive: false, ripple: false },
  secondary: { animated: false, hoverable: true, interactive: false, ripple: false },
  ghost: { animated: false, hoverable: true, interactive: false, ripple: false },
}

type CardComponentProps = CardProps & Omit<HTMLMotionProps<"div">, keyof CardProps>

const Card = React.forwardRef<HTMLDivElement, CardComponentProps>(
  ({
    className,
    variant,
    hoverable,
    interactive,
    asChild = false,
    animated,
    delay = 0,
    ripple,
    onClick,
    children,
    ...props
  }, ref) => {
    const v = variant || "default"
    const defaults = variantDefaults[v]

    const isAnimated = animated ?? defaults.animated
    const isHoverable = hoverable ?? defaults.hoverable
    const isInteractive = interactive ?? defaults.interactive
    const isRipple = ripple ?? defaults.ripple

    const Component = asChild ? Slot : (isAnimated ? motion.div : "div")
    const { ripples, createRipple } = useRipple()

    const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isInteractive && isRipple) {
        createRipple(e)
      }
      if (onClick) {
        onClick(e)
      }
    }

    const animationProps = isAnimated ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: delay, ease: "easeOut" }
    } : {}

    const sharedProps = {
      ref,
      className: cn(cardVariants({ variant: v as any, hoverable: isHoverable, interactive: isInteractive, className })),
      onClick: handleOnClick,
      ...(animationProps as any),
      ...props
    }

    return (
      <Component {...(sharedProps as any)}>
        {children}
        {isInteractive && isRipple && ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="card-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
      </Component>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h3">>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

/* ============================================
   STAT CARD - For dashboard metrics
   ============================================ */

interface StatCardProps extends CardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral" | { value: number; isPositive: boolean }
  trendValue?: string
  iconColor?: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({
    title,
    value,
    description,
    icon,
    trend,
    trendValue,
    iconColor,
    className,
    variant = "metrics",
    ...props
  }, ref) => {
    // Normalize trend
    const isUp = typeof trend === "object" ? trend.isPositive : trend === "up"
    const isDown = typeof trend === "object" ? !trend.isPositive : trend === "down"
    const displayTrendValue = typeof trend === "object" ? `${trend.value}%` : trendValue

    return (
      <Card
        ref={ref}
        variant={variant}
        className={cn("p-6", className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">{title}</p>
            <p className="text-3xl font-black tracking-tight text-foreground">{value}</p>
            {(description || displayTrendValue) && (
              <p className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1.5">
                {displayTrendValue && (
                  <span className={cn(
                    "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold",
                    isUp && "bg-success/10 text-success",
                    isDown && "bg-destructive/10 text-destructive"
                  )}>
                    {isUp && "↑ "}
                    {isDown && "↓ "}
                    {displayTrendValue}
                  </span>
                )}
                <span>{description}</span>
              </p>
            )}
          </div>
          {icon && (
            <div className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
              "bg-primary/10 text-primary border border-primary/10",
              iconColor
            )}>
              <div className="size-6 [&_svg]:size-full">
                {icon}
              </div>
            </div>
          )}
        </div>
      </Card>
    )
  }
)
StatCard.displayName = "StatCard"

const StatCardSkeleton = () => (
  <Card variant="metrics" className="p-6 h-[110px] flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <div className="h-3 w-20 bg-muted/60 animate-pulse rounded" />
        <div className="h-8 w-28 bg-muted/60 animate-pulse rounded" />
        <div className="h-3 w-32 bg-muted/40 animate-pulse rounded" />
      </div>
      <div className="h-12 w-12 bg-muted/60 animate-pulse rounded-2xl" />
    </div>
  </Card>
)

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  StatCardSkeleton,
}

export type { CardProps, StatCardProps }
