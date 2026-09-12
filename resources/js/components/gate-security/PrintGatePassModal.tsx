import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, X, ShieldCheck, Clock, User, Phone, Car, CheckCircle2 } from "lucide-react";
import { format, parseISO } from "date-fns";

export interface PrintGatePassModalProps {
  open: boolean;
  onClose: () => void;
  pass: any | null;
}

export function PrintGatePassModal({ open, onClose, pass }: PrintGatePassModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!pass) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedEntry = pass.entry_time
    ? format(parseISO(pass.entry_time), "dd MMM yyyy, hh:mm a")
    : "-";
  const formattedExit = pass.exit_time
    ? format(parseISO(pass.exit_time), "dd MMM yyyy, hh:mm a")
    : "Still Inside Campus";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden border-border/80 shadow-2xl">
        <DialogHeader className="p-4 bg-muted/40 border-b flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Printer className="w-4 h-4 text-primary" />
            Print Visitor Gate Pass Slip
          </DialogTitle>
        </DialogHeader>

        {/* Printable Area */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 flex justify-center">
          <div
            ref={printRef}
            id="printable-gate-pass"
            className="w-full max-w-[500px] bg-white text-slate-900 border-2 border-dashed border-slate-400 p-6 rounded-xl shadow-md space-y-4 print:border-solid print:shadow-none print:m-0 print:w-full print:max-w-none"
          >
            {/* Slip Header */}
            <div className="text-center border-b-2 border-slate-800 pb-3">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-6 h-6 text-slate-800" />
                <h2 className="text-xl font-black uppercase tracking-wider text-slate-900">
                  VISITOR GATE PASS
                </h2>
              </div>
              <p className="text-[11px] text-slate-600 uppercase tracking-widest mt-0.5 font-medium">
                Campus Security & Safety Register
              </p>
            </div>

            {/* Pass Number & Status */}
            <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Pass Number
                </span>
                <span className="font-mono text-base font-black text-slate-900 tracking-wider">
                  {pass.pass_number}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Status
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${
                    pass.is_inside || pass.status === "inside" || pass.status === "inside_campus"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-200 text-slate-800"
                  }`}
                >
                  {pass.is_inside || pass.status === "inside" || pass.status === "inside_campus"
                    ? "ACTIVE / INSIDE"
                    : "CHECKED OUT"}
                </span>
              </div>
            </div>

            {/* Visitor Details & Photo */}
            <div className="flex gap-4 items-start">
              {pass.photo_url ? (
                <div className="w-24 h-28 shrink-0 rounded-lg overflow-hidden border-2 border-slate-300 bg-slate-100 shadow-sm relative">
                  <img
                    src={pass.photo_url}
                    alt={pass.visitor_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-28 shrink-0 rounded-lg border-2 border-slate-300 bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                  <User className="w-8 h-8 mb-1" />
                  <span className="text-[9px] font-bold">NO PHOTO</span>
                </div>
              )}

              <div className="flex-1 space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Visitor Name</span>
                  <p className="text-sm font-bold text-slate-900">{pass.visitor_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Mobile</span>
                    <p className="font-semibold text-slate-800">{pass.phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Category</span>
                    <p className="font-semibold capitalize text-slate-800">{pass.visitor_type}</p>
                  </div>
                </div>
                {pass.id_proof_type && (
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">ID Proof</span>
                    <p className="font-mono text-[11px] text-slate-800">
                      <span className="uppercase">{pass.id_proof_type.replace("_", " ")}</span>:{" "}
                      {pass.id_proof_number || "Verified"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Meeting Details */}
            <div className="border-t border-slate-200 pt-2.5 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Whom To Meet
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {pass.staff?.name ||
                      pass.student_name ||
                      "School Administration"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Accompanying
                  </span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {pass.accompanying_count > 0
                      ? `+${pass.accompanying_count} Person(s)`
                      : "Coming Alone (0)"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Purpose</span>
                <p className="font-medium text-slate-800 mt-0.5">{pass.purpose}</p>
              </div>

              {/* Gate & Vehicle */}
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Gate</span>
                  <span className="font-semibold text-slate-800">{pass.gate_name || "Main Gate"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Vehicle</span>
                  <span className="font-semibold capitalize text-slate-800">
                    {pass.vehicle_type && pass.vehicle_type !== "none"
                      ? pass.vehicle_type
                      : "Walk-in"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Reg. No</span>
                  <span className="font-mono font-bold text-slate-900">
                    {pass.vehicle_number || "N/A"}
                  </span>
                </div>
              </div>

              {pass.belongings_declared && (
                <div className="text-[11px] bg-amber-50 p-2 rounded border border-amber-200 text-amber-900">
                  <span className="font-bold uppercase text-[10px] block">Items Declared:</span>
                  {pass.belongings_declared}
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Entry Time</span>
                  <span className="font-bold text-slate-900">{formattedEntry}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Exit Time</span>
                  <span className="font-bold text-slate-900">{formattedExit}</span>
                </div>
              </div>
            </div>

            {/* Signature Blocks */}
            <div className="pt-4 border-t-2 border-slate-300 grid grid-cols-3 gap-2 text-center">
              <div className="space-y-4">
                <div className="h-7" />
                <div className="border-t border-slate-400 pt-1">
                  <span className="text-[9px] uppercase font-bold text-slate-600 block">
                    Security Guard
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-7" />
                <div className="border-t border-slate-400 pt-1">
                  <span className="text-[9px] uppercase font-bold text-slate-600 block">
                    Visitor Signature
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-7" />
                <div className="border-t border-slate-400 pt-1">
                  <span className="text-[9px] uppercase font-bold text-slate-600 block">
                    Host Signature
                  </span>
                </div>
              </div>
            </div>

            {/* Slip Footer note */}
            <div className="text-center pt-2 text-[9px] text-slate-500 border-t border-slate-200">
              * Please carry this slip inside campus and submit to security guard while exiting *
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 bg-muted/30 border-t flex items-center justify-between sm:justify-between">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handlePrint}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Print Badge Slip
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Embedded print stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-gate-pass, #printable-gate-pass * {
            visibility: visible;
          }
          #printable-gate-pass {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 480px !important;
            margin: auto !important;
            border: 2px solid #000 !important;
          }
        }
      `}</style>
    </Dialog>
  );
}

export default PrintGatePassModal;
