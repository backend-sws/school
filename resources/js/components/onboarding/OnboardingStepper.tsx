import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Each from "@/components/Each";
import {
  ONBOARDING_STEPS,
  TOTAL_ONBOARDING_STEPS,
  type OnboardingStepConfig,
} from "@/constants/onboarding/onboardingSteps";
import type { LucideIcon } from "lucide-react";

// ── Reusable Step Shape ─────────────────────────────────────────────────
export interface StepConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  step: number;
}

interface StepperProps {
  /** Current active step (1-indexed) */
  currentStep: number;
  /** Step definitions — defaults to ONBOARDING_STEPS for backward compat */
  steps?: StepConfig[];
  className?: string;
}

// ── Animation Variants ──────────────────────────────────────────────────
const nodeVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

const pulseVariants = {
  animate: {
    boxShadow: [
      "0 0 0 0px rgba(var(--primary-rgb, 59 130 246), 0.3)",
      "0 0 0 8px rgba(var(--primary-rgb, 59 130 246), 0)",
    ],
  },
};

/**
 * Reusable animated stepper component.
 * Works with any array of `StepConfig` — defaults to the 7-step onboarding flow.
 *
 * @example
 * // Onboarding (default steps)
 * <OnboardingStepper currentStep={3} />
 *
 * // Custom steps
 * <OnboardingStepper currentStep={2} steps={MY_CUSTOM_STEPS} />
 */
export function OnboardingStepper({
  currentStep,
  steps = ONBOARDING_STEPS,
  className,
}: StepperProps) {
  const totalSteps = steps.length;

  return (
    <div className={cn("w-full", className)}>
      {/* ── Desktop / Tablet Stepper ─────────────────────────────── */}
      <div className="hidden sm:flex items-center justify-between">
        <Each
          of={steps}
          keyExtractor={(s) => s.key}
          render={(step, index) => (
            <>
              {/* Step node */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
                className={cn(
                  "flex items-center gap-1.5 shrink-0 relative",
                  currentStep < step.step && "opacity-35",
                )}
              >
                {/* Animated circle */}
                <motion.div
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-300",
                    currentStep > step.step
                      ? "bg-primary/15 text-primary"
                      : currentStep === step.step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                  animate={
                    currentStep === step.step
                      ? pulseVariants.animate
                      : undefined
                  }
                  transition={
                    currentStep === step.step
                      ? { duration: 1.5, repeat: Infinity, ease: "easeOut" }
                      : undefined
                  }
                >
                  <AnimatePresence mode="wait">
                    {currentStep > step.step ? (
                      <motion.span
                        key="check"
                        variants={nodeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 15,
                        }}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="icon"
                        variants={nodeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                      >
                        <step.icon className="w-3.5 h-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[9px] font-black uppercase tracking-[0.15em] transition-colors duration-300 hidden lg:inline",
                    currentStep === step.step
                      ? "text-primary"
                      : currentStep > step.step
                        ? "text-primary/60"
                        : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </motion.div>

              {/* Animated connector line */}
              {index < steps.length - 1 && (
                <div className="relative h-[2px] flex-1 mx-1.5 lg:mx-3 bg-border/30 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary/50 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width:
                        currentStep > step.step
                          ? "100%"
                          : currentStep === step.step
                            ? "50%"
                            : "0%",
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              )}
            </>
          )}
        />
      </div>

      {/* ── Mobile Stepper ───────────────────────────────────────── */}
      <div className="flex sm:hidden items-center justify-between bg-primary/[0.03] border border-primary/10 rounded-2xl p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-bold text-foreground">
            {steps.find((s) => s.step === currentStep)?.label}
          </span>
        </div>

        {/* Mobile dots with animated active indicator */}
        <div className="flex gap-1 items-center">
          <Each
            of={steps}
            keyExtractor={(s) => s.key}
            render={(step) => (
              <motion.div
                layout
                className={cn(
                  "h-1.5 rounded-full",
                  currentStep === step.step
                    ? "bg-primary"
                    : currentStep > step.step
                      ? "bg-primary/40"
                      : "bg-primary/15",
                )}
                animate={{
                  width: currentStep === step.step ? 24 : 6,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
