import React, { useMemo, useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Each from "@/components/Each";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  BookOpen,
  Loader2,
  Search,
  User2,
  Save,
  Users,
} from "lucide-react";
import lmsApi from "@/lib/api/lmsApi";
import StaffApi from "@/lib/api/staffApi";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubjectTeacherSheetProps {
  open: boolean;
  onClose: () => void;
  classId: number;
}

type AllocationRow = {
  id: number;
  subject: { id: number; name: string; code?: string | null } | null;
  instructor: { id: number; name: string } | null;
};

type TeacherOption = { id: number; name: string };

export function SubjectTeacherSheet({ open, onClose, classId }: SubjectTeacherSheetProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [changes, setChanges] = useState<Record<number, number | null>>({});

  // ─── Fetch allocations ───────────────────────────────────
  const { data: allocationsRes, isLoading: allocationsLoading } = useQuery({
    queryKey: LmsClassesQueryKeys.allocations(classId),
    queryFn: () => lmsApi.classes.allocations(classId),
    enabled: open && !!classId,
  });

  const allocations = useMemo(() => {
    const raw = (allocationsRes as { data?: AllocationRow[] })?.data ?? (allocationsRes as AllocationRow[]) ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [allocationsRes]);

  // ─── Fetch teachers ──────────────────────────────────────
  const { data: usersRes, isLoading: usersLoading } = useQuery({
    queryKey: ["staff-list-subject-teacher-sheet"],
    queryFn: () => StaffApi.listStaff({ per_page: 200 }),
    enabled: open,
  });

  const teachers: TeacherOption[] = useMemo(() => {
    const raw = (usersRes as { data?: TeacherOption[] })?.data ?? (usersRes as TeacherOption[]) ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [usersRes]);

  // ─── Filter allocations by search ────────────────────────
  const filteredAllocations = useMemo(() => {
    if (!searchQuery.trim()) return allocations;
    const q = searchQuery.toLowerCase();
    return allocations.filter(
      (a) =>
        a.subject?.name?.toLowerCase().includes(q) ||
        a.subject?.code?.toLowerCase().includes(q) ||
        a.instructor?.name?.toLowerCase().includes(q),
    );
  }, [allocations, searchQuery]);

  // ─── Get the current teacher for an allocation ───────────
  const getTeacherId = useCallback(
    (alloc: AllocationRow): string => {
      if (alloc.id in changes) {
        return changes[alloc.id] !== null ? String(changes[alloc.id]) : "none";
      }
      return alloc.instructor ? String(alloc.instructor.id) : "none";
    },
    [changes],
  );

  const handleTeacherChange = (allocationId: number, value: string) => {
    const teacherId = value === "none" ? null : Number(value);
    setChanges((prev) => ({ ...prev, [allocationId]: teacherId }));
  };

  const hasChanges = Object.keys(changes).length > 0;

  // ─── Batch save mutation ─────────────────────────────────
  const { mutate: saveAll, isPending: saving } = useMutation({
    mutationFn: async () => {
      const entries = Object.entries(changes);
      await Promise.all(
        entries.map(([allocId, teacherId]) =>
          lmsApi.allocations.update(Number(allocId), {
            instructor_id: teacherId,
          }),
        ),
      );
    },
    onSuccess: () => {
      toast.success("Subject teachers updated successfully");
      queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.allocations(classId) });
      queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.detail(classId) });
      setChanges({});
      onClose();
    },
    onError: () => {
      toast.error("Failed to update subject teachers");
    },
  });

  const isLoading = allocationsLoading || usersLoading;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="sm:max-w-3xl w-full p-0 flex flex-col overflow-hidden">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="border-b px-6 py-5 space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold">Assign Subject Teachers</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Select a teacher for each subject in this class
              </SheetDescription>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* ── Table ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="divide-y">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_1fr] gap-4 px-6 py-3 bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Subject</span>
                <span>Assigned Teacher</span>
              </div>

              <Each
                of={filteredAllocations}
                keyExtractor={(alloc: AllocationRow) => alloc.id}
                render={(alloc: AllocationRow) => {
                  const isChanged = alloc.id in changes;
                  return (
                    <div
                      className={cn(
                        "grid grid-cols-[1fr_1fr] gap-4 px-6 py-3 items-center transition-colors",
                        isChanged && "bg-primary/5",
                      )}
                    >
                      {/* Subject column */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                          <BookOpen className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{alloc.subject?.name ?? "—"}</p>
                          {alloc.subject?.code && (
                            <p className="text-xs text-muted-foreground font-mono uppercase">{alloc.subject.code}</p>
                          )}
                        </div>
                      </div>

                      {/* Teacher dropdown */}
                      <Select value={getTeacherId(alloc)} onValueChange={(v) => handleTeacherChange(alloc.id, v)}>
                        <SelectTrigger className="h-9 text-sm">
                          <div className="flex items-center gap-2">
                            <User2 className="size-3.5 text-muted-foreground shrink-0" />
                            <SelectValue placeholder="Select teacher" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            <span className="text-muted-foreground">None</span>
                          </SelectItem>
                          <Each
                            of={teachers}
                            keyExtractor={(t: TeacherOption) => t.id}
                            render={(t: TeacherOption) => (
                              <SelectItem value={String(t.id)}>{t.name}</SelectItem>
                            )}
                          />
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }}
              />

              {filteredAllocations.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <BookOpen className="size-8 mb-2 opacity-40" />
                  <p className="text-sm font-medium">No subjects found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────── */}
        <div className="border-t px-6 py-4 flex items-center justify-between bg-background">
          <p className="text-xs text-muted-foreground">
            {hasChanges
              ? `${Object.keys(changes).length} subject${Object.keys(changes).length > 1 ? "s" : ""} modified`
              : "No changes"}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button size="sm" disabled={!hasChanges || saving} onClick={() => saveAll()}>
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-1.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
