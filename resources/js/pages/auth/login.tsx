import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";
import { Head, router, Link } from "@inertiajs/react";
import { useInstitution } from "@/hooks/use-institution";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Each from "@/components/Each";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { HelperTooltip } from "@/components/ui/helper-tooltip";
import {
  adminLogin,
  getLoginValidationErrors,
} from "@/lib/api/authApi";
import { register } from "@/routes";
import TextLink from "@/components/text-link";
import { unifiedLoginSchema, type UnifiedLoginFormValues } from "@/lib/validations/login";
import { toast } from "sonner";
import { UNIFIED_LOGIN_FIELDS } from "@/constants/auth/loginFormConfig";

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
  canRegister: boolean;
  errors?: Record<string, string>;
}

export default function Login({
  status,
  canResetPassword,
  canRegister,
}: LoginProps) {
  const { name, is_brand } = useInstitution();

  const {
    control,
    handleSubmit,
    setError,
  } = useForm<UnifiedLoginFormValues>({
    defaultValues: { login_id: "", password: "", remember: false },
    resolver: zodResolver(unifiedLoginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: UnifiedLoginFormValues) =>
      adminLogin({
        login_id: data.login_id,
        password: data.password,
        remember: data.remember ?? false,
      }),
    onSuccess: (data: any) => {
      // Use window.location for full navigation (may redirect cross-origin to subdomain)
      window.location.href = data?.redirect || "/dashboard";
    },
    onError: (error: unknown) => {
      const validation = getLoginValidationErrors(error);
      if (validation?.errors) {
        Object.entries(validation.errors).forEach(([key, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          if (message) setError(key as keyof UnifiedLoginFormValues, { message });
        });
      } else {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Login failed. Please try again."
        );
      }
    },
  });

  const onSubmit = (data: UnifiedLoginFormValues) => mutation.mutate(data);

  return (
    <AuthLayout
      title={is_brand ? "Product Administration" : "Welcome back"}
      description={is_brand ? "Enter your admin credentials to manage the platform" : `Sign in to your ${name} account`}
    >
      <Head title={is_brand ? "Admin Login" : `Login | ${name}`} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[var(--space-4)]">
        <div className="space-y-[var(--space-4)]">
          <Each
            of={UNIFIED_LOGIN_FIELDS}
            render={(field, index) => (
              <ControlledFormComponent<UnifiedLoginFormValues>
                {...field}
                control={control}
                name={field.name as keyof UnifiedLoginFormValues & string}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="remember"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-normal cursor-pointer text-muted-foreground"
            >
              Remember me
            </Label>
          </div>

          {canResetPassword && (
            <TextLink
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Forgot password?
            </TextLink>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-10 sm:h-11"
          isLoading={mutation.isPending}
          loadingText="Signing in..."
          data-test="login-button"
        >
          Sign in
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground mt-[var(--space-3)] sm:mt-[var(--space-4)] space-y-2">
        <div>
          Pending account activation?{" "}
          <TextLink href="/verify-account" className="font-semibold text-primary hover:underline">
            Verify via OTP
          </TextLink>
        </div>
        
        {canRegister && (
          <div>
            Don&apos;t have an account?{" "}
            <TextLink href={register()} className="font-semibold text-primary hover:underline">
              Create an account
            </TextLink>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
