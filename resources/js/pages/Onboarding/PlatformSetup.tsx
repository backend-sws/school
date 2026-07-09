import { Head, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import FloatingMotifs from "@/pages/Landing/components/shared/FloatingMotifs";
import GeometryPattern from "@/pages/Landing/components/shared/GeometryPattern";
import AppLogoIcon from "@/components/app-logo-icon";

/**
 * Purely visual setup steps — no actual API calls.
 * All seeding happens at app bootstrap; org data is written during storeOrgSetup.
 * This screen just gives a polished transition before redirecting to the subdomain.
 */
const SETUP_STEPS = [
    { label: "Verifying your account", delay: 0 },
    { label: "Configuring your institution", delay: 300 },
    { label: "Preparing your dashboard", delay: 600 },
    { label: "Almost ready…", delay: 900 },
] as const;

const TOTAL_ANIMATION_MS = SETUP_STEPS[SETUP_STEPS.length - 1].delay + 500;

interface Props {
    redirectUrl: string;
    institutionName: string;
}

export default function PlatformSetup({ redirectUrl, institutionName }: Props) {
    const { name: appName } = usePage<SharedData>().props;
    const [currentStep, setCurrentStep] = useState(0);
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
        let active = true;
        const timers: NodeJS.Timeout[] = [];

        // Animate through visual steps
        SETUP_STEPS.forEach((step, idx) => {
            const t = setTimeout(() => {
                if (active) setCurrentStep(idx);
            }, step.delay);
            timers.push(t);
        });

        // Mark all done
        const doneTimer = setTimeout(() => {
            if (active) {
                setCurrentStep(SETUP_STEPS.length);
                // Final redirect after a short delay
                const redirectTimer = setTimeout(() => {
                    if (active) window.location.href = redirectUrl;
                }, 600);
                timers.push(redirectTimer);

                // Show fallback button after 3 seconds if still here
                const fallbackTimer = setTimeout(() => {
                    if (active) setShowFallback(true);
                }, 3000);
                timers.push(fallbackTimer);
            }
        }, TOTAL_ANIMATION_MS);
        timers.push(doneTimer);

        return () => {
            active = false;
            timers.forEach(clearTimeout);
        };
    }, [redirectUrl]);

    const allDone = currentStep >= SETUP_STEPS.length;

    return (
        <div className="l-theme min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col items-center justify-center px-4 relative overflow-hidden">
            <Head title={`Setting Up — ${appName}`} />

            {/* Floating Madhubani motifs */}
            <FloatingMotifs count={10} opacity={0.03} seed={33} />

            {/* GeometryPattern at top */}
            <GeometryPattern autoSwap opacity={0.05} position="top" />

            {/* Dot pattern background */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-[1] bg-[radial-gradient(circle_at_1px_1px,var(--l-fg,#0F172A)_1px,transparent_0)] bg-[length:32px_32px]" />

            {/* Stepper at top */}
            <div className="w-full max-w-lg mb-10">
                <OnboardingStepper currentStep={7} />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full mx-auto px-6 text-center"
            >
                {/* Pulsing ring animation */}
                <div className="relative w-20 h-20 mx-auto mb-8">
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/20"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/10"
                        animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/5 border border-primary/20 overflow-hidden">
                        <AppLogoIcon className="absolute inset-0 size-full opacity-[0.08] grayscale scale-150" />
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Loader2 className="w-7 h-7 text-primary animate-spin" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-black text-foreground tracking-tight mb-1.5">
                    {allDone ? "You're all set!" : "Setting up your platform"}
                </h1>
                <p className="text-sm text-muted-foreground mb-8">
                    {allDone
                        ? "Redirecting to your dashboard…"
                        : `Preparing ${institutionName} for first use`}
                </p>

                {/* Step indicators */}
                <div className="space-y-3 text-left max-w-xs mx-auto">
                    {SETUP_STEPS.map((step, idx) => {
                        const isDone = currentStep > idx || allDone;
                        const isActive = currentStep === idx && !allDone;

                        return (
                            <motion.div
                                key={step.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.3 }}
                                className="flex items-center gap-3"
                            >
                                <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                                    <AnimatePresence mode="wait">
                                        {isDone ? (
                                            <motion.div
                                                key="done"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center"
                                            >
                                                <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                                            </motion.div>
                                        ) : isActive ? (
                                            <motion.div
                                                key="active"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                            >
                                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="pending"
                                                className="w-2 h-2 rounded-full bg-muted-foreground/20"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                                <span
                                    className={`text-xs font-semibold tracking-wide transition-colors duration-300 ${isDone
                                            ? "text-primary"
                                            : isActive
                                                ? "text-foreground"
                                                : "text-muted-foreground/40"
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Progress bar */}
                <div className="mt-8 h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: "0%" }}
                        animate={{
                            width: allDone
                                ? "100%"
                                : `${((currentStep + 1) / (SETUP_STEPS.length + 1)) * 100}%`,
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                </div>

                {/* Fallback Button */}
                <AnimatePresence>
                    {showFallback && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8"
                        >
                            <a
                                href={redirectUrl}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
