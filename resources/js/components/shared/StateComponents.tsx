import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    variant?: "error" | "warning" | "info";
    className?: string;
}

/**
 * ErrorState - Reusable error state component
 * Displays error messages with optional retry functionality
 */
export const ErrorState = ({
    title = "Something went wrong",
    message = "Unable to load data. Please try again later.",
    onRetry,
    variant = "error",
    className,
}: ErrorStateProps) => {
    const config = {
        error: {
            icon: AlertCircle,
            bgClass: "border-destructive/50 bg-destructive/5",
            iconBgClass: "bg-destructive/10",
            iconClass: "text-destructive",
        },
        warning: {
            icon: AlertTriangle,
            bgClass: "border-orange-500/50 bg-orange-50",
            iconBgClass: "bg-orange-100",
            iconClass: "text-orange-600",
        },
        info: {
            icon: Info,
            bgClass: "border-blue-500/50 bg-blue-50",
            iconBgClass: "bg-blue-100",
            iconClass: "text-blue-600",
        },
    }[variant];

    const Icon = config.icon;

    return (
        <Card className={cn(config.bgClass, className)}>
            <CardContent className="py-12">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className={cn("rounded-full p-3", config.iconBgClass)}>
                            <Icon className={cn("size-10", config.iconClass)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            {message}
                        </p>
                    </div>
                    {onRetry && (
                        <Button onClick={onRetry} variant="default">
                            Retry
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

interface EmptyStateProps {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
        variant?: "default" | "outline";
    };
    className?: string;
}

/**
 * EmptyState - Reusable empty state component
 * Displays when no data is available
 */
export const EmptyState = ({
    icon,
    title = "No data available",
    description = "There is no data to display at this time.",
    action,
    className,
}: EmptyStateProps) => {
    return (
        <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border-2 border-dashed w-full", className)}>
            {icon && (
                <div className="bg-muted rounded-full p-4 mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
                {description}
            </p>
            {action && (
                <Button
                    onClick={action.onClick}
                    variant={action.variant ?? "default"}
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
};
