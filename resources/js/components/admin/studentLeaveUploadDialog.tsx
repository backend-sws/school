import React, { useState, useRef, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  UploadCloud,
  FileText,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  Paperclip,
  HeartPulse,
  Mail,
  GraduationCap,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  Cloud,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import R2Api, { validateFileForUpload } from "@/lib/api/r2Api";
import { cn } from "@/lib/utils";

export interface StudentLeaveUploadDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  userId: number;
  studentName?: string;
  onSuccess?: () => void;
  defaultCategory?: string;
  isStudent?: boolean;
}

export type DocumentCategoryKey =
  | "leave"
  | "medical"
  | "parent_letter"
  | "academic"
  | "fee"
  | "identity"
  | "disciplinary"
  | "general";

interface CategoryOption {
  key: DocumentCategoryKey;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  types: { value: string; label: string }[];
  isLeaveByDefault: boolean;
}

const DOCUMENT_CATEGORIES: CategoryOption[] = [
  {
    key: "leave",
    label: "Leave Application",
    sublabel: "Casual, sick, emergency or duty leave",
    icon: Calendar,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:border-blue-500/40",
    isLeaveByDefault: true,
    types: [
      { value: "casual", label: "Casual Leave Application" },
      { value: "emergency", label: "Family Emergency Leave" },
      { value: "duty", label: "Official / Duty / Event Leave" },
      { value: "special", label: "Special Permission Leave" },
      { value: "other", label: "Other Leave Application" },
    ],
  },
  {
    key: "medical",
    label: "Medical / Doctor Slip",
    sublabel: "Prescription, sickness certificate, fitness",
    icon: HeartPulse,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:border-emerald-500/40",
    isLeaveByDefault: true,
    types: [
      { value: "medical", label: "Medical Certificate / Prescription" },
      { value: "fitness_cert", label: "Medical Fitness Certificate" },
      { value: "hospital_discharge", label: "Hospital Discharge Summary" },
    ],
  },
  {
    key: "parent_letter",
    label: "Parent / Guardian Note",
    sublabel: "Handwritten note, consent, explanation",
    icon: Mail,
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:border-amber-500/40",
    isLeaveByDefault: false,
    types: [
      { value: "parent_letter", label: "Parent Handwritten Application" },
      { value: "parent_consent", label: "Parent Consent & Permission Slip" },
      { value: "absence_note", label: "Absence Explanation Letter" },
      { value: "guardian_req", label: "Guardian Request Letter" },
    ],
  },
  {
    key: "academic",
    label: "TC & Academic Docs",
    sublabel: "Transfer certificate, marksheet, migration",
    icon: GraduationCap,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:border-purple-500/40",
    isLeaveByDefault: false,
    types: [
      { value: "tc_copy", label: "Transfer Certificate (TC) Copy" },
      { value: "academic_cert", label: "Previous Marksheet / Report Card" },
      { value: "migration_cert", label: "Migration / Board Certificate" },
      { value: "character_cert", label: "Character Certificate" },
    ],
  },
  {
    key: "fee",
    label: "Fee & Bank Slip",
    sublabel: "Bank challan, receipt, payment proof",
    icon: CreditCard,
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:border-cyan-500/40",
    isLeaveByDefault: false,
    types: [
      { value: "fee_receipt", label: "Physical Fee Receipt Copy" },
      { value: "bank_challan", label: "Bank Deposit Challan Slip" },
      { value: "online_slip", label: "Payment Transaction Proof" },
    ],
  },
  {
    key: "identity",
    label: "Identity & Govt ID",
    sublabel: "Aadhaar, birth cert, caste, domicile",
    icon: ShieldCheck,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:border-indigo-500/40",
    isLeaveByDefault: false,
    types: [
      { value: "id_proof", label: "Aadhaar / Govt ID Copy" },
      { value: "birth_cert", label: "Birth Certificate Copy" },
      { value: "caste_cert", label: "Caste / Category Certificate" },
      { value: "domicile_cert", label: "Domicile / Residence Proof" },
    ],
  },
  {
    key: "disciplinary",
    label: "Disciplinary Record",
    sublabel: "Incident note, warning letter, meeting slip",
    icon: AlertTriangle,
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20 hover:border-rose-500/40",
    isLeaveByDefault: false,
    types: [
      { value: "disciplinary", label: "Incident / Warning Letter" },
      { value: "parent_call_slip", label: "Parent Teacher Meeting Notice" },
      { value: "conduct_record", label: "Conduct & Disciplinary Record" },
    ],
  },
  {
    key: "general",
    label: "General Document",
    sublabel: "Any other scanned document or physical record",
    icon: FolderOpen,
    color: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-300 border-neutral-500/20 hover:border-neutral-500/40",
    isLeaveByDefault: false,
    types: [
      { value: "general_document", label: "General Physical Document / Slip" },
      { value: "other", label: "Other Official Letter / Record" },
    ],
  },
];

export function StudentLeaveUploadDialog({
  open,
  onClose,
  classId,
  userId,
  studentName,
  onSuccess,
  defaultCategory = "leave",
  isStudent = false,
}: StudentLeaveUploadDialogProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategoryKey>(
    (defaultCategory as DocumentCategoryKey) || "leave"
  );
  const [docTitle, setDocTitle] = useState("");
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(todayStr);
  const [leaveType, setLeaveType] = useState("casual");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(isStudent ? "pending" : "approved");
  const [autoMark, setAutoMark] = useState(isStudent ? false : true);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);

  // Filter categories for students vs staff (students only see leave, medical, parent letter)
  const availableCategories = useMemo(() => {
    if (isStudent) {
      return DOCUMENT_CATEGORIES.filter((c) =>
        ["leave", "medical", "parent_letter"].includes(c.key)
      );
    }
    return DOCUMENT_CATEGORIES;
  }, [isStudent]);

  // Category Configuration
  const currentCategoryConfig =
    availableCategories.find((c) => c.key === selectedCategory) || availableCategories[0];

  const handleCategorySelect = (catKey: DocumentCategoryKey) => {
    setSelectedCategory(catKey);
    const cat = availableCategories.find((c) => c.key === catKey);
    if (cat) {
      setLeaveType(cat.types[0]?.value || "other");
      setAutoMark(isStudent ? false : cat.isLeaveByDefault);
    }
  };

  // Calculate total days for leave or date-range
  const calculateDays = () => {
    try {
      const f = new Date(fromDate);
      const t = new Date(toDate);
      const diffTime = t.getTime() - f.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    const validationErr = validateFileForUpload(file);
    if (validationErr) {
      toast.error(validationErr.message);
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!reason.trim()) {
        throw new Error("Please specify the description or reason for this document.");
      }
      if (!fromDate) {
        throw new Error("Please select a valid date for this document record.");
      }
      if (toDate && new Date(fromDate) > new Date(toDate)) {
        throw new Error("From Date cannot be later than To Date.");
      }

      let r2UploadedPath: string | null = null;

      // 1. Direct R2 Presigned / Pipeline Upload if file selected
      if (selectedFile) {
        setIsUploadingFile(true);
        setUploadProgress(10);
        try {
          r2UploadedPath = await R2Api.uploadFile(selectedFile, (percent) => {
            setUploadProgress(20 + Math.round(percent * 0.75));
          });
          setUploadProgress(100);
        } catch (uploadErr: any) {
          throw new Error(uploadErr?.message || "Failed to upload file to Cloudflare R2.");
        } finally {
          setIsUploadingFile(false);
        }
      }

      // 2. Submit document record to backend
      const payload: Record<string, any> = {
        document_category: selectedCategory,
        document_title: docTitle.trim() || undefined,
        leave_type: leaveType,
        from_date: fromDate,
        to_date: toDate || fromDate,
        reason: reason.trim(),
        status: status,
        auto_marked_attendance: autoMark ? 1 : 0,
        admin_remarks: adminRemarks.trim() || undefined,
      };

      if (r2UploadedPath) {
        payload.document_path = r2UploadedPath;
        payload.document_original_name = selectedFile?.name;
        payload.document_mime_type = selectedFile?.type;
        payload.document_size = selectedFile?.size;
      }

      return lmsApi.studentRoster.uploadLeave(classId, userId, payload);
    },
    onSuccess: () => {
      toast.success("Physical document uploaded and securely stored to R2 Vault!");
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["student-360-profile", classId, userId] });
      queryClient.invalidateQueries({ queryKey: ["lms-class-students-summary", classId] });
      queryClient.invalidateQueries({ queryKey: ["student-leaves-list", classId, userId] });
      queryClient.invalidateQueries({ queryKey: ["attendance-monthly-matrix", classId] });
      queryClient.invalidateQueries({ queryKey: ["lms-class-attendance-today", classId] });

      // Reset form
      setDocTitle("");
      setReason("");
      setSelectedFile(null);
      setFilePreview(null);
      setAdminRemarks("");
      setUploadProgress(0);

      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to upload physical document.";
      toast.error(msg);
      setUploadProgress(0);
    },
  });

  const isLeaveFlow = isStudent || selectedCategory === "leave" || selectedCategory === "medical" || selectedCategory === "parent_letter";

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-xl w-[95vw] sm:w-full max-h-[85vh] p-0 overflow-hidden flex flex-col rounded-2xl sm:rounded-3xl border-border/80 shadow-2xl bg-card">
        {/* Header - Fixed & Compact */}
        <DialogHeader className="shrink-0 px-4 sm:px-5 pt-3.5 pb-2.5 border-b border-border/40 bg-gradient-to-r from-primary/10 via-background to-primary/5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/20 shadow-xs shrink-0">
                <UploadCloud className="size-4 sm:size-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <DialogTitle className="text-sm sm:text-base font-bold text-foreground truncate">
                    {isStudent ? "Apply for Leave / Upload Slip" : "Upload Physical Copy / Document"}
                  </DialogTitle>
                  <Badge variant="outline" className="text-[9px] font-bold py-0 h-4 bg-primary/10 text-primary border-primary/30 flex items-center gap-1">
                    <Cloud className="size-2.5" /> R2 Direct
                  </Badge>
                </div>
                <DialogDescription className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {isStudent ? "Submitting application for " : "Archiving record for "}
                  <span className="font-semibold text-foreground">{studentName || "Student"}</span>
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body - Strictly scrollable inside flex column */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-3 space-y-3">
          {/* Document Category Selection Pills Grid - Compact */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {isStudent ? "Application Type" : "Document Category"}
              </Label>
              <span className="text-[10px] text-muted-foreground">
                {availableCategories.length} {isStudent ? "options" : "categories"} available
              </span>
            </div>

            <div className={cn(
              "grid gap-1.5",
              isStudent ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"
            )}>
              {availableCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => handleCategorySelect(cat.key)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary text-foreground font-bold"
                        : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "size-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                        cat.color
                      )}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-foreground truncate block leading-tight">
                        {cat.label}
                      </span>
                      {isStudent && (
                        <span className="text-[9px] text-muted-foreground truncate block mt-0.5">
                          {cat.sublabel}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specific Document Type & Document Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-foreground">
                {isStudent ? "Leave Reason Category" : "Specific Document Type"}
              </Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="h-8 rounded-lg bg-background border-border/80 font-medium text-xs">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  {currentCategoryConfig.types.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-xs font-medium">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-foreground">
                {isStudent ? "Short Title / Subject" : "Document Title"}{" "}
                <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder={
                  isStudent
                    ? "e.g. Sickness / Sister's Wedding / Out of station"
                    : "e.g. Dr. Verma Slip / Marksheet"
                }
                className="h-8 rounded-lg bg-background border-border/80 font-medium text-xs"
              />
            </div>
          </div>

          {/* File Upload Dropzone - Compact */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Scanned Copy / Photo (PDF, JPG, PNG)
              </Label>
              <span className="text-[10px] text-muted-foreground">Max 10MB • R2 Cloud</span>
            </div>

            {!selectedFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center justify-center gap-3 border-2 border-dashed rounded-xl py-3 px-4 transition-all cursor-pointer ${
                  dragActive
                    ? "border-primary bg-primary/5 scale-[0.99]"
                    : "border-border/80 bg-muted/10 hover:bg-muted/20 hover:border-primary/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border/60 shadow-xs text-muted-foreground">
                  <Paperclip className="size-4 text-primary" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-foreground leading-tight">
                    {isStudent
                      ? "Click to attach handwritten letter or doctor prescription"
                      : "Click to browse or drag & drop scan / photo"}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                    {isStudent
                      ? "Doctor prescription, hospital slip, parent note, or handwritten leave application"
                      : "Medical slips, parent letters, TC copy, bank challan, Govt ID or PDF"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 rounded-xl border border-border/80 bg-muted/20 p-2 sm:p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="size-8 rounded-lg object-cover border border-border/60 shrink-0"
                      />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <FileText className="size-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Direct R2 Storage
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => handleFileChange(null)}
                    disabled={uploadMutation.isPending}
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg size-7"
                    title="Remove file"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                {uploadProgress > 0 && (
                  <div className="space-y-0.5 pt-0.5">
                    <div className="flex justify-between text-[9px] font-bold text-muted-foreground">
                      <span>Uploading to R2...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1 rounded-full" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date Range & Duration Inline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                  <Calendar className="size-3 text-primary" />
                  {isLeaveFlow ? "From Date (Start)" : "Document / Issue Date"}
                </Label>
              </div>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  if (!isLeaveFlow) setToDate(e.target.value);
                }}
                className="h-8 rounded-lg bg-background border-border/80 font-medium text-xs"
              />
            </div>

            {isLeaveFlow ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="size-3 text-primary" /> To Date (End)
                  </Label>
                  <Badge variant="outline" className="text-[9px] py-0 h-4 px-1.5 font-bold bg-primary/10 text-primary border-primary/20">
                    {calculateDays()} Day{calculateDays() > 1 ? "s" : ""}
                  </Badge>
                </div>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-8 rounded-lg bg-background border-border/80 font-medium text-xs"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-foreground">Record Validity</Label>
                <div className="flex h-8 items-center rounded-lg bg-muted/40 border border-border/60 px-2.5 font-medium text-xs text-muted-foreground">
                  Permanent Physical Archive Record
                </div>
              </div>
            )}
          </div>

          {/* Reason / Notes */}
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold text-foreground">
              Description / Reason / Remarks <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isLeaveFlow
                  ? "e.g. Severe viral fever, advised 3 days bed rest. Attached doctor prescription copy."
                  : "e.g. Attached original parent letter / Transfer Certificate submitted at admission."
              }
              className="rounded-lg bg-background border-border/80 min-h-[48px] max-h-[72px] h-[52px] resize-none text-xs p-2"
            />
          </div>

          {/* Auto-mark Attendance Toggle - Compact (Staff only) or Student Notice */}
          {isStudent ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5">
              <Clock className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">
                  Teacher Approval Required
                </p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Your leave application or medical slip will be submitted with "Pending" status. Once your class teacher reviews and approves it, your attendance register will be marked accordingly.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-2.5 flex items-start gap-2.5">
              <Checkbox
                id="auto-mark-doc"
                checked={autoMark}
                onCheckedChange={(c) => setAutoMark(!!c)}
                className="mt-0.5 rounded-md border-primary text-primary"
              />
              <div className="space-y-0.5 select-none cursor-pointer" onClick={() => setAutoMark(!autoMark)}>
                <Label htmlFor="auto-mark-doc" className="text-xs font-bold text-foreground cursor-pointer">
                  {isLeaveFlow
                    ? "Auto-mark Attendance Register as 'On Leave' (L)"
                    : "Mark Attendance as Leave for this Date / Period"}
                </Label>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  {isLeaveFlow
                    ? `Automatically marks the student's register records as "Leave" from ${fromDate} to ${toDate || fromDate}.`
                    : `Keep unchecked to archive document without modifying register records.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed & Compact */}
        <DialogFooter className="shrink-0 px-4 sm:px-5 py-2.5 border-t border-border/40 bg-muted/20 flex items-center justify-between sm:justify-between gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={uploadMutation.isPending}
            className="h-8 rounded-lg font-semibold text-xs px-3"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={() => uploadMutation.mutate()}
            disabled={uploadMutation.isPending || !reason.trim()}
            className="h-8 rounded-lg font-bold text-xs gap-1.5 px-3.5 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {isUploadingFile ? `Uploading (${uploadProgress}%)...` : "Saving..."}
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3.5" />
                {isStudent ? "Submit Leave Request" : "Save & Preserve Document"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export alias for backward compatibility
export const StudentDocumentUploadDialog = StudentLeaveUploadDialog;
