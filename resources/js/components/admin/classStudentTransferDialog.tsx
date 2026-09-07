import React, { useState, useEffect, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRightLeft,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  Sparkles,
  Info,
  PlusCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ClassStudentTransferDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  className?: string;
  preSelectedStudentUserIds?: number[];
  onSuccess?: () => void;
}

export function ClassStudentTransferDialog({
  open,
  onClose,
  classId,
  className,
  preSelectedStudentUserIds = [],
  onSuccess,
}: ClassStudentTransferDialogProps) {
  const queryClient = useQueryClient();

  // Mode: 'section' (within same session) or 'session' (cross-session migration)
  const [transferMode, setTransferMode] = useState<"section" | "session">("section");

  // Selection
  const [targetSessionId, setTargetSessionId] = useState<string>("");
  const [targetClassId, setTargetClassId] = useState<string>("");
  const [isCreatingNewSection, setIsCreatingNewSection] = useState<boolean>(false);
  const [newSectionLetter, setNewSectionLetter] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  // Student selection
  const [selectionMode, setSelectionMode] = useState<"all" | "custom">("all");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [studentSearch, setStudentSearch] = useState<string>("");

  // Fetch transfer options
  const { data: optionsRes, isLoading } = useQuery({
    queryKey: ["lms-class-transfer-options", classId],
    queryFn: () => lmsApi.studentTransfer.options(classId),
    enabled: open && !!classId,
  });

  const optionsData = (optionsRes as any)?.data;
  const sourceClass = optionsData?.source_class;
  const enrolledStudents = (optionsData?.students ?? []) as any[];
  const sessions = (optionsData?.sessions ?? []) as any[];
  const availableClasses = (optionsData?.available_classes ?? []) as any[];

  // Reset / init state when dialog opens or data loads
  useEffect(() => {
    if (open && optionsData) {
      if (preSelectedStudentUserIds && preSelectedStudentUserIds.length > 0) {
        setSelectionMode("custom");
        setSelectedUserIds(preSelectedStudentUserIds);
      } else {
        setSelectionMode("all");
        setSelectedUserIds(enrolledStudents.map((s: any) => s.user_id));
      }
      setIsCreatingNewSection(false);
      setNewSectionLetter("");
      setTargetClassId("");
      setRemarks("");

      // Default target session: if session transfer, find another session (e.g. 2025-2026)
      if (sourceClass?.session_id) {
        const otherSession = sessions.find((s: any) => s.id !== sourceClass.session_id);
        if (otherSession) {
          setTargetSessionId(String(otherSession.id));
        } else {
          setTargetSessionId(String(sourceClass.session_id));
        }
      } else if (sessions.length > 0) {
        setTargetSessionId(String(sessions[0].id));
      }
    }
  }, [open, optionsData, preSelectedStudentUserIds]);

  // Handle all selection toggle
  useEffect(() => {
    if (selectionMode === "all" && enrolledStudents.length > 0) {
      setSelectedUserIds(enrolledStudents.map((s: any) => s.user_id));
    }
  }, [selectionMode, enrolledStudents]);

  // Filter available classes based on mode & chosen session
  const filteredTargetClasses = useMemo(() => {
    if (transferMode === "section") {
      // Same session as source class
      return availableClasses.filter(
        (c: any) =>
          c.id !== classId &&
          (sourceClass?.session_id ? c.session_id === sourceClass.session_id : true)
      );
    } else {
      // Classes under the chosen target session
      const sessIdNum = targetSessionId ? Number(targetSessionId) : null;
      return availableClasses.filter(
        (c: any) => c.id !== classId && c.session_id === sessIdNum
      );
    }
  }, [availableClasses, classId, transferMode, sourceClass, targetSessionId]);

  // Target class object
  const selectedTargetClassObject = useMemo(() => {
    if (targetClassId && targetClassId !== "new") {
      return availableClasses.find((c: any) => c.id === Number(targetClassId));
    }
    return null;
  }, [targetClassId, availableClasses]);

  // Filter students in the custom picker
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return enrolledStudents;
    const q = studentSearch.toLowerCase();
    return enrolledStudents.filter(
      (s: any) =>
        s.name?.toLowerCase().includes(q) ||
        String(s.roll_no || "").toLowerCase().includes(q) ||
        String(s.reg_no || "").toLowerCase().includes(q)
    );
  }, [enrolledStudents, studentSearch]);

  const toggleStudent = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectAllFiltered = () => {
    const ids = filteredStudents.map((s: any) => s.user_id);
    setSelectedUserIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const deselectAllFiltered = () => {
    const idsToExclude = new Set(filteredStudents.map((s: any) => s.user_id));
    setSelectedUserIds((prev) => prev.filter((id) => !idsToExclude.has(id)));
  };

  // Transfer Mutation
  const transferMutation = useMutation({
    mutationFn: (payload: any) => lmsApi.studentTransfer.transfer(classId, payload),
    onSuccess: (res: any) => {
      toast.success(res?.data?.message || "Students transferred successfully.");
      queryClient.invalidateQueries({ queryKey: ["lms-classes"] });
      queryClient.invalidateQueries({ queryKey: ["lms-class-students-summary", classId] });
      queryClient.invalidateQueries({ queryKey: ["lms-class-transfer-options", classId] });
      if (selectedTargetClassObject?.id) {
        queryClient.invalidateQueries({
          queryKey: ["lms-class-students-summary", selectedTargetClassObject.id],
        });
      }
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to transfer students. Please check your selections.";
      toast.error(msg);
    },
  });

  const handleConfirmTransfer = () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one student to transfer.");
      return;
    }

    if (isCreatingNewSection) {
      if (!newSectionLetter.trim()) {
        toast.error("Please enter a section letter (e.g. A, B, C).");
        return;
      }
    } else if (!targetClassId) {
      toast.error("Please select a target destination section.");
      return;
    }

    const payload: any = {
      transfer_mode: transferMode,
      student_user_ids: selectedUserIds,
      remarks: remarks.trim() || undefined,
    };

    if (transferMode === "session") {
      payload.target_session_id = Number(targetSessionId);
    }

    if (isCreatingNewSection) {
      payload.target_section = newSectionLetter.trim().toUpperCase();
    } else {
      payload.target_class_id = Number(targetClassId);
    }

    transferMutation.mutate(payload);
  };

  const targetSessionName = useMemo(() => {
    if (transferMode === "section") {
      return sourceClass?.session_name || "Current Session";
    }
    const found = sessions.find((s: any) => String(s.id) === targetSessionId);
    return found?.name || "Selected Session";
  }, [transferMode, sourceClass, sessions, targetSessionId]);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <ArrowRightLeft className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-foreground">
                Transfer Classroom Students
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Move students between sections or migrate them to another academic session.
              </DialogDescription>
            </div>
          </div>

          {sourceClass && (
            <div className="flex items-center gap-2 pt-2 flex-wrap text-xs">
              <span className="font-semibold text-muted-foreground">Source Classroom:</span>
              <Badge variant="secondary" className="font-bold">
                {sourceClass.name}
              </Badge>
              {sourceClass.session_name && (
                <Badge variant="outline" className="font-bold border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Calendar className="size-3 mr-1" />
                  {sourceClass.session_name}
                </Badge>
              )}
              <Badge variant="secondary" className="font-bold">
                <Users className="size-3 mr-1" />
                {sourceClass.enrolled_count} Enrolled
              </Badge>
            </div>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-xs font-semibold">Loading transfer options...</p>
          </div>
        ) : (
          <div className="space-y-6 pt-3">
            {/* ── Transfer Mode Selector ── */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Choose Transfer Option
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTransferMode("section");
                    setTargetClassId("");
                    setIsCreatingNewSection(false);
                  }}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-2xl border text-left transition-all",
                    transferMode === "section"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                      : "border-border/70 hover:border-primary/40 bg-card"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-primary" />
                    <span className="font-bold text-sm text-foreground">
                      Section Transfer
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Transfer students to another section (e.g. Section B) within the same academic session.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTransferMode("session");
                    setTargetClassId("");
                    setIsCreatingNewSection(false);
                  }}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-2xl border text-left transition-all",
                    transferMode === "session"
                      ? "border-blue-600 bg-blue-500/5 ring-2 ring-blue-500/20 shadow-sm"
                      : "border-border/70 hover:border-blue-400 bg-card"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-blue-600" />
                    <span className="font-bold text-sm text-foreground">
                      Session Migration
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Correct / migrate students to another academic session (e.g. 2025-2026) and assign section.
                  </p>
                </button>
              </div>
            </div>

            {/* ── Destination Configuration ── */}
            <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles className="size-3.5 text-primary" />
                Target Destination
              </h4>

              {/* Target Session (Only in Session mode) */}
              {transferMode === "session" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Target Academic Session <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={targetSessionId}
                    onValueChange={(val) => {
                      setTargetSessionId(val);
                      setTargetClassId("");
                    }}
                  >
                    <SelectTrigger className="rounded-xl bg-background border-border/80 h-10 text-xs">
                      <SelectValue placeholder="Select target academic session..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.map((sess: any) => (
                        <SelectItem key={sess.id} value={String(sess.id)} className="text-xs">
                          {sess.name} {sess.is_current ? "(Current Session)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    Students' profile session will be updated to this academic session.
                  </p>
                </div>
              )}

              {/* Target Section Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    Destination Section <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNewSection(!isCreatingNewSection);
                      setTargetClassId("");
                    }}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="size-3" />
                    {isCreatingNewSection ? "Choose Existing Section" : "+ Create New Section"}
                  </button>
                </div>

                {!isCreatingNewSection ? (
                  <div>
                    <Select
                      value={targetClassId}
                      onValueChange={(val) => setTargetClassId(val)}
                    >
                      <SelectTrigger className="rounded-xl bg-background border-border/80 h-10 text-xs">
                        <SelectValue
                          placeholder={
                            filteredTargetClasses.length > 0
                              ? "Select destination section..."
                              : "No existing sections found. Click '+ Create New Section' above."
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTargetClasses.map((cls: any) => (
                          <SelectItem key={cls.id} value={String(cls.id)} className="text-xs">
                            {cls.name} {cls.session_name ? `(${cls.session_name})` : ""} — {cls.active_students} students
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {filteredTargetClasses.length === 0 && (
                      <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-2">
                        <Info className="size-4 shrink-0" />
                        <span>
                          No sections exist under this session yet. Click{" "}
                          <strong>"+ Create New Section"</strong> to auto-create Section A (or another section) and move students into it.
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <Input
                          placeholder="e.g. A, B, C..."
                          value={newSectionLetter}
                          onChange={(e) => setNewSectionLetter(e.target.value.toUpperCase())}
                          maxLength={5}
                          className="rounded-xl bg-background uppercase font-bold text-xs h-10"
                        />
                      </div>
                      <Badge variant="outline" className="h-10 px-3 font-semibold text-xs border-dashed">
                        {sourceClass?.stream_name} – Section {newSectionLetter || "?"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      The classroom section will be automatically created under{" "}
                      <strong>{targetSessionName}</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Student Selection Area ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Select Students to Transfer
                </label>
                <div className="flex items-center rounded-xl bg-muted/40 p-1 border border-border/60">
                  <button
                    type="button"
                    onClick={() => setSelectionMode("all")}
                    className={cn(
                      "px-2.5 py-1 text-xs font-bold rounded-lg transition-colors",
                      selectionMode === "all"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    All Students ({enrolledStudents.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectionMode("custom")}
                    className={cn(
                      "px-2.5 py-1 text-xs font-bold rounded-lg transition-colors",
                      selectionMode === "custom"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Pick Specific ({selectedUserIds.length})
                  </button>
                </div>
              </div>

              {selectionMode === "custom" && (
                <div className="border border-border/70 rounded-2xl p-3 bg-card space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search student by name, roll no, reg no..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="pl-8.5 rounded-xl h-9 text-xs bg-background"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllFiltered}
                      className="text-xs h-9 rounded-xl font-bold"
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={deselectAllFiltered}
                      className="text-xs h-9 rounded-xl text-muted-foreground font-bold"
                    >
                      Clear
                    </Button>
                  </div>

                  <div className="max-h-48 overflow-y-auto divide-y divide-border/40 pr-1">
                    {filteredStudents.length === 0 ? (
                      <p className="text-center py-6 text-xs text-muted-foreground">
                        No students found matching your search.
                      </p>
                    ) : (
                      filteredStudents.map((s: any) => {
                        const isChecked = selectedUserIds.includes(s.user_id);
                        return (
                          <div
                            key={s.user_id}
                            onClick={() => toggleStudent(s.user_id)}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors",
                              isChecked ? "bg-primary/5" : "hover:bg-muted/40"
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => toggleStudent(s.user_id)}
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-xs text-foreground truncate">
                                  {s.name}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                  {s.roll_no && <span>Roll #{s.roll_no}</span>}
                                  {s.reg_no && <span>(Reg: {s.reg_no})</span>}
                                </div>
                              </div>
                            </div>
                            {isChecked && (
                              <Badge variant="secondary" className="text-[10px] font-bold bg-primary/10 text-primary border-primary/20">
                                Selected
                              </Badge>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Remarks input (Optional) ── */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Transfer Remarks (Optional)
              </label>
              <Input
                placeholder="e.g. 2025-2026 session import correction, section rebalance..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="rounded-xl h-9 text-xs bg-background"
              />
            </div>

            {/* ── Transfer Summary Preview Box ── */}
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
              <Info className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-foreground">
                  Transfer Summary:
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Transferring <strong className="text-primary">{selectedUserIds.length} students</strong> from{" "}
                  <strong>{sourceClass?.name}</strong> to{" "}
                  <strong>
                    {isCreatingNewSection
                      ? `${sourceClass?.stream_name} – Section ${newSectionLetter || "?"} (${targetSessionName})`
                      : selectedTargetClassObject
                      ? `${selectedTargetClassObject.name} (${targetSessionName})`
                      : "selected destination"}
                  </strong>
                  .
                  {transferMode === "session" && (
                    <span className="block mt-1 text-blue-700 dark:text-blue-300 font-semibold">
                      • Student profiles will be officially updated to Academic Session {targetSessionName}.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={transferMutation.isPending}
            className="rounded-xl font-bold text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmTransfer}
            disabled={
              isLoading ||
              transferMutation.isPending ||
              selectedUserIds.length === 0 ||
              (!isCreatingNewSection && !targetClassId) ||
              (isCreatingNewSection && !newSectionLetter.trim())
            }
            className="rounded-xl font-bold text-xs gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            {transferMutation.isPending ? (
              <>
                <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Transferring...
              </>
            ) : (
              <>
                <ArrowRightLeft className="size-3.5" />
                Confirm Transfer ({selectedUserIds.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ClassStudentTransferDialog;
