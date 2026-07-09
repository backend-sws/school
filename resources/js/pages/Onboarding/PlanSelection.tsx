import Each from "@/components/Each";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OnboardingLayout from "@/layouts/onboarding-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  PLAN_TIER_MAP,
  DEFAULT_TIER_CONFIG,
} from "@/constants/onboarding/planFeatures";

interface Plan {
  key: string;
  name: string;
  monthly: string;
  annual: string;
  is_popular: boolean;
  limits: { label: string; value: string }[];
  modules: { name: string; included: boolean }[];
}

interface Props {
  plans: Plan[];
}

export default function PlanSelection({ plans }: Props) {
  const { name: appName } = usePage<SharedData>().props;
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [selectedPlan, setSelectedPlan] = useState<string>(
    () => plans.find((p) => p.is_popular)?.key ?? plans[0]?.key ?? "",
  );
  const [processing, setProcessing] = useState(false);

  const confirmSelection = () => {
    if (processing || !selectedPlan) return;
    setProcessing(true);
    router.post(
      "/onboarding/plan",
      {
        plan_key: selectedPlan,
        billing_cycle: billingCycle,
      },
      {
        onFinish: () => setProcessing(false),
      },
    );
  };

  return (
    <OnboardingLayout
      currentStep={3}
      title="Choose Your Plan"
      description="Pick a plan that fits your institution. You can upgrade anytime."
      wide
    >
      <Head title={`Select a Plan — ${appName}`} />

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl">
          <Button
            variant="ghost"
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all h-auto",
              billingCycle === "monthly"
                ? "bg-background text-foreground shadow-sm hover:bg-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Monthly
          </Button>
          <Button
            variant="ghost"
            onClick={() => setBillingCycle("annual")}
            className={cn(
              "text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all h-auto",
              billingCycle === "annual"
                ? "bg-background text-foreground shadow-sm hover:bg-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Annual
          </Button>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          Save 15%
        </span>
      </div>

      {/* Plans Grid — polymorphic rendering from PLAN_TIER_MAP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Each
          of={plans}
          render={(plan, index) => {
            const isSelected = selectedPlan === plan.key;
            const tier = PLAN_TIER_MAP[plan.key] ?? DEFAULT_TIER_CONFIG;
            const IconComponent = tier.icon;

            return (
              <Card
                key={plan.key}
                variant={isSelected ? "glass" : "action"}
                delay={index * 0.05}
                className={cn(
                  "p-5 rounded-2xl flex flex-col cursor-pointer transition-all duration-200 relative group",
                  isSelected
                    ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                    : "border-border/60 hover:border-primary/30 hover:shadow-md",
                )}
                onClick={() => setSelectedPlan(plan.key)}
              >
                {/* Header: icon + name + badge */}
                <div className="flex items-start justify-between mb-1">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                      tier.iconBg,
                    )}
                  >
                    <IconComponent className={cn("w-4.5 h-4.5", tier.iconColor)} />
                  </div>
                  {plan.is_popular && (
                    <span className="bg-primary text-white px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest">
                      Popular
                    </span>
                  )}
                </div>

                {/* Plan name + tagline */}
                <h3 className="text-sm font-bold text-foreground mt-2">
                  {plan.name}
                </h3>
                <p className="text-[10px] text-muted-foreground/70 mb-3">
                  {tier.tagline}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-black text-foreground tracking-tight">
                    {billingCycle === "monthly" ? plan.monthly : plan.annual}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    /month
                  </span>
                </div>

                {/* Best for */}
                <p className="text-[10px] text-muted-foreground/60 mb-4">
                  {tier.bestFor}
                </p>

                {/* Divider */}
                <div className="h-px bg-border/50 mb-4" />

                {/* Features — config-driven per plan */}
                <ul className="space-y-2 flex-1">
                  <Each
                    of={tier.features}
                    render={(feature) => (
                      <li className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500 mt-px" />
                        <span className="text-muted-foreground leading-tight">
                          {feature}
                        </span>
                      </li>
                    )}
                  />
                </ul>

                {/* Selection ring indicator */}
                <div
                  className={cn(
                    "absolute top-3 right-3 w-4 h-4 rounded-full border-2 transition-all",
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-border/50",
                  )}
                >
                  {isSelected && (
                    <CheckCircle2 className="w-full h-full text-white" />
                  )}
                </div>
              </Card>
            );
          }}
        />
      </div>

      {/* Continue Button */}
      <Button
        size="lg"
        onClick={confirmSelection}
        disabled={!selectedPlan}
        isLoading={processing}
        loadingText="Setting up..."
        className="w-full max-w-sm mx-auto h-12 text-sm font-bold shadow-xl shadow-primary/20 transition-all hover:shadow-primary/30 group"
      >
        Continue with{" "}
        {plans.find((p) => p.key === selectedPlan)?.name ?? "Plan"}
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </Button>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-border/40 mt-4">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Secure
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Upgrade Anytime
          </span>
        </div>
      </div>
    </OnboardingLayout>
  );
}
