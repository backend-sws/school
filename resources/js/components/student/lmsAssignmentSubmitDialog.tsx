import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Send,
  CheckCircle2,
  Star,
  Clock,
  Loader2,
  Upload,
  History,
  FileText,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import R2Api from "@/lib/api/r2Api";

export type SubmissionHistoryItem = {
  attempt: number;
  submitted_at: string;
  file_path?: string | null;
  file_url?: string | null;
  notes?: string | null;
  score?: number | string | null;
  feedback?: string | null;
  status?: string;
};

export type SubmissionData = {
  id: number;
  user_id: number;
  status: "draft" | "submitted" | "graded";
  score?: number | string | null;
  feedback?: string | null;
  notes?: string | null;
  file_path?: string | null;
  file_url?: string | null;
  submitted_at?: string | null;
  attempt_number?: number;
  submission_history?: SubmissionHistoryItem[];
};

interface LmsAssignmentSubmitDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  assignment: {
    id: number;
    title: string;
    type: string;
    due_at?: string | null;
    max_score?: number | string | null;
    my_submission?: any | null;
  } | null;
}

export function LmsAssignmentSubmitDialog({ open, onClose, classId, assignment }: LmsAssignmentSubmitDialogProps) {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");
  const [filePath, setFilePath] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showNewAttemptForm, setShowNewAttemptForm] = useState(false);

  // Fetch fresh submissions for this student to get full tracking
  const { data: submissionsRes, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["lms-assignment-my-submission", classId, assignment?.id],
    queryFn: () => lmsApi.assignmentSubmissions.index(classId, assignment!.id),
    enabled: open && !!assignment?.id,
  });

  const submissionsList = ((submissionsRes as { data?: SubmissionData[] })?.data ?? []) as SubmissionData[];
  const existingSubmission: SubmissionData | null =
    submissionsList[0] ?? assignment?.my_submission ?? null;

  const currentAttempt = existingSubmission?.attempt_number ?? (existingSubmission ? 1 : 0);
  const nextAttempt = currentAttempt + 1;
  const historyItems: SubmissionHistoryItem[] = existingSubmission?.submission_history ?? [];

  const submitMutation = useMutation({
    mutationFn: () =>
      lmsApi.assignmentSubmissions.store(classId, assignment!.id, {
        file_path: filePath || undefined,
        notes: notes.trim() || undefined,
        status: "submitted",
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.assignments(classId) });
      queryClient.invalidateQueries({ queryKey: ["lms-assignment-my-submission", classId, assignment?.id] });
      queryClient.invalidateQueries({ queryKey: ["lms-assignment-submissions", classId, assignment?.id] });
      toast.success(data?.message || `Assignment submitted successfully! (Attempt #${nextAttempt})`);
      setNotes("");
      setFilePath(null);
      setShowNewAttemptForm(false);
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to submit. Please try again.");
    },
  });

  const getFileUrl = (fp?: string | null) => {
    if (!fp) return "#";
    return R2Api.imageSrc(fp);
  };

  const downloadFile = async (e: React.MouseEvent, url: string, filename?: string) => {
    e.preventDefault();
    if (!url || url === "#") return;
    try {
      const toastId = toast.loading("Downloading submission file...");
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch file");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const rawName = filename || url.split("/").pop()?.split("?")[0] || "submission";
      const ext = url.split("/").pop()?.split("?")[0]?.split(".").pop();
      link.download = rawName.includes(".") ? rawName : (ext ? `${rawName}.${ext}` : rawName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.dismiss(toastId);
      toast.success("Download completed");
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleSubmit = () => {
    if (!assignment) return;
    submitMutation.mutate();
  };

  const hasSubmitted = !!existingSubmission && !!existingSubmission.submitted_at;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-border/40 shrink-0 bg-muted/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight">
                {hasSubmitted ? "Assignment Submission & Tracking" : "Submit Assignment"}
              </DialogTitle>
              {assignment && (
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground font-medium truncate">{assignment.title}</p>
                  <Badge variant="outline" className="rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0">
                    {assignment.type}
                  </Badge>
                </div>
              )}
            </div>

            {hasSubmitted && (
              <Badge
                className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider border ${
                  existingSubmission.status === "graded"
                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                    : "bg-blue-500/10 text-blue-700 border-blue-500/20"
                }`}
              >
                {existingSubmission.status === "graded" ? (
                  <>
                    <CheckCircle2 className="size-3 mr-1 inline" />
                    Graded: {existingSubmission.score != null ? `${existingSubmission.score}${assignment?.max_score ? `/${assignment.max_score}` : ""} pts` : "Graded"}
                  </>
                ) : (
                  <>
                    <Clock className="size-3 mr-1 inline" />
                    Attempt #{currentAttempt} Submitted
                  </>
                )}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoadingSubmissions && (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground text-sm">
              <Loader2 className="size-4 animate-spin" />
              Loading submission details…
            </div>
          )}

          {/* Current Active Submission Card */}
          {hasSubmitted && existingSubmission && (
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                    #{currentAttempt}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Latest Submission (Attempt #{currentAttempt})
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {existingSubmission.submitted_at ? new Date(existingSubmission.submitted_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "Submitted"}
                    </p>
                  </div>
                </div>

                {existingSubmission.score != null && (
                  <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 font-black text-xs">
                    <Star className="size-3 mr-1" />
                    {existingSubmission.score} {assignment?.max_score ? `/ ${assignment.max_score}` : "pts"}
                  </Badge>
                )}
              </div>

              {/* Submitted File */}
              {existingSubmission.file_path && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/40 text-xs">
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <FileText className="size-4 text-primary shrink-0" />
                    <span className="truncate font-medium text-foreground">
                      {existingSubmission.file_path.split("/").pop() || "Attachment"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={(e) => downloadFile(e, existingSubmission.file_url || getFileUrl(existingSubmission.file_path), `${assignment?.title || "assignment"}_attempt_${currentAttempt}`)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                    >
                      <Download className="size-3" />Download
                    </button>
                    <a
                      href={existingSubmission.file_url || getFileUrl(existingSubmission.file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Student's Notes */}
              {existingSubmission.notes && (
                <div className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl">
                  <span className="font-bold text-foreground">Your note: </span>
                  {existingSubmission.notes}
                </div>
              )}

              {/* Teacher's Feedback */}
              {existingSubmission.feedback && (
                <div className="text-xs text-foreground bg-emerald-500/5 border border-emerald-500/20 p-2.5 rounded-xl space-y-1">
                  <p className="font-bold text-emerald-800 flex items-center gap-1">
                    <Star className="size-3" /> Teacher's Feedback:
                  </p>
                  <p className="leading-relaxed">{existingSubmission.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Previous Attempts History (Audit Trail) */}
          {historyItems.length > 0 && (
            <div className="rounded-2xl border border-border/40 overflow-hidden bg-muted/10">
              <button
                type="button"
                onClick={() => setShowHistory((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <History className="size-3.5 text-primary" />
                  Submission History ({historyItems.length} previous attempt{historyItems.length !== 1 ? "s" : ""})
                </span>
                {showHistory ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>

              {showHistory && (
                <div className="p-4 pt-1 space-y-2.5 border-t border-border/40">
                  {historyItems.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-border/30 bg-background p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="size-5 rounded-full bg-muted flex items-center justify-center font-bold text-[10px]">
                            #{item.attempt}
                          </span>
                          <span className="font-bold text-foreground">Attempt #{item.attempt}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(item.submitted_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                          </span>
                        </div>
                        {item.score != null && (
                          <Badge variant="outline" className="text-[10px] font-bold">
                            Score: {item.score}
                          </Badge>
                        )}
                      </div>

                      {item.file_path && (
                        <div className="flex items-center justify-between text-[11px] bg-muted/30 px-2.5 py-1.5 rounded-lg">
                          <span className="truncate font-medium text-muted-foreground">{item.file_path.split("/").pop()}</span>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              type="button"
                              onClick={(e) => downloadFile(e, item.file_url || getFileUrl(item.file_path), `attempt_${item.attempt}`)}
                              className="text-primary hover:underline font-bold text-[10px] flex items-center gap-1"
                            >
                              <Download className="size-2.5" />Download
                            </button>
                            <a
                              href={item.file_url || getFileUrl(item.file_path)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <ExternalLink className="size-2.5" />
                            </a>
                          </div>
                        </div>
                      )}

                      {item.notes && (
                        <p className="text-[11px] text-muted-foreground italic">"{item.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submission Form Area */}
          {(!hasSubmitted || showNewAttemptForm) ? (
            <div className="space-y-4 pt-1">
              {hasSubmitted && (
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <RotateCcw className="size-3.5" /> Submit Attempt #{nextAttempt}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewAttemptForm(false)}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel New Attempt
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Upload className="size-3" /> Attach File (Image, PDF, Document)
                </label>
                <FileUpload
                  mode="single"
                  accept="application/pdf,image/*,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip"
                  value={filePath ?? ""}
                  onChange={(path) => setFilePath(path || null)}
                  compact
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Notes / Explanation (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={hasSubmitted ? "Notes for this new attempt (e.g. corrected question 3, updated file)..." : "Add any notes or message for your teacher..."}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {hasSubmitted && (
                <p className="text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-xl leading-relaxed">
                  💡 Submitting will record <strong>Attempt #{nextAttempt}</strong>. Your previous attempts will remain saved in your complete submission history.
                </p>
              )}
            </div>
          ) : (
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewAttemptForm(true)}
                className="w-full rounded-2xl py-5 border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-widest gap-2"
              >
                <RotateCcw className="size-3.5" />
                Submit New Attempt (Attempt #{nextAttempt})
              </Button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border/40 shrink-0 bg-muted/5 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-sm font-bold">
            Close
          </Button>

          {(!hasSubmitted || showNewAttemptForm) && (
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="rounded-xl text-sm font-bold gap-2 bg-primary hover:bg-primary/90"
            >
              {submitMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {hasSubmitted ? `Submit Attempt #${nextAttempt}` : "Submit Assignment"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}