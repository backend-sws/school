import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import GuardianApi, { type GuardianStudent, type SameEmailAccount } from "@/lib/api/guardianApi";
import R2Api from "@/lib/api/r2Api";
import { Users, Loader2, UserPlus, Link2 } from "lucide-react";
import { Link } from "@inertiajs/react";
import { toast } from "sonner";
import type { SharedData } from "@/types";
import { useAuth } from "@/hooks/use-can";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import { cn } from "@/lib/utils";

interface SwitchAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SwitchAccountModal({ open, onOpenChange }: SwitchAccountModalProps) {
  const queryClient = useQueryClient();
  const { auth, can } = useAuth();
  const hasMultipleSameEmail = !!auth?.has_multiple_users_same_email;
  const hasLinkedStudents = can("view_my_students");
  // Current context: effective user when parent has switched (e.g. Deepa), else logged-in user — use id for "Current" label
  const currentContextUserId = auth?.effective_user?.id ?? auth?.user?.id;
  const getInitials = useInitials();

  const { data: meData } = useQuery({
    queryKey: ["guardian-me"],
    queryFn: () => GuardianApi.me(),
    enabled: open,
  });

  const { data: sameEmailData, isLoading: sameEmailLoading } = useQuery({
    queryKey: ["guardian-same-email-accounts"],
    queryFn: async () => {
      const res = await GuardianApi.sameEmailAccounts();
      const raw = res as { data?: { accounts?: SameEmailAccount[] }; success?: boolean };
      return raw?.data?.accounts ?? [];
    },
    enabled: open,
  });

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["guardian-my-students"],
    queryFn: async () => {
      const res = await GuardianApi.myStudents();
      const raw = res as { data?: { students?: GuardianStudent[] }; success?: boolean };
      return raw?.data?.students ?? [];
    },
    enabled: open && hasLinkedStudents,
  });

  const setActiveMutation = useMutation({
    mutationFn: (userId: number) => GuardianApi.setActiveStudent(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guardian-me"] });
      toast.success("Switched account. Dashboard will show this student's data.");
      onOpenChange(false);
      router.reload();
      setTimeout(() => router.reload(), 400);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Could not switch account.");
    },
  });

  const linkAccountMutation = useMutation({
    mutationFn: (email: string) => GuardianApi.linkAccount({ email }),
    onSuccess: (_, email) => {
      toast.success(`Verification email sent to ${email}. Click the link in the email to link this account, then you can switch.`);
      queryClient.invalidateQueries({ queryKey: ["guardian-same-email-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["guardian-me"] });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Could not send verification email.");
    },
  });

  const accounts: SameEmailAccount[] = sameEmailData ?? [];
  const students: GuardianStudent[] = studentsData ?? [];
  const activeStudentId = meData?.data?.active_student_id ?? null;
  const showSameEmailList = accounts.length > 0;
  const isLoading = (sameEmailLoading && accounts.length === 0) || (!showSameEmailList && hasLinkedStudents && studentsLoading);
  const pending = setActiveMutation.isPending || linkAccountMutation.isPending;

  const handleSelectStudent = (userId: number) => {
    if (userId === activeStudentId) {
      onOpenChange(false);
      return;
    }
    setActiveMutation.mutate(userId);
  };

  const handleLinkAccount = (email: string) => {
    if (!email) return;
    linkAccountMutation.mutate(email);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Switch account
          </DialogTitle>
          <DialogDescription>
            {showSameEmailList
              ? "All accounts with this email. Link an account to switch to it; then use the verification email to complete."
              : "Select an account. The dashboard and all data will update for the selected user."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 max-h-[60vh] overflow-y-auto space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : showSameEmailList ? (
            accounts.map((acc) => {
              const isCurrent = acc.id === currentContextUserId;
              const isLoggedInUser = acc.id === auth?.user?.id;
              const canSwitchTo = isLoggedInUser || acc.is_linked;
              return (
                <div
                  key={acc.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${isCurrent ? "border-primary bg-primary/10" : "border-border"
                    }`}
                >
                  <Avatar className="size-9 shrink-0 rounded-md">
                    <AvatarImage src={R2Api.imageSrc(acc.avatar_url ?? "")} alt={acc.name} />
                    <AvatarFallback className="rounded-md bg-muted text-sm font-medium">
                      {getInitials(acc.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{acc.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{acc.email ?? "—"}</p>
                  </div>
                  {isCurrent ? (
                    <span className="shrink-0 text-xs font-medium text-primary">Current</span>
                  ) : canSwitchTo ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      onClick={() => handleSelectStudent(acc.id)}
                    >
                      Switch
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      disabled={pending}
                      onClick={() => handleLinkAccount(acc.email ?? auth?.user?.email ?? "")}
                      title="Send verification email to link this account"
                    >
                      <Link2 className="size-4" />
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            students.map((s) => (
              <Button
                key={s.id}
                type="button"
                variant="ghost"
                onClick={() => handleSelectStudent(s.id)}
                disabled={pending}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/80 disabled:opacity-50 h-auto",
                  activeStudentId === s.id ? "border-primary bg-primary/10" : "border-border"
                )}
              >
                <Avatar className="size-9 shrink-0 rounded-md">
                  <AvatarImage src={R2Api.imageSrc(s.avatar_url ?? "")} alt={s.name} />
                  <AvatarFallback className="rounded-md bg-muted text-sm font-medium">
                    {getInitials(s.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[s.reg_no, s.stream, s.session].filter(Boolean).join(" · ") || s.email || s.mobile || "—"}
                  </p>
                </div>
                {activeStudentId === s.id && (
                  <span className="shrink-0 text-xs font-medium text-primary">Current</span>
                )}
              </Button>
            ))
          )}
          {!isLoading && !showSameEmailList && students.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">No linked students. Link your account from the page below.</p>
          )}
          <div className="mt-3 pt-3 border-t">
            <Link
              href="/student-portal/dashboard"
              className="flex w-full items-center gap-3 rounded-lg border border-dashed border-muted-foreground/40 p-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              onClick={() => onOpenChange(false)}
            >
              <UserPlus className="size-4 shrink-0" />
              Go to dashboard
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
