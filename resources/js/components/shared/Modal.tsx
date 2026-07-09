import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer } from "vaul";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";

interface ModalDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  children: React.ReactNode;
  handleSubmit?: (e?: React.FormEvent) => void;
  title: string;
  description?: string;
  className?: string;
  isLoading?: boolean;
  submitLabel?: string;
  onPrimaryClick?: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: React.ReactNode;
  onSecondaryClick?: () => void;
  headerClassName?: string;
  footerClassName?: string;
}

export function ModalDialog({
  open,
  onClose,
  children,
  handleSubmit,
  title,
  description,
  className,
  isLoading,
  submitLabel,
  onPrimaryClick,
  primaryDisabled,
  secondaryLabel,
  onSecondaryClick,
  headerClassName,
  footerClassName,
}: ModalDialogProps) {
  const isMobile = useIsMobile();

  const content = (
    <>
      <div className={cn("p-4 sm:p-6 flex-shrink-0 text-left flex flex-col gap-1.5 bg-card/30", headerClassName)}>
        <h3 className="text-xl font-semibold tracking-tight leading-none">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <Separator className="bg-border/50" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 bg-background/50">
        <div className="relative z-10">
          {children}
        </div>
      </div>

      <Separator className="bg-border/50" />

      <div className={cn("p-4 sm:p-6 flex-shrink-0 flex flex-col sm:flex-row sm:justify-end gap-2 bg-card/30", footerClassName)}>
        <Button
          variant="outline"
          disabled={isLoading}
          size="default"
          onClick={() => onClose(false)}
          className="hover:bg-accent/50"
        >
          Cancel
        </Button>

        {onSecondaryClick && (
          <Button
            variant="ghost"
            onClick={onSecondaryClick}
            disabled={isLoading}
            size="default"
            className="hover:bg-accent/50"
          >
            {secondaryLabel || "Back"}
          </Button>
        )}

        {(handleSubmit || onPrimaryClick) && (
          <Button
            onClick={onPrimaryClick || handleSubmit}
            disabled={isLoading || primaryDisabled}
            size="default"
            className="min-w-[110px] shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            {isLoading ? (submitLabel ? "Loading..." : "Saving...") : (submitLabel || (handleSubmit ? "Save" : ""))}
          </Button>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={onClose}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-[110] flex flex-col rounded-t-3xl bg-background border-t border-border/50 shadow-2xl outline-none max-h-[96%] overflow-hidden">
            <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/30 mb-2" />
            <div className="flex flex-col flex-1 overflow-hidden min-h-0">
              {content}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onPointerDownOutside={(e) => {
          // Radix wraps the native event — the real click target is in detail.originalEvent
          const originalTarget = ((e as any).detail?.originalEvent?.target ?? e.target) as HTMLElement | null;
          if (
            originalTarget?.closest?.('[class*="rs__"]') ||
            originalTarget?.closest?.('[id*="react-select"]')
          ) {
            e.preventDefault();
          }
        }}
        onFocusOutside={(e) => {
          // Prevent dialog dismiss when react-select steals focus
          const originalTarget = ((e as any).detail?.originalEvent?.relatedTarget ?? e.target) as HTMLElement | null;
          if (
            originalTarget?.closest?.('[class*="rs__"]') ||
            originalTarget?.closest?.('[id*="react-select"]')
          ) {
            e.preventDefault();
          }
        }}
        className={cn(
          "sm:max-w-[520px] flex flex-col p-0 max-h-[90vh] gap-0 overflow-hidden shadow-2xl rounded-2xl border-border/50 bg-background",
          className,
        )}
      >
        {content}
      </DialogContent>
    </Dialog>
  );
}
