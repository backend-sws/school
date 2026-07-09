import React from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepNavFooterProps {
  onBack?: () => void;
  onPrimary: () => void;
  primaryLabel: string;
  primaryLoading?: boolean;
  cancelHref?: string;
}

export function StepNavFooter({
  onBack,
  onPrimary,
  primaryLabel,
  primaryLoading = false,
  cancelHref,
}: StepNavFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
      {cancelHref ? (
        <Link href={cancelHref}>
          <Button variant="outline" className="rounded-none">Cancel</Button>
        </Link>
      ) : null}
      {onBack ? (
        <Button type="button" variant="outline" onClick={onBack} className="gap-2 rounded-none">
          <ChevronLeft className="size-4" />
          Back
        </Button>
      ) : null}
      <Button
        type="button"
        onClick={onPrimary}
        disabled={primaryLoading}
        className="gap-2 rounded-none"
      >
        {primaryLabel}
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
