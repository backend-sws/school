import {
  User,
  MailCheck,
  CreditCard,
  Wallet,
  Building2,
  Upload,
  Rocket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Step definition ─────────────────────────────────────────────────────
export interface OnboardingStepConfig {
  /** Unique step key used for gating and tracking */
  key: string;
  /** Human-readable label shown in stepper */
  label: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Frontend route path */
  route: string;
  /** Step number (1-indexed) */
  step: number;
}

/** Single source of truth for the entire onboarding flow. */
export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  { key: "account",      label: "Account",      icon: User,       route: "/register",                   step: 1 },
  { key: "verify",       label: "Verify",       icon: MailCheck,  route: "/onboarding/verify-notice",   step: 2 },
  { key: "plan",         label: "Plan",         icon: CreditCard, route: "/onboarding/plan",            step: 3 },
  { key: "card",         label: "Payment",      icon: Wallet,     route: "/onboarding/card",            step: 4 },
  { key: "organization", label: "Organization", icon: Building2,  route: "/onboarding/setup",           step: 5 },
  { key: "data-import",  label: "Data Setup",   icon: Upload,     route: "/onboarding/data-import",     step: 6 },
  { key: "setup",        label: "Go Live",      icon: Rocket,     route: "/onboarding/platform-setup",  step: 7 },
];

export const TOTAL_ONBOARDING_STEPS = ONBOARDING_STEPS.length;

/** Lookup helper: step key → config */
export const STEP_BY_KEY = Object.fromEntries(
  ONBOARDING_STEPS.map((s) => [s.key, s]),
) as Record<string, OnboardingStepConfig>;

/** Get step config by step number */
export const getStepByNumber = (n: number) =>
  ONBOARDING_STEPS.find((s) => s.step === n);

// ── Verify Email Instructions ───────────────────────────────────────────
export const VERIFY_INSTRUCTIONS = [
  { key: "open", text: "Open the email from {appName} in any email app" },
  { key: "click", text: 'Click "Verify Email & Continue" — works in any browser or device' },
  { key: "auto", text: "This page will automatically redirect you to the next step" },
] as const;

// ── Step Content / Copy ─────────────────────────────────────────────────
export const ONBOARDING_CONTENT = {
  account: {
    title: "Create Your Account",
    description: "Enter your basic details to get started.",
  },
  verify: {
    title: "Check Your Inbox",
    descriptionTemplate: "We've sent a verification link to {email}. Click the link to verify and continue.",
  },
  plan: {
    title: "Choose Your Plan",
    description: "Pick a plan that fits your growth and activate your workspace.",
  },
  card: {
    title: "Payment Details",
    description: "Add your card for future billing. You won't be charged now.",
  },
  organization: {
    title: "Setup Your Organization",
    description: "Tell us about your institution to configure your workspace.",
  },
  dataImport: {
    title: "Setup Your Data",
    descriptionTemplate: "Configure initial data for {institutionName}. Auto-seed defaults or upload your own.",
  },
  goLive: {
    title: "Go Live",
    description: "Setting up your platform...",
  },
} as const;
