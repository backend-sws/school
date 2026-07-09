import { Button } from "@/components/ui/button";
import OnboardingLayout from "@/layouts/onboarding-layout";
import { ONBOARDING_CONTENT } from "@/constants/onboarding/onboardingSteps";
import { CARD_DETAILS_FIELDS } from "@/constants/onboarding/cardFormConfig";
import {
  cardDetailsSchema,
  type CardDetailsFormValues,
} from "@/lib/validations/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import {
  ArrowRight,
  CreditCard,
  ShieldCheck,
  SkipForward,
} from "lucide-react";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { cn } from "@/lib/utils";

export default function CardDetails() {
  const { name: appName } = usePage<SharedData>().props;

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting },
  } = useForm<CardDetailsFormValues>({
    resolver: zodResolver(cardDetailsSchema),
    mode: "onChange",
    defaultValues: {
      card_number: "",
      card_holder: "",
      card_expiry: "",
      card_cvv: "",
    },
  });

  const cardNumber = watch("card_number");
  const cardHolder = watch("card_holder");
  const expiry = watch("card_expiry");

  const onSubmit = (data: CardDetailsFormValues) => {
    router.post(
      "/onboarding/card",
      {
        card_number: data.card_number.replace(/\s/g, ""),
        card_holder: data.card_holder.trim(),
        card_expiry: data.card_expiry,
        card_cvv: data.card_cvv,
      },
      {
        onError: (serverErrors) => {
          Object.entries(serverErrors).forEach(([field, message]) => {
            setError(field as keyof CardDetailsFormValues, {
              type: "server",
              message: message as string,
            });
          });
        },
      },
    );
  };

  const handleSkip = () => {
    router.post("/onboarding/card", { skip: true });
  };

  // Derive card brand for visual
  const rawNum = cardNumber.replace(/\s/g, "");
  const cardBrand = rawNum.startsWith("4")
    ? "Visa"
    : rawNum.startsWith("5")
      ? "Mastercard"
      : rawNum.startsWith("3")
        ? "Amex"
        : "";

  const content = ONBOARDING_CONTENT.card;

  // Split fields into full-width and half-width groups
  const fullFields = CARD_DETAILS_FIELDS.filter((f) => f.layout !== "half");
  const halfFields = CARD_DETAILS_FIELDS.filter((f) => f.layout === "half");

  return (
    <OnboardingLayout
      currentStep={4}
      title={content.title}
      description={content.description}
    >
      <Head title={`Payment Details — ${appName}`} />

      {/* Card Preview */}
      <div className="mb-6 p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <CreditCard className="w-8 h-8 opacity-80" />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            {cardBrand || "Credit / Debit"}
          </span>
        </div>
        <div className="font-mono text-lg tracking-[0.25em] mb-4 opacity-90">
          {cardNumber || "•••• •••• •••• ••••"}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-widest opacity-40 mb-0.5">
              Card Holder
            </p>
            <p className="text-xs font-bold tracking-wide">
              {cardHolder || "YOUR NAME"}
            </p>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest opacity-40 mb-0.5">
              Expires
            </p>
            <p className="text-xs font-bold tracking-wide">
              {expiry || "MM/YY"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full-width fields (card number, cardholder) */}
        <Each
          of={fullFields}
          keyExtractor={(f) => f.name}
          render={(field) => (
            <ControlledFormComponent
              control={control}
              name={field.name as keyof CardDetailsFormValues}
              type={field.type}
              label={field.label}
              placeholder={field.placeholder}
              required={field.required}
              maxLength={field.maxLength}
              tooltip={field.tooltip}
              lowercase={field.name === "card_holder" ? false : undefined}
            />
          )}
        />

        {/* Half-width fields (expiry + cvv) */}
        <div className="grid grid-cols-2 gap-4">
          <Each
            of={halfFields}
            keyExtractor={(f) => f.name}
            render={(field) => (
              <ControlledFormComponent
                control={control}
                name={field.name as keyof CardDetailsFormValues}
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                maxLength={field.maxLength}
                tooltip={field.tooltip}
              />
            )}
          />
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
            We won't charge you now — your card is securely saved for future
            billing. Encrypted with AES-256.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="sm:flex-1 h-11 text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="w-3.5 h-3.5 mr-2" />
            Skip for Now
          </Button>
          <Button
            type="submit"
            className="sm:flex-[2] h-11 font-bold shadow-xl shadow-primary/20 group"
            isLoading={isSubmitting}
            loadingText="Encrypting & Saving..."
          >
            Save & Continue
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
