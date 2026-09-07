import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import attendanceApi, { type AttendanceLevel } from "@/lib/api/attendanceApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AttendanceImportDialogProps {
    open: boolean;
    onClose: () => void;
    classId?: number;
    className?: string;
    month: string;
    allocationId?: number;
    onSuccess?: () => void;
}

export function AttendanceImportDialog({
    open,
    onClose,
    classId,
    className,
    month,
    allocationId,
    onSuccess
}: AttendanceImportDialogProps) {
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
    const [importResult, setImportResult] = useState<{
        imported_count: number;
        skipped_count: number;
        errors: string[];
        total_errors: number;
    } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setImportResult(null);
        }
    };

    const handleDownloadTemplate = async () => {
        if (!classId) {
            toast.error("Please select a class first");
            return;
        }

        try {
            setIsDownloadingTemplate(true);
            const res = await attendanceApi.downloadTemplate({
                lms_class_id: classId,
                month,
                level: allocationId ? "subject" : "class",
                class_subject_allocation_id: allocationId || undefined,
            });

            const blob = new Blob([res.data as any], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `attendance_template_${className || "class"}_${month}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Template downloaded successfully!");
        } catch (e) {
            toast.error("Failed to download attendance template");
        } finally {
            setIsDownloadingTemplate(false);
        }
    };

    const { mutate: runImport, isPending: isImporting } = useMutation({
        mutationFn: async () => {
            if (!classId) throw new Error("No class selected");
            if (!selectedFile) throw new Error("No file selected");

            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("lms_class_id", classId.toString());
            formData.append("month", month);
            if (allocationId) {
                formData.append("class_subject_allocation_id", allocationId.toString());
            }

            const res = await attendanceApi.import(formData);
            return (res as any)?.data?.data || (res as any)?.data || res;
        },
        onSuccess: (data) => {
            setImportResult(data);
            queryClient.invalidateQueries({ queryKey: ["attendance-ledger"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-daily"] });
            toast.success(`Successfully imported ${data.imported_count || 0} attendance marks!`);
            onSuccess?.();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to import attendance file");
        }
    });

    const handleClose = () => {
        setSelectedFile(null);
        setImportResult(null);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-xl rounded-3xl p-6 md:p-8 bg-card border border-border shadow-2xl">
                <DialogHeader className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                            <FileSpreadsheet className="size-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                                Bulk Import Class Attendance
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Upload a monthly attendance calendar register spreadsheet for <span className="font-semibold text-foreground">{className || "Selected Class"}</span> ({month}).
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Step 1: Download Template */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-3">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-foreground">Step 1: Download Pre-Filled Template</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Get the official school register template with all enrolled students and calendar days pre-configured.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleDownloadTemplate}
                                disabled={isDownloadingTemplate || !classId}
                                className="shrink-0 h-9 rounded-xl font-semibold gap-1.5 border-primary/20 hover:bg-primary/10 hover:text-primary"
                            >
                                {isDownloadingTemplate ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Download className="size-4" />
                                )}
                                Download Template
                            </Button>
                        </div>
                        <div className="text-[11px] text-muted-foreground/80 bg-background/60 p-2.5 rounded-xl border border-border/40">
                            <span className="font-bold text-foreground">Codes to use:</span> <span className="text-emerald-600 font-bold">P</span> (Present), <span className="text-red-600 font-bold">A</span> (Absent), <span className="text-amber-600 font-bold">LT</span> (Late), <span className="text-blue-600 font-bold">L</span> (Leave), <span className="text-purple-600 font-bold">H</span> (Holiday), <span className="text-slate-500 font-bold">-</span> (Skip/Off).
                        </div>
                    </div>

                    {/* Step 2: Upload File */}
                    <div className="space-y-3">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Step 2: Upload Completed Excel / CSV Sheet
                        </Label>
                        <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors bg-muted/10 relative">
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isImporting}
                            />
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Upload className="size-6" />
                                </div>
                                {selectedFile ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-foreground">{selectedFile.name}</p>
                                        <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Click to browse or drag & drop</p>
                                        <p className="text-xs text-muted-foreground">Accepts .xlsx, .xls, or .csv up to 10MB</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Import Results Box */}
                    {importResult && (
                        <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                                <span className="text-sm font-bold text-foreground">Import Complete</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700">
                                    <span className="font-bold text-lg block">{importResult.imported_count}</span>
                                    Attendance marks saved
                                </div>
                                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700">
                                    <span className="font-bold text-lg block">{importResult.skipped_count}</span>
                                    Rows skipped / unparsed
                                </div>
                            </div>
                            {importResult.errors?.length > 0 && (
                                <div className="space-y-1.5 pt-2 border-t border-border">
                                    <p className="text-[11px] font-bold text-destructive uppercase tracking-wider flex items-center gap-1">
                                        <AlertCircle className="size-3.5" /> Issues Encountered ({importResult.total_errors}):
                                    </p>
                                    <ul className="text-xs text-destructive/90 list-disc list-inside space-y-0.5 max-h-24 overflow-y-auto">
                                        {importResult.errors.map((err, idx) => (
                                            <li key={idx}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-row items-center justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isImporting}
                        className="rounded-xl font-semibold"
                    >
                        {importResult ? "Close" : "Cancel"}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => runImport()}
                        disabled={isImporting || !selectedFile || !classId}
                        className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                    >
                        {isImporting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="size-4 animate-spin" />
                                Processing Import...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Upload className="size-4" />
                                Upload & Save Attendance
                            </span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
