import { GuideDefinition } from "@/types/guide";
import { Lightbulb, PlayCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useGuide } from "@/components/GuideProvider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Each from "@/components/Each";

interface PageGuidanceProps {
    title?: string;
    guidance?: string | string[] | GuideDefinition;
    autoMinimizeDelay?: number; // Delay in ms, default 10000
}

export function PageGuidance({
    title,
    guidance,
    autoMinimizeDelay = 10000,
}: PageGuidanceProps) {
    const { activeGuide, startGuide } = useGuide();
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        if (autoMinimizeDelay > 0 && !isMinimized) {
            const timer = setTimeout(() => {
                setIsMinimized(true);
            }, autoMinimizeDelay);
            return () => clearTimeout(timer);
        }
    }, [autoMinimizeDelay, isMinimized]);

    // Prefer data from activeGuide if available, fallback to props
    const displayTitle = activeGuide?.pageTitle || (typeof guidance === 'object' && 'pageTitle' in guidance ? guidance.pageTitle : title) || "Guidance";
    const displayGuidance = activeGuide?.pageGuidance ||
        (typeof guidance === 'object' && 'pageGuidance' in guidance ? guidance.pageGuidance :
            (Array.isArray(guidance) ? guidance : guidance ? [guidance] : []));

    if (displayGuidance.length === 0) return null;

    return (
        <motion.div
            layout
            className={cn(
                "relative rounded-xl border border-primary/20 bg-primary/[0.03] p-3 transition-all hover:bg-primary/[0.05] group overflow-hidden",
                !isMinimized && "p-4"
            )}
        >
            {/* Theme-centric border animation */}
            <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none border-2 border-primary/30"
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.005, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <div className="flex items-start gap-4 relative z-10">
                <div className={cn(
                    "rounded-lg bg-primary/10 p-2 text-primary group-hover:scale-110 transition-transform flex-shrink-0 border border-primary/20",
                    !isMinimized && "p-2.5"
                )}>
                    <Lightbulb className={cn("size-4", !isMinimized && "size-5")} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">
                                KEY
                            </span>
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide opacity-90 truncate">
                                {displayTitle}
                            </h3>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1.5 h-auto rounded-full text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5 font-normal"
                                title={isMinimized ? "Expand" : "Minimize"}
                            >
                                {isMinimized ? (
                                    <>
                                        <span className="text-[10px] font-bold uppercase tracking-tight">Expand</span>
                                        <ChevronDown className="size-4" />
                                    </>
                                ) : (
                                    <ChevronUp className="size-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {!isMinimized && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ul className="space-y-1.5 mt-3">
                                    <Each
                                        of={displayGuidance}
                                        render={(item: string) => (
                                            <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                                                <span className="mt-1.5 size-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        )}
                                    />
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Progress bar for auto-minimize visual cue */}
            {!isMinimized && autoMinimizeDelay > 0 && (
                <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: autoMinimizeDelay / 1000, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-0.5 bg-primary/20 origin-left w-full"
                />
            )}
        </motion.div>
    );
}
