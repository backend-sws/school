import {
  Layers,
  Rocket,
  Building2,
  Crown,
  type LucideIcon,
} from "lucide-react";

/**
 * Rich config for each plan tier.
 * The key must match the plan `key` from the backend.
 */
export interface PlanTierConfig {
  /** Short tagline below the plan name */
  tagline: string;
  /** Icon component for the card header */
  icon: LucideIcon;
  /** Accent color class for the icon bg */
  iconBg: string;
  /** Accent color class for the icon itself */
  iconColor: string;
  /** Who this plan is best suited for */
  bestFor: string;
  /** Feature list shown on the card */
  features: string[];
  /** CTA label override — defaults to "Continue" */
  cta?: string;
}

/**
 * Map of plan keys → rich config.
 * Add new tiers here; the page renders polymorphically.
 */
export const PLAN_TIER_MAP: Record<string, PlanTierConfig> = {
  foundation: {
    tagline: "Get started with the essentials",
    icon: Layers,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    bestFor: "Small schools with up to 500 students",
    features: [
      "Dashboard & Analytics",
      "Student & Staff Records",
      "Attendance Tracking",
      "Basic Fee Collection",
      "Email Notifications",
    ],
  },
  professional: {
    tagline: "Everything you need to grow",
    icon: Rocket,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    bestFor: "Growing schools with 500–2,000 students",
    features: [
      "Everything in Foundation",
      "Admissions & Applications",
      "Examination & Grading",
      "Fee Reports & Receipts",
      "SMS + Email Notifications",
      "Student & Parent Portal",
    ],
  },
  enterprise: {
    tagline: "Scale across branches",
    icon: Building2,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    bestFor: "Multi-branch institutions with 2,000+ students",
    features: [
      "Everything in Professional",
      "Multi-Branch Management",
      "Inventory & Transport",
      "Library Management",
      "Certificate Generation",
      "Custom Reports",
      "Priority Support",
    ],
  },
  institution_plus: {
    tagline: "Full power, no limits",
    icon: Crown,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    bestFor: "Universities & large institution groups",
    features: [
      "Everything in Enterprise",
      "LMS & Online Classes",
      "Grievance & Helpdesk",
      "API Access & Integrations",
      "White-Label Branding",
      "Dedicated Account Manager",
      "SLA-Backed 99.9% Uptime",
    ],
  },
};

/** Fallback when a plan key isn't in the map */
export const DEFAULT_TIER_CONFIG: PlanTierConfig = {
  tagline: "Core institutional tools",
  icon: Layers,
  iconBg: "bg-gray-50",
  iconColor: "text-gray-500",
  bestFor: "All institution types",
  features: [
    "Dashboard",
    "Student Management",
    "Attendance",
    "Fee Collection",
    "Notifications",
  ],
};
