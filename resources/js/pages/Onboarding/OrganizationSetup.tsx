import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { Button } from "@/components/ui/button";
import {
  REGISTER_ORG_FIELDS,
  SLUG_FIELD,
  BRAND_THEME_FIELD,
  UDISE_CODE_FIELD,
} from "@/constants/auth/registerFormConfig";
import { BRAND_THEME_OPTIONS, DEFAULT_BRAND_THEME } from "@/constants/onboarding/brandThemes";
import OnboardingLayout from "@/layouts/onboarding-layout";
import {
  OnboardingOrgFormValues,
  onboardingOrgSchema,
} from "@/lib/validations/register";
import { getAppHost } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface InstitutionType {
  value: string;
  label: string;
}

interface Props {
  institutionTypes: InstitutionType[];
}

const ALLOWED_INST_TYPES = ["school", "coaching"];

export default function OrganizationSetup({ institutionTypes }: Props) {
  const { name: appName, app_url: appUrl, branding } = usePage<SharedData>().props;
  const initialTheme = branding?.default_brand_theme || DEFAULT_BRAND_THEME;
  const slugManuallyEdited = useRef(false);
  const prevAutoSlug = useRef("");
  const [processing, setProcessing] = useState(false);
  const filteredTypes = institutionTypes.filter((t) => ALLOWED_INST_TYPES.includes(t.value));

  const form = useForm<OnboardingOrgFormValues>({
    defaultValues: {
      org_name: "",
      inst_type: "",
      brand_theme: initialTheme,
      slug: "",
      udise_code: "",
    },
    resolver: zodResolver(onboardingOrgSchema),
    mode: "onBlur",
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { isSubmitting },
  } = form;

  // ─── Live theme preview ────────────────────────────────────────────
  const applyTheme = (theme: string) => {
    const themeRoot = document.querySelector(".l-theme");
    if (themeRoot) themeRoot.setAttribute("data-theme", theme);
  };

  // Apply default theme on mount, reset on unmount
  useEffect(() => {
    applyTheme(initialTheme);
    return () => {
      const el = document.querySelector(".l-theme");
      if (el) el.removeAttribute("data-theme");
    };
  }, []);

  // ─── Watch fields for conditional rendering ──────────────────────
  const orgName = watch("org_name");
  const instType = watch("inst_type");
  const isSchool = instType === "school";

  useEffect(() => {
    const autoSlug = slugify(orgName);
    if (!slugManuallyEdited.current) {
      setValue("slug", autoSlug, { shouldValidate: autoSlug.length > 0 });
    }
    prevAutoSlug.current = autoSlug;
  }, [orgName, setValue]);

  const handleSlugChange = (value: string) => {
    const autoSlug = slugify(orgName);
    if (value === "" || value === autoSlug) {
      slugManuallyEdited.current = false;
    } else {
      slugManuallyEdited.current = true;
    }
    setValue("slug", value, { shouldValidate: true });
  };

  const onSubmit = (data: OnboardingOrgFormValues) => {
    setProcessing(true);
    router.post("/onboarding/setup", data as any, {
      onError: (errors) => {
        Object.entries(errors).forEach(([field, message]) => {
          setError(field as keyof OnboardingOrgFormValues, {
            type: "server",
            message: message as string,
          });
        });
      },
      onFinish: () => setProcessing(false),
    });
  };

  const onInvalid = (errors: any) => {
    console.log("[OrgSetup] validation errors:", errors);
  };

  // Build theme options for the select dropdown
  const themeOptions = BRAND_THEME_OPTIONS.map((t) => ({
    key: t.value,
    text: t.label,
    value: t.value,
  }));

  return (
    <OnboardingLayout
      currentStep={5}
      title="Setup Your Organization"
      description="Tell us about your institution to configure your workspace."
    >
      <Head title={`Organization Setup — ${appName}`} />

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
        <ControlledFormComponent<OnboardingOrgFormValues>
          {...REGISTER_ORG_FIELDS[0]}
          control={control}
          name="org_name"
        />

        <ControlledFormComponent<OnboardingOrgFormValues>
          {...REGISTER_ORG_FIELDS[1]}
          control={control}
          name="inst_type"
          options={filteredTypes.map((t) => ({
            key: t.value,
            text: t.label,
            value: t.value,
          }))}
        />

        <ControlledFormComponent<OnboardingOrgFormValues>
          {...UDISE_CODE_FIELD}
          control={control}
          name="udise_code"
        />

        <ControlledFormComponent<OnboardingOrgFormValues>
          {...BRAND_THEME_FIELD}
          control={control}
          name="brand_theme"
          options={themeOptions}
          onValueChange={applyTheme}
        />

        <ControlledFormComponent<OnboardingOrgFormValues>
          {...SLUG_FIELD}
          control={control}
          name="slug"
          onValueChange={handleSlugChange}
          domainSuffix={getAppHost(appUrl)}
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:flex-1 h-11 font-bold order-2 sm:order-1"
            disabled={processing}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="w-full sm:flex-2 h-11 font-bold shadow-xl shadow-primary/20 group order-1 sm:order-2"
            isLoading={processing}
            loadingText="Setting up workspace..."
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
}
