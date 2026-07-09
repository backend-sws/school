import { Button } from "@/components/ui/button";
import OnboardingLayout from "@/layouts/onboarding-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Loader2,
  Upload,
  Wand2,
} from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import Each from "@/components/Each";
import {
  getCategoriesForInstitution,
  type DataImportCategory,
} from "@/constants/onboarding/dataImportConfig";

type CategoryStatus = "idle" | "seeding" | "uploading" | "done" | "error";

interface Props {
  instType: string;
  institutionName: string;
}

export default function DataImport({ instType, institutionName }: Props) {
  const { name: appName } = usePage<SharedData>().props;
  const categories = getCategoriesForInstitution(instType);

  const [statuses, setStatuses] = useState<Record<string, CategoryStatus>>(
    () => Object.fromEntries(categories.map((c) => [c.key, "idle"])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const setStatus = useCallback(
    (key: string, status: CategoryStatus, error?: string) => {
      setStatuses((prev) => ({ ...prev, [key]: status }));
      if (error) {
        setErrors((prev) => ({ ...prev, [key]: error }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    },
    [],
  );

  const handleAutoSeed = useCallback(
    async (category: DataImportCategory) => {
      if (!category.autoSeedEndpoint) return;
      setStatus(category.key, "seeding");

      try {
        const res = await fetch(category.autoSeedEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": decodeURIComponent(
              document.cookie
                .split("; ")
                .find((c) => c.startsWith("XSRF-TOKEN="))
                ?.split("=")[1] ?? "",
            ),
          },
          credentials: "same-origin",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to seed data");
        }

        setStatus(category.key, "done");
      } catch (err: any) {
        setStatus(category.key, "error", err.message || "Seeding failed");
      }
    },
    [setStatus],
  );

  const handleFileUpload = useCallback(
    async (category: DataImportCategory, file: File) => {
      if (!category.uploadEndpoint) return;
      setStatus(category.key, "uploading");

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(category.uploadEndpoint, {
          method: "POST",
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(
              document.cookie
                .split("; ")
                .find((c) => c.startsWith("XSRF-TOKEN="))
                ?.split("=")[1] ?? "",
            ),
          },
          credentials: "same-origin",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Upload failed");
        }

        setStatus(category.key, "done");
      } catch (err: any) {
        setStatus(category.key, "error", err.message || "Upload failed");
      }
    },
    [setStatus],
  );

  const handleContinue = () => {
    router.visit("/onboarding/platform-setup");
  };

  const allDone = categories.every((c) => statuses[c.key] === "done");
  const anyProcessing = categories.some(
    (c) => statuses[c.key] === "seeding" || statuses[c.key] === "uploading",
  );

  return (
    <OnboardingLayout
      currentStep={6}
      title="Setup Your Data"
      description={`Configure initial data for ${institutionName}. Auto-seed defaults or upload your own.`}
      wide
    >
      <Head title={`Data Import — ${appName}`} />

      {/* Auto-seed all */}
      <div className="flex items-center justify-between mb-6 p-4 bg-primary/[0.03] rounded-xl border border-primary/10">
        <div>
          <p className="text-sm font-bold text-foreground">
            Quick Setup
          </p>
          <p className="text-xs text-muted-foreground">
            Auto-seed all default data for your {instType} in one click.
          </p>
        </div>
        <Button
          onClick={() => categories.forEach((c) => c.canAutoSeed && handleAutoSeed(c))}
          disabled={anyProcessing || allDone}
          className="text-xs font-bold shrink-0"
          size="sm"
        >
          <Wand2 className="w-3.5 h-3.5 mr-2" />
          {allDone ? "All Done" : "Seed All Defaults"}
        </Button>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Each
          of={categories}
          keyExtractor={(c) => c.key}
          render={(category) => {
            const status = statuses[category.key];
            const error = errors[category.key];
            const isProcessing =
              status === "seeding" || status === "uploading";

            return (
              <div
                className={cn(
                  "p-4 rounded-xl border transition-all",
                  status === "done"
                    ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"
                    : status === "error"
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-border/60 bg-card hover:border-primary/20",
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      status === "done"
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "bg-primary/10",
                    )}
                  >
                    {status === "done" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isProcessing ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">
                      {category.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-destructive mb-2">{error}</p>
                )}

                {status !== "done" && (
                  <div className="flex items-center gap-2">
                    {category.canAutoSeed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAutoSeed(category)}
                        disabled={isProcessing}
                        className="text-[10px] font-bold h-7 flex-1"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        {status === "seeding" ? "Seeding..." : "Auto Seed"}
                      </Button>
                    )}
                    {category.canUpload && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            fileInputRefs.current[category.key]?.click()
                          }
                          disabled={isProcessing}
                          className="text-[10px] font-bold h-7 flex-1"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          {status === "uploading" ? "Uploading..." : "Upload CSV"}
                        </Button>
                        <input
                          ref={(el) => {
                            fileInputRefs.current[category.key] = el;
                          }}
                          type="file"
                          accept=".csv,.xlsx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(category, file);
                          }}
                        />
                      </>
                    )}
                    {category.templateUrl && (
                      <a
                        href={category.templateUrl}
                        download
                        className="text-[10px] text-primary hover:underline shrink-0 ml-1"
                        title="Download CSV template"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Continue */}
      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={anyProcessing}
          className="h-11 px-8 font-bold shadow-xl shadow-primary/20 group"
        >
          {allDone ? "Launch Your Platform" : "Skip & Continue"}
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </OnboardingLayout>
  );
}
