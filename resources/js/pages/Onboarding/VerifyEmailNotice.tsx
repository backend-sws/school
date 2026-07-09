import { Button } from "@/components/ui/button";
import OnboardingLayout from "@/layouts/onboarding-layout";
import {
  VERIFY_INSTRUCTIONS,
  ONBOARDING_CONTENT,
} from "@/constants/onboarding/onboardingSteps";
import { Head, router, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Mail, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import Each from "@/components/Each";

interface Props {
  email: string;
  redirectUrl: string;
}

export default function VerifyEmailNotice({ email, redirectUrl }: Props) {
  const { name: appName } = usePage<SharedData>().props;
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  // Auto-poll: check every 5s if email is verified
  const { data } = useQuery({
    queryKey: ["onboarding-verification", email],
    queryFn: async () => {
      const res = await fetch(
        `/onboarding/check-verification?email=${encodeURIComponent(email)}`,
      );
      return res.json();
    },
    enabled: !!email,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });

  // Redirect when verified — destination controlled by backend
  useEffect(() => {
    if (data?.verified) {
      router.visit(redirectUrl);
    }
  }, [data?.verified, redirectUrl]);

  const handleResend = () => {
    setResending(true);
    router.post(
      "/onboarding/resend-verification",
      { email },
      {
        onFinish: () => {
          setResending(false);
          setResent(true);
          setTimeout(() => setResent(false), 5000);
        },
      },
    );
  };

  const content = ONBOARDING_CONTENT.verify;

  return (
    <OnboardingLayout
      currentStep={2}
      title={content.title}
      description={
        <>
          We've sent a verification link to{" "}
          <span className="font-semibold text-foreground">{email}</span>.
          {" "}Click the link to verify and continue.
        </>
      }
    >
      <Head title={`Verify Your Email — ${appName}`} />

      <div className="space-y-6 text-center">
        {/* Animated mail icon */}
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
          <Mail className="w-9 h-9 text-primary" />
        </div>

        {/* Instructions — config-driven */}
        <div className="bg-muted/50 rounded-xl p-5 space-y-3 text-left border border-border/40">
          <Each
            of={[...VERIFY_INSTRUCTIONS]}
            keyExtractor={(i) => i.key}
            render={(instruction, index) => (
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px] font-black text-primary">
                    {index + 1}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {instruction.text.replace("{appName}", appName)}
                </p>
              </div>
            )}
          />
        </div>

        {/* Resend */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleResend}
            buttonState={resending ? "loading" : resent ? "success" : "idle"}
            loadingText="Sending..."
            successText="Email Resent ✓"
            successDuration={5000}
            className="h-11 px-8 text-xs font-bold uppercase tracking-widest border-primary/20 hover:bg-primary/5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 active:scale-[0.97] transition-all duration-200"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Resend Verification Email
          </Button>

          <p className="text-[11px] text-muted-foreground">
            Didn't receive it? Check your spam folder or click resend above.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}
