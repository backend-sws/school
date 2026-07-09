// src/pages/student-portal/change-password.tsx
import AuthLayout from "@/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Lock } from "lucide-react";
import { Head } from "@inertiajs/react";
import AuthApi from "@/lib/api/student/AuthApi";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  ChangePasswordInput,
  changePasswordSchema,
} from "@/lib/validations/changePassword";
import { ModalDialog } from "../shared/Modal";
interface ChangePasswordDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export default function ChangePasswordDialog({
  open,
  onClose,
  data,
}: ChangePasswordDialogProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordInput, isSubmitting) =>
      AuthApi.ChangePassword(data),
    onSuccess: (response: any) => {
      if (!response.success) {
        setFormError(response.message || "Password change failed");
        return;
      }

      reset();
      onClose(false);

      setFormError(null);
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        setFormError(error.response.data.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    },
  });

  const onSubmit = (data: ChangePasswordInput) => {
    setFormError(null);
    mutation.mutate(data);
  };

  return (
    <ModalDialog
      title="Change Password"
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      submitLabel="Change Password"
      className="sm:max-w-2xl"
      // disabled={isSubmitting}
    >
      {/* Old Password */}
      <div className="space-y-2">
        <Label htmlFor="old_password">Old Password</Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="h-4 w-4" />
          </div>
          <Input
            id="old_password"
            type="password"
            className="pl-10 h-11"
            placeholder="••••••••"
            {...register("old_password")}
          />
        </div>
        {errors.old_password && (
          <InputError message={errors.old_password.message} />
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2 mt-4">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="h-4 w-4" />
          </div>
          <Input
            id="password"
            type="password"
            className="pl-10 h-11"
            placeholder="••••••••"
            {...register("password")}
          />
        </div>
        {errors.password && <InputError message={errors.password.message} />}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2 mt-4">
        <Label htmlFor="password_confirmation">Confirm New Password</Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="h-4 w-4" />
          </div>
          <Input
            id="password_confirmation"
            type="password"
            className="pl-10 h-11"
            placeholder="••••••••"
            {...register("password_confirmation")}
          />
        </div>
        {errors.password_confirmation && (
          <InputError message={errors.password_confirmation.message} />
        )}
      </div>

      {formError && (
        <div className="my-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive text-center">
          {formError}
        </div>
      )}
    </ModalDialog>
  );
}
