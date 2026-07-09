import { Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsTipProps {
    title?: string;
    description?: string;
    className?: string;
    autoCloseDelay?: number; // Delay in ms, default 8000
}

export default function SettingsTip({
    title = "Pro-tip",
    description,
    className,
    autoCloseDelay = 8000
}: SettingsTipProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastDescription, setLastDescription] = useState(description);

    if (description !== lastDescription) {
        setLastDescription(description);
        setIsVisible(true);
    }

    useEffect(() => {
        if (autoCloseDelay > 0 && isVisible && description) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [autoCloseDelay, isVisible, description]);

    if (!description || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }}
                className={cn(
                    "relative rounded-xl border border-amber-200 bg-amber-50/50 p-4 transition-colors hover:bg-amber-50 group flex items-start gap-4 overflow-hidden",
                    className
                )}
            >
                {/* Theme-centric border animation */}
                <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none border-2 border-amber-300/40"
                    animate={{
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.01, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <div className="rounded-lg bg-amber-100 p-2.5 text-amber-600 group-hover:scale-110 transition-transform flex-shrink-0 border border-amber-200 relative z-10">
                    <Zap className="size-4" />
                </div>
                <div className="space-y-1.5 flex-1 pr-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="bg-amber-200 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            PRO
                        </span>
                        <h3 className="text-sm font-extrabold text-amber-900 uppercase tracking-wide">
                            {title}
                        </h3>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {description}
                    </p>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible(false)}
                    className="absolute top-3 right-3 p-1.5 h-7 w-7 rounded-full text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-colors"
                    aria-label="Close tip"
                >
                    <X className="size-3.5" />
                </Button>

                {/* Progress bar for auto-close visual cue */}
                {autoCloseDelay > 0 && (
                    <motion.div
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: autoCloseDelay / 1000, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-0.5 bg-amber-200 origin-left w-full"
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
}
