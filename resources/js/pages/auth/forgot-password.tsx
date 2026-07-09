import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import AuthLayout from "@/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import TextLink from "@/components/text-link";
import { requestOtpLogin, verifyOtpAndSetPassword, verifyOtp } from "@/lib/api/authApi";
import { ControlledFormComponent } from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { VERIFY_ACCOUNT_REQUEST_FIELDS, VERIFY_ACCOUNT_SUBMIT_FIELDS } from "@/constants/auth/verifyAccountFormConfig";
import { login } from "@/routes";

const INDIAN_MOBILE_REGEX = /^(?:\+?91)?[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requestOtpSchema = z.object({
  login_id: z
    .string()
    .min(1, "Email or mobile number is required")
    .superRefine((val, ctx) => {
      const trimmed = val.trim();
      const isEmail = EMAIL_REGEX.test(trimmed);
      const digitsOnly = trimmed.replace(/[\s\-+]/g, "");
      const isMobile = INDIAN_MOBILE_REGEX.test(trimmed) || /^[6-9]\d{9}$/.test(digitsOnly);

      if (!isEmail && !isMobile) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid email (e.g. name@example.com) or 10-digit mobile number (e.g. 9939826940)",
        });
      }
    }),
});

const resetPasswordSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

export default function ForgotPassword() {
  const [loginId, setLoginId] = useState<string>("");
  const [timer, setTimer] = useState(0);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const {
    control: controlRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors },
    setError: setErrorRequest,
  } = useForm({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { login_id: "" },
  });

  const {
    control: verifyControl,
    handleSubmit: handleSubmitVerify,
    formState: { errors: verifyErrors },
    setError: setErrorVerify,
    trigger: triggerVerify,
    getValues: getVerifyValues,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", password: "", password_confirmation: "" },
  });

  const requestMutation = useMutation({
    mutationFn: (data: { login_id: string }) => requestOtpLogin(data.login_id),
    onSuccess: (_, variables) => {
      setLoginId(variables.login_id);
      setStep(2);
      setTimer(60);
      toast.success("OTP sent to your registered mobile/email.");
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        Object.entries(error.response.data.errors || {}).forEach(
          ([field, messages]) => {
            setErrorRequest(field as "login_id", {
              type: "server",
              message: (messages as string[])[0],
            });
          }
        );
      } else {
        toast.error(error.response?.data?.message || "Failed to send OTP");
      }
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: { login_id: string; otp: string }) => verifyOtp(data.login_id, data.otp),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid OTP");
    },
  });

  const resetMutation = useMutation({
    mutationFn: (data: z.infer<typeof resetPasswordSchema>) =>
      verifyOtpAndSetPassword(
        loginId,
        data.otp,
        data.password,
        data.password_confirmation
      ),
    onSuccess: (data: any) => {
      toast.success("Password reset successfully! Logging you in...");
      if (data?.data?.redirect) {
        window.location.href = data.data.redirect;
      } else {
        window.location.href = "/dashboard";
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        Object.entries(error.response.data.errors || {}).forEach(
          ([field, messages]) => {
            setErrorVerify(field as any, {
              type: "server",
              message: (messages as string[])[0],
            });
          }
        );
        if (error.response.data.errors?.otp) {
          setStep(2);
        }
      } else {
        toast.error(error.response?.data?.message || "Password reset failed");
      }
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRequestSubmit = (data: z.infer<typeof requestOtpSchema>) => {
    requestMutation.mutate(data);
  };

  const handleResetSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
    resetMutation.mutate(data);
  };

  const handleResend = () => {
    if (loginId) {
      requestMutation.mutate({ login_id: loginId });
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      description={
        step === 1 ? "Enter your email or mobile to receive a verification code." :
        step === 2 ? "Enter the OTP we sent to verify your identity." :
        "Set a new password for your account."
      }
    >
      <Head title="Forgot Password" />

      {step === 1 && (
        <form onSubmit={handleSubmitRequest(handleRequestSubmit)} className="space-y-[var(--space-4)]">
          <div className="space-y-[var(--space-2)]">
             <Each
               of={VERIFY_ACCOUNT_REQUEST_FIELDS}
               render={(field) => (
                 <ControlledFormComponent
                   {...field}
                   control={controlRequest}
                   name={field.name as "login_id"}
                 />
               )}
             />
          </div>
          <Button
            type="submit"
            className="w-full h-10 sm:h-11"
            isLoading={requestMutation.isPending}
            loadingText="Sending OTP..."
          >
            Send OTP
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-[var(--space-3)]">
            Remember your password?{" "}
            <TextLink href={login()} className="font-semibold text-primary hover:underline">
              Back to login
            </TextLink>
          </div>
        </form>
      )}

      {step === 2 && (
        <form className="space-y-[var(--space-4)]">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Enter the 6-digit OTP sent to
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-base font-semibold text-foreground">{loginId}</span>
              <button type="button" onClick={() => setStep(1)} className="text-xs font-semibold text-primary hover:underline">
                (Change)
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex justify-center w-full">
              <Controller
                name="otp"
                control={verifyControl}
                render={({ field }) => (
                  <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </div>
            {verifyErrors.otp && (
              <p className="text-sm font-medium text-destructive text-center mt-1">
                {verifyErrors.otp.message}
              </p>
            )}
          </div>

          <Button
            type="button"
            className="w-full h-10 sm:h-11 mt-6"
            disabled={requestMutation.isPending}
            onClick={async () => {
              const otpValid = await triggerVerify("otp");
              const otpVal = getVerifyValues("otp");
              if (otpValid && otpVal && otpVal.length === 6) {
                try {
                  await verifyOtpMutation.mutateAsync({ login_id: loginId, otp: otpVal });
                  setStep(3);
                } catch (err: any) {
                }
              } else {
                setErrorVerify('otp', { type: 'manual', message: 'Please enter a 6-digit OTP' });
              }
            }}
            isLoading={verifyOtpMutation.isPending}
            loadingText="Verifying..."
          >
            Verify OTP
          </Button>

          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">Didn't receive the code? </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0 || requestMutation.isPending}
              className="font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
            >
              {requestMutation.isPending ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Resending...
                </>
              ) : timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmitVerify(handleResetSubmit)} className="space-y-[var(--space-4)]">
          <Each
            of={VERIFY_ACCOUNT_SUBMIT_FIELDS}
            render={(field) => (
              <ControlledFormComponent
                {...field}
                control={verifyControl}
                name={field.name as "password" | "password_confirmation"}
              />
            )}
          />

          <Button
            type="submit"
            className="w-full h-10 sm:h-11"
            isLoading={resetMutation.isPending}
            loadingText="Resetting..."
          >
            Reset Password & Login
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
