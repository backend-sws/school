import React from "react";
import { Mail } from "lucide-react";
import R2Api from "@/lib/api/r2Api";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileBannerProps {
  name?: string;
  email?: string;
  photo_url?: string;
  signature_url?: string;
  active_status?: string;
  isLoading?: boolean;
}

const BannerLoader = () => (
  <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
    <div className="flex items-center gap-4 sm:gap-6">
      <Skeleton className="size-14 sm:size-16 shrink-0 rounded-xl" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 sm:h-6 w-36 sm:w-48" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-4 w-48 sm:w-56" />
      </div>
      <Skeleton className="h-8 w-24 shrink-0 rounded-md ml-auto" />
    </div>
  </div>
);

export function ProfileBanner({
  name,
  email,
  photo_url,
  signature_url,
  active_status = "Active",
  isLoading = false,
}: ProfileBannerProps) {
  if (isLoading) return <BannerLoader />;

  const isActive = active_status === "Active";
  const initials =
    name
      ?.split(" ")
      .map((p: string) => p.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Avatar — rounded square */}
        <div className="size-14 sm:size-16 shrink-0 rounded-xl bg-muted overflow-hidden flex items-center justify-center border border-border/50">
          {photo_url ? (
            <img
              src={R2Api.imageSrc(photo_url)}
              alt={name ?? "Student"}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-base sm:text-lg font-bold text-muted-foreground select-none">
              {initials}
            </span>
          )}
        </div>

        {/* Info block */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
              {name ?? "Student"}
            </h1>
            <span
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                  : "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
              }`}
            >
              <span className={`size-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-amber-500"}`} />
              {active_status}
            </span>
          </div>
          {email && (
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5 truncate">
              <Mail size={13} className="shrink-0 opacity-60" />
              <span className="truncate">{email}</span>
            </p>
          )}
        </div>

        {/* Signature — right-aligned */}
        {signature_url && (
          <div className="hidden sm:flex shrink-0 flex-col items-center gap-1">
            <div className="h-10 w-28 rounded-md border border-border/50 bg-muted/30 overflow-hidden flex items-center justify-center">
              <img
                src={R2Api.imageSrc(signature_url)}
                alt="Signature"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-[10px] text-muted-foreground">Signature</span>
          </div>
        )}
      </div>
    </div>
  );
}
