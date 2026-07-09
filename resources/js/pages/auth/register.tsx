import Each from "@/components/Each";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { LegalDisclaimer } from "@/components/shared/LegalDisclaimer";
import { REGISTER_ACCOUNT_FIELDS } from "@/constants/auth/registerFormConfig";
import OnboardingLayout from "@/layouts/onboarding-layout";
import {
  RegisterAccountFormValues,
  registerAccountSchema,
} from "@/lib/validations/register";
import { login } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";

export default function Register() {
  const { name: appName } = usePage<SharedData>().props;
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<RegisterAccountFormValues>({
    resolver: zodResolver(registerAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (data: RegisterAccountFormValues) => {
    return new Promise<void>((resolve, reject) => {
      router.post("/onboarding/account", data as any, {
        onSuccess: () => resolve(),
        onError: (errors) => {
          Object.entries(errors).forEach(([field, message]) => {
            setError(field as keyof RegisterAccountFormValues, {
              type: "server",
              message: message as string,
            });
          });
          reject();
        },
        onFinish: () => resolve(),
      });
    });
  };

  return (
    <OnboardingLayout
      currentStep={1}
      title="Create Your Account"
      description="Enter your basic details to get started."
    >
      <Head title={`Create Account — ${appName}`} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-(--space-4)">
        <Each
          of={REGISTER_ACCOUNT_FIELDS}
          render={(field) => (
            <ControlledFormComponent<RegisterAccountFormValues>
              {...field}
              control={control as any}
              name={field.name}
            />
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-sm font-bold shadow-xl shadow-primary/20 transition-all hover:shadow-primary/30 group mt-1"
          isLoading={isSubmitting}
          loadingText="Creating account..."
          data-test="register-button"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </form>

      {/* Sign In Link */}
      <div className="text-center text-sm text-muted-foreground mt-(--space-3) sm:mt-(--space-4)">
        Already have an account?{" "}
        <TextLink
          href={login()}
          className="font-semibold text-primary transition-colors hover:text-primary/80 underline decoration-primary/30 underline-offset-4"
        >
          Sign in
        </TextLink>
      </div>
    </OnboardingLayout>
  );
}
