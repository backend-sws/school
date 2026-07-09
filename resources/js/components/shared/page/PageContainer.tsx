import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface PageContainerProps {
    children: ReactNode;
    className?: string;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full" | "none";
}

export function PageContainer({
    children,
    className,
    maxWidth = "full",
}: PageContainerProps) {
    const maxWidthClasses = {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        "3xl": "max-w-screen-3xl",
        "4xl": "max-w-screen-4xl",
        "5xl": "max-w-screen-5xl",
        "6xl": "max-w-screen-6xl",
        "7xl": "max-w-screen-7xl",
        full: "max-w-full",
        none: "",
    };

    return (
        <div
            className={cn(
                "mx-auto w-full space-y-6",
                maxWidthClasses[maxWidth],
                className
            )}
        >
            {children}
        </div>
    );
}
