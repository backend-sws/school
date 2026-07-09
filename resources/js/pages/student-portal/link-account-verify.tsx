import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GuardianApi from "@/lib/api/guardianApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  token?: string | null;
}

const LinkAccountVerifyPage = ({ token }: Props) => {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token?.trim()) {
      setStatus("error");
      setMessage("Invalid link. No verification token provided.");
      return;
    }

    GuardianApi.verifyLinkAccount(token)
      .then(() => {
        setStatus("success");
        toast.success("Account linked. You now have parent access.");
        router.visit("/student-portal/dashboard");
      })
      .catch((err: { response?: { data?: { message?: string } } }) => {
        setStatus("error");
        setMessage(err?.response?.data?.message ?? "This link is invalid or has expired. Request a new verification email from the link-account page.");
      });
  }, [token]);

  return (
    <>
      <Head title="Verify & link parent account" />
      <div className="flex flex-col gap-5 p-4">
        <Card className="max-w-md mx-auto w-full">
          <CardHeader>
            <CardTitle>Link parent account</CardTitle>
          </CardHeader>
          <CardContent>
            {status === "verifying" && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                <span>Verifying your email and linking your account…</span>
              </div>
            )}
            {status === "error" && (
              <p className="text-destructive">{message}</p>
            )}
            {status === "success" && (
              <p className="text-muted-foreground">Redirecting to My Students…</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LinkAccountVerifyPage;
