import React from "react";
import { LayoutGrid, Calendar } from "lucide-react";

interface DashboardHeaderProps {
    name?: string;
}

export const DashboardHeader = ({ name }: DashboardHeaderProps) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const formatDate = () => {
        return new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const firstName = name?.split(" ")[0] || "Student";

    return (
        <header className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-1.5 px-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                    Student Dashboard & Intelligence
                </span>
                <div className="h-px w-8 bg-primary/20" />
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                <LayoutGrid className="size-6 text-primary/80 shrink-0" />
                <span>
                    {getGreeting()}, {firstName}
                </span>
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground/90 max-w-2xl flex items-center gap-2">
                <Calendar className="size-4" />
                <span className="font-medium text-foreground/80">
                    {formatDate()}
                </span>
            </p>
        </header>
    );
};
