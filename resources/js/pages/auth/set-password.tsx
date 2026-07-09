import { Head, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import AuthLayout from "@/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import Each from "@/components/Each";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { SET_PASSWORD_FIELDS } from "@/constants/auth/setPasswordFormConfig";
import { setPasswordWithToken } from "@/lib/api/authApi";
import { setPasswordSchema, type SetPasswordFormValues } from "@/lib/validations/setPassword";
import { toast } from "sonner";

interface SetPasswordProps {
  token: string;
}

export default function SetPassword({ token }: SetPasswordProps) {
  const {
    control,
    handleSubmit,
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: SetPasswordFormValues) =>
      setPasswordWithToken(token, data.password, data.password_confirmation),
    onSuccess: (res) => {
      const redirect = res?.data?.redirect ?? "/dashboard";
      toast.success(res?.message ?? "Password set successfully.");
      router.visit(redirect);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message ??
          "Failed to set password. The link may have expired."
      );
    },
  });

  const onSubmit = (data: SetPasswordFormValues) => mutation.mutate(data);

  return (
    <AuthLayout
      title="Set your password"
      description="Choose a secure password to access your account."
    >
      <Head title="Set password" />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-4">
          <Each
            of={SET_PASSWORD_FIELDS}
            render={(field) => (
              <ControlledFormComponent<SetPasswordFormValues>
                control={control}
                name={field.name as keyof SetPasswordFormValues & string}
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                tooltip={field.tooltip}
                maxLength={field.maxLength}
              />
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
          isLoading={mutation.isPending}
          loadingText="Setting password..."
        >
          Set password & continue
        </Button>
      </form>
    </AuthLayout>
  );
}
