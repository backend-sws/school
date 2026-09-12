import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import gateSecurityApi from "@/lib/api/gateSecurityApi";
import {
  LogOut,
  Clock,
  Car,
  User,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building,
} from "lucide-react";
import { format, differenceInMinutes, parseISO } from "date-fns";

export interface GatePassExitDialogProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  pass: any | null;
}

export function GatePassExitDialog({ open, onClose, pass }: GatePassExitDialogProps) {
  const [exitRemarks, setExitRemarks] = useState("Left Campus");
  const [submitting, setSubmitting] = useState(false);

  if (!pass) return null;

  // Calculate duration
  let durationStr = "N/A";
  let isOverstay = false;
  try {
    const entryDate = pass.entry_time ? parseISO(pass.entry_time) : new Date();
    const diffMins = differenceInMinutes(new Date(), entryDate);
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    durationStr = hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`;
    isOverstay = diffMins > 180; // 3 hours
  } catch (e) {
    durationStr = "N/A";
  }

  const handleConfirmExit = async () => {
    try {
      setSubmitting(true);
      await gateSecurityApi.passes.checkout(pass.id, {
        exit_remarks: exitRemarks.trim() || "Left Campus",
      });
      toast.success(`Visitor ${pass.visitor_name} checked out successfully`);
      onClose(true);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to record exit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose(false)}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border/80 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white">
                Record Visitor Exit
              </DialogTitle>
              <DialogDescription className="text-amber-100 text-xs">
                Confirm departure of visitor from school premises.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Overstay Warning Banner */}
          {isOverstay && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2.5 text-xs text-red-800 dark:text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>
                <strong>Overstay Notice:</strong> Visitor has spent more than 3 hours inside campus ({durationStr}).
              </span>
            </div>
          )}

          {/* Visitor Card Summary */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {pass.photo_url ? (
                  <img
                    src={pass.photo_url}
                    alt={pass.visitor_name}
                    className="w-12 h-12 rounded-full object-cover border border-border shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-border">
                    {pass.visitor_name?.charAt(0) || "V"}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {pass.visitor_name}
                  </h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <span>{pass.phone}</span>
                    <span>•</span>
                    <span className="capitalize">{pass.visitor_type}</span>
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {pass.pass_number}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px] block">Entry Time</span>
                <span className="font-medium text-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  {pass.entry_time ? format(parseISO(pass.entry_time), "hh:mm a, dd MMM") : "-"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Stay Duration</span>
                <span
                  className={`font-semibold mt-0.5 flex items-center gap-1 ${
                    isOverstay ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {durationStr}
                </span>
              </div>
            </div>

            {(pass.vehicle_number || pass.gate_name) && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                {pass.vehicle_number && (
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Vehicle</span>
                    <span className="font-mono font-medium text-foreground flex items-center gap-1 mt-0.5">
                      <Car className="w-3 h-3 text-muted-foreground" />
                      {pass.vehicle_number}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground text-[11px] block">Entry Gate</span>
                  <span className="font-medium text-foreground flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3 text-muted-foreground" />
                    {pass.gate_name || "Main Gate"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Exit Remarks */}
          <div>
            <Label className="text-xs font-semibold">Exit Remarks / Security Observation</Label>
            <Input
              value={exitRemarks}
              onChange={(e) => setExitRemarks(e.target.value)}
              placeholder="e.g. Left campus, Material delivered, Returning tomorrow"
              className="mt-1 text-xs"
            />
          </div>
        </div>

        <DialogFooter className="p-4 bg-muted/20 border-t border-border flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onClose(false)}
            disabled={submitting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirmExit}
            disabled={submitting}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            {submitting ? "Checking out..." : "Confirm Exit (Clock Out)"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GatePassExitDialog;
