import React, { useRef, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────── */

export interface StepItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
}

interface StepHeaderProps {
    steps: StepItem[];
    currentStep: string;
    completedSteps: string[];
    onStepClick?: (key: string) => void;
}

/* ─── Helpers ───────────────────────────────────────────────────────── */

type StepState = "completed" | "current" | "upcoming";

function getStepState(
    key: string,
    currentStep: string,
    completedSteps: string[],
): StepState {
    if (completedSteps.includes(key)) return "completed";
    if (key === currentStep) return "current";
    return "upcoming";
}

/* ─── Component ─────────────────────────────────────────────────────── */

export function StepHeader({
    steps,
    currentStep,
    completedSteps,
    onStepClick,
}: StepHeaderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll current step into view on mobile
    useEffect(() => {
        if (!scrollRef.current) return;
        const currentEl = scrollRef.current.querySelector("[data-step-current]");
        if (currentEl) {
            currentEl.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
        }
    }, [currentStep]);

    return (
        <div className="w-full" role="navigation" aria-label="Form steps">
            {/* ── Desktop: full horizontal stepper ──────────────────────── */}
            <div className="hidden md:block">
                <div className="flex items-center justify-between">
                    {steps.map((step, idx) => {
                        const state = getStepState(step.key, currentStep, completedSteps);
                        const isLast = idx === steps.length - 1;
                        const canClick = state === "completed" && !!onStepClick;

                        return (
                            <React.Fragment key={step.key}>
                                {/* Step circle + label */}
                                <button
                                    type="button"
                                    disabled={!canClick}
                                    onClick={() => canClick && onStepClick?.(step.key)}
                                    className={cn(
                                        "group flex flex-col items-center gap-2 transition-all focus:outline-none",
                                        canClick && "cursor-pointer",
                                        !canClick && "cursor-default",
                                    )}
                                    aria-current={state === "current" ? "step" : undefined}
                                >
                                    {/* Circle */}
                                    <div
                                        className={cn(
                                            "relative flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                                            state === "completed" &&
                                            "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20",
                                            state === "current" &&
                                            "border-primary bg-primary/10 text-primary ring-4 ring-primary/20",
                                            state === "upcoming" &&
                                            "border-muted-foreground/30 bg-muted text-muted-foreground",
                                            canClick && "group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30",
                                        )}
                                        {...(state === "current" ? { "data-step-current": true } : {})}
                                    >
                                        {state === "completed" ? (
                                            <Check className="size-5" strokeWidth={2.5} />
                                        ) : step.icon ? (
                                            step.icon
                                        ) : (
                                            idx + 1
                                        )}

                                        {/* Pulse ring for current step */}
                                        {state === "current" && (
                                            <span className="absolute inset-0 animate-ping rounded-full border-2 border-primary opacity-20" />
                                        )}
                                    </div>

                                    {/* Label */}
                                    <span
                                        className={cn(
                                            "max-w-[100px] text-center text-xs font-medium leading-tight transition-colors",
                                            state === "completed" && "text-primary",
                                            state === "current" && "text-primary font-semibold",
                                            state === "upcoming" && "text-muted-foreground",
                                        )}
                                    >
                                        {step.label}
                                    </span>
                                </button>

                                {/* Connector line */}
                                {!isLast && (
                                    <div className="mx-1 h-0.5 flex-1 rounded-full bg-muted-foreground/15 relative overflow-hidden">
                                        <div
                                            className={cn(
                                                "absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500",
                                                state === "completed" ? "w-full" : "w-0",
                                            )}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* ── Mobile: compact horizontal scroll ─────────────────────── */}
            <div className="md:hidden">
                <div
                    ref={scrollRef}
                    className="flex items-center gap-2 overflow-x-auto pb-2 px-1 scrollbar-none"
                >
                    {steps.map((step, idx) => {
                        const state = getStepState(step.key, currentStep, completedSteps);
                        const canClick = state === "completed" && !!onStepClick;

                        return (
                            <button
                                key={step.key}
                                type="button"
                                disabled={!canClick}
                                onClick={() => canClick && onStepClick?.(step.key)}
                                className={cn(
                                    "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                                    state === "completed" &&
                                    "bg-primary/10 text-primary",
                                    state === "current" &&
                                    "bg-primary text-primary-foreground shadow-md",
                                    state === "upcoming" &&
                                    "bg-muted text-muted-foreground",
                                    canClick && "active:scale-95",
                                )}
                                {...(state === "current" ? { "data-step-current": true } : {})}
                            >
                                <span
                                    className={cn(
                                        "flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                                        state === "completed" && "bg-primary text-primary-foreground",
                                        state === "current" && "bg-primary-foreground text-primary",
                                        state === "upcoming" && "bg-muted-foreground/20 text-muted-foreground",
                                    )}
                                >
                                    {state === "completed" ? (
                                        <Check className="size-3" strokeWidth={3} />
                                    ) : (
                                        idx + 1
                                    )}
                                </span>
                                <span className="whitespace-nowrap">{step.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
