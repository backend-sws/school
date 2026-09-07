import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  FileText,
  Image as ImageIcon,
  Calendar,
  FileCheck,
  Cloud,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface LeaveDocumentPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  documentUrl?: string | null;
  documentName?: string | null;
  documentTitle?: string | null;
  documentCategory?: string | null;
  leaveType?: string;
  dateRange?: string;
  reason?: string;
  studentName?: string;
}

export function LeaveDocumentPreviewDialog({
  open,
  onClose,
  documentUrl,
  documentName,
  documentTitle,
  documentCategory,
  leaveType,
  dateRange,
  reason,
  studentName,
}: LeaveDocumentPreviewDialogProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!open) return null;

  const isPdf =
    documentUrl?.toLowerCase().endsWith(".pdf") ||
    documentName?.toLowerCase().endsWith(".pdf");

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const displayName =
    documentTitle || documentName || (leaveType ? `${leaveType} Document` : "Scanned Document");

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] max-h-[85vh] flex flex-col p-0 overflow-hidden border-border/80 shadow-2xl rounded-2xl sm:rounded-3xl bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 sm:px-6 py-3 bg-muted/20 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
              {isPdf ? <FileText className="size-5" /> : <ImageIcon className="size-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-base font-bold text-foreground truncate max-w-md">
                  {displayName}
                </DialogTitle>
                {leaveType && (
                  <Badge variant="outline" className="capitalize text-[11px] font-semibold bg-background">
                    {leaveType.replace(/_/g, " ")}
                  </Badge>
                )}
                {documentCategory && (
                  <Badge variant="secondary" className="capitalize text-[10px] font-bold bg-primary/10 text-primary border-primary/20">
                    {documentCategory.replace(/_/g, " ")}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2.5 mt-0.5 flex-wrap">
                {studentName && <span className="font-semibold text-foreground">{studentName}</span>}
                {dateRange && (
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3 text-muted-foreground" />
                    {dateRange}
                  </span>
                )}
                <span className="flex items-center gap-1 text-primary text-[10px] font-medium">
                  <Cloud className="size-3" /> Cloudflare R2
                </span>
              </DialogDescription>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5">
            {!isPdf && documentUrl && (
              <>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="rounded-lg h-8 w-8"
                >
                  <ZoomOut className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="rounded-lg h-8 w-8"
                >
                  <ZoomIn className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={handleRotate}
                  title="Rotate"
                  className="rounded-lg h-8 w-8"
                >
                  <RotateCw className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  className="text-xs font-medium h-8 px-2.5"
                >
                  Reset
                </Button>
              </>
            )}

            {documentUrl && (
              <a
                href={documentUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center"
              >
                <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8 rounded-xl font-bold bg-background shadow-xs">
                  <Download className="size-3.5" />
                  Download
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Reason Banner if present */}
        {reason && (
          <div className="px-6 py-2.5 bg-muted/40 border-b border-border/40 text-xs text-muted-foreground flex items-center gap-2">
            <span className="font-semibold text-foreground shrink-0">Document Description / Notes:</span>
            <span className="truncate italic">"{reason}"</span>
          </div>
        )}

        {/* Document Viewer Body */}
        <div className="flex-1 bg-neutral-950/5 dark:bg-neutral-950/40 overflow-auto flex items-center justify-center p-4 relative">
          {!documentUrl ? (
            <div className="flex flex-col items-center gap-3 text-muted-foreground p-8 text-center">
              <FileCheck className="size-12 opacity-30" />
              <p className="text-sm font-semibold text-foreground">No Physical File Attached</p>
              <p className="text-xs text-muted-foreground">This entry was recorded as a ledger note without an uploaded scan.</p>
            </div>
          ) : isPdf ? (
            <iframe
              src={`${documentUrl}#toolbar=1`}
              className="w-full h-full rounded-2xl border border-border/40 bg-white shadow-md"
              title="PDF Document Preview"
            />
          ) : (
            <div className="relative max-w-full max-h-full flex items-center justify-center overflow-hidden">
              <img
                src={documentUrl}
                alt={displayName}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.2s ease-in-out",
                }}
                className="max-h-[70vh] max-w-[80vw] object-contain rounded-xl shadow-lg border border-border/50 bg-background select-none"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
