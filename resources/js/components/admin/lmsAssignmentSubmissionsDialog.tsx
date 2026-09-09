import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import { toast } from "sonner";
import {
  Download,
  FileText,
  CheckCircle2,
  Clock,
  Star,
  Loader2,
  Users,
  ExternalLink,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Each from "@/components/Each";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import R2Api from "@/lib/api/r2Api";

interface LmsAssignmentSubmissionsDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  assignment: { id: number; title: string; max_score?: number | string | null; due_at?: string | null } | null;
}

type SubmissionHistoryItem = {
  attempt: number;
  submitted_at: string;
  file_path?: string | null;
  file_url?: string | null;
  notes?: string | null;
  score?: number | string | null;
  feedback?: string | null;
  status?: string;
};

type SubmissionRow = {
  id: number;
  user_id: number;
  user?: { id: number; name?: string; email?: string } | null;
  status: "draft" | "submitted" | "graded";
  score?: number | null;
  feedback?: string | null;
  notes?: string | null;
  file_path?: string | null;
  file_url?: string | null;
  submitted_at?: string | null;
  attempt_number?: number;
  submission_history?: SubmissionHistoryItem[];
};

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  submitted: { label: "Submitted", cls: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  graded: { label: "Graded", cls: "bg-green-500/10 text-green-700 border-green-500/20" },
  draft: { label: "Draft", cls: "bg-muted text-muted-foreground border-border/40" },
};

export function LmsAssignmentSubmissionsDialog({ open, onClose, classId, assignment }: LmsAssignmentSubmissionsDialogProps) {
  const queryClient = useQueryClient();
  const [gradingId, setGradingId] = useState<number | null>(null);
  const [scoreInput, setScoreInput] = useState<Record<number, string>>({});
  const [feedbackInput, setFeedbackInput] = useState<Record<number, string>>({});
  const [expandedHistory, setExpandedHistory] = useState<Record<number, boolean>>({});

  const { data: submissionsRes, isLoading } = useQuery({
    queryKey: ["lms-assignment-submissions", classId, assignment?.id],
    queryFn: () => lmsApi.assignmentSubmissions.index(classId, assignment!.id),
    enabled: open && !!assignment?.id,
  });

  const submissions = ((submissionsRes as { data?: SubmissionRow[] })?.data ?? []) as SubmissionRow[];
  const maxScore = assignment?.max_score;

  const gradeMutation = useMutation({
    mutationFn: ({ submissionId, score, feedback, status }: { submissionId: number; score?: number | null; feedback?: string; status: string }) =>
      lmsApi.assignmentSubmissions.update(classId, assignment!.id, submissionId, {
        score: score ?? null,
        feedback: feedback || undefined,
        status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.assignments(classId) });
      queryClient.invalidateQueries({ queryKey: ["lms-assignment-submissions", classId, assignment?.id] });
      toast.success("Submission graded successfully!");
      setGradingId(null);
    },
    onError: () => toast.error("Failed to grade submission."),
  });

  const handleGrade = (sub: SubmissionRow) => {
    const sv = scoreInput[sub.id];
    const fb = feedbackInput[sub.id];
    const score = sv !== undefined && sv !== "" ? Number(sv) : sub.score ?? null;
    gradeMutation.mutate({
      submissionId: sub.id,
      score,
      feedback: fb !== undefined ? fb : (sub.feedback || ""),
      status: "graded",
    });
  };

  const getFileUrl = (fp?: string | null) => {
    if (!fp) return "#";
    return R2Api.imageSrc(fp);
  };

  const downloadFile = async (e: React.MouseEvent, url: string, filename?: string) => {
    e.preventDefault();
    if (!url || url === "#") return;
    try {
      const toastId = toast.loading("Downloading submission...");
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

  const toggleHistory = (subId: number) => {
    setExpandedHistory((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border/40 shrink-0 bg-muted/5">
          <DialogTitle className="text-lg font-bold tracking-tight">
            Submissions & Attempts Tracking — <span className="text-muted-foreground font-medium">{assignment?.title}</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            {submissions.length} student{submissions.length !== 1 ? "s" : ""} submitted
            {maxScore != null && maxScore !== "" ? ` · Max score: ${maxScore} pts` : ""}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              <span className="text-sm font-medium">Loading submissions…</span>
            </div>
          )}
          {!isLoading && submissions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="size-12 text-muted-foreground/20 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">No submissions yet</p>
            </div>
          )}
          <Each
            of={submissions}
            keyExtractor={(s) => s.id}
            nodatafound={<></>}
            render={(sub) => {
              const initials = sub.user?.name?.split(" ").map((n) => n[0]).join("") ?? "?";
              const sc = STATUS_CFG[sub.status] ?? STATUS_CFG.draft;
              const isGrading = gradingId === sub.id;
              const isSubmitting = gradeMutation.isPending && gradingId === sub.id;
              const fileUrl = sub.file_url || getFileUrl(sub.file_path);
              const attemptCount = sub.attempt_number || (sub.submission_history ? sub.submission_history.length + 1 : 1);
              const historyItems = sub.submission_history || [];
              const isHistoryOpen = !!expandedHistory[sub.id];

              return (
                <div className="rounded-2xl border border-border/40 bg-white/60 backdrop-blur-sm p-4 space-y-3 hover:border-border/70 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="size-9 border border-primary/10 shrink-0">
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-black uppercase">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold tracking-tight text-sm truncate">{sub.user?.name ?? "Unknown Student"}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium truncate">{sub.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className="rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase px-2">
                        Attempt #{attemptCount}
                      </Badge>
                      <Badge className={`rounded-full border text-[10px] font-black uppercase tracking-widest px-2.5 ${sc.cls}`}>{sc.label}</Badge>
                      {sub.status === "graded" && sub.score != null && (
                        <Badge className="rounded-full bg-green-500/10 text-green-700 border border-green-500/20 text-[10px] font-black px-2">
                          <Star className="size-2.5 mr-1" />{sub.score}{maxScore != null && maxScore !== "" ? `/${maxScore}` : ""} pts
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {sub.submitted_at && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        Submitted {new Date(sub.submitted_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                    )}
                    {sub.file_path ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => downloadFile(e, fileUrl, `${sub.user?.name || "student"}_attempt_${attemptCount}`)}
                          className="flex items-center gap-1 text-primary font-semibold hover:underline cursor-pointer"
                        >
                          <Download className="size-3" />Download (Attempt #{attemptCount})
                        </button>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink className="size-3" />View
                        </a>
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground/50"><FileText className="size-3" />No file attached</span>
                    )}
                  </div>

                  {sub.notes && (
                    <div className="text-xs text-muted-foreground bg-muted/30 rounded-xl px-3 py-2">
                      <span className="font-bold text-foreground">Student's Note: </span>
                      {sub.notes}
                    </div>
                  )}

                  {sub.feedback && (
                    <div className="text-xs text-foreground/80 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2 leading-relaxed">
                      <span className="font-bold text-emerald-800">Teacher's Feedback: </span>
                      {sub.feedback}
                    </div>
                  )}

                  {/* Previous attempts history accordion */}
                  {historyItems.length > 0 && (
                    <div className="rounded-xl border border-border/40 bg-muted/10 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleHistory(sub.id)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <History className="size-3 text-primary" />
                          View Previous Attempts ({historyItems.length})
                        </span>
                        {isHistoryOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                      </button>

                      {isHistoryOpen && (
                        <div className="p-3 pt-0 space-y-2 border-t border-border/30">
                          {historyItems.map((hist, hIdx) => (
                            <div key={hIdx} className="rounded-lg bg-background border border-border/30 p-2.5 text-xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-foreground">Attempt #{hist.attempt}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(hist.submitted_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                                </span>
                              </div>
                              {hist.file_path && (
                                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                  <span className="truncate">{hist.file_path.split("/").pop()}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => downloadFile(e, hist.file_url || getFileUrl(hist.file_path), `${sub.user?.name}_attempt_${hist.attempt}`)}
                                    className="text-primary hover:underline font-bold text-[10px] flex items-center gap-1 ml-2 shrink-0"
                                  >
                                    <Download className="size-2.5" />Download
                                  </button>
                                </div>
                              )}
                              {hist.notes && <p className="text-[11px] text-muted-foreground italic">"{hist.notes}"</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Grading Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    {!isGrading ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setGradingId(sub.id);
                          setScoreInput((p) => ({ ...p, [sub.id]: sub.score != null ? String(sub.score) : "" }));
                          setFeedbackInput((p) => ({ ...p, [sub.id]: sub.feedback || "" }));
                        }}
                        className="rounded-xl text-xs font-bold h-8 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                      >
                        <CheckCircle2 className="size-3.5 mr-1.5" />{sub.status === "graded" ? "Re-grade" : "Grade Submission"}
                      </Button>
                    ) : (
                      <div className="w-full space-y-2 border border-primary/20 rounded-xl p-3 bg-muted/10">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 border border-border/40 rounded-xl bg-background px-3 py-1.5 h-8">
                            <Star className="size-3 text-muted-foreground shrink-0" />
                            <input
                              type="number"
                              min={0}
                              max={maxScore != null && maxScore !== "" ? Number(maxScore) : undefined}
                              value={scoreInput[sub.id] ?? ""}
                              onChange={(e) => setScoreInput((p) => ({ ...p, [sub.id]: e.target.value }))}
                              placeholder={maxScore != null && maxScore !== "" ? `/ ${maxScore}` : "Score"}
                              className="w-20 bg-transparent text-xs font-bold outline-none placeholder:text-muted-foreground/40"
                            />
                          </div>
                          <Button size="sm" onClick={() => handleGrade(sub)} disabled={isSubmitting} className="rounded-xl text-xs font-bold h-8 bg-primary hover:bg-primary/90">
                            {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : "Save Grade"}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setGradingId(null)} className="rounded-xl text-xs font-bold h-8">Cancel</Button>
                        </div>
                        <input
                          type="text"
                          value={feedbackInput[sub.id] ?? ""}
                          onChange={(e) => setFeedbackInput((p) => ({ ...p, [sub.id]: e.target.value }))}
                          placeholder="Feedback notes for student (optional)..."
                          className="w-full border border-border/40 rounded-xl bg-background px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
        </div>

        <div className="px-6 py-4 border-t border-border/40 shrink-0 bg-muted/5">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-sm font-bold">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
