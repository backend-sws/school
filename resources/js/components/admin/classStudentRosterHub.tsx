import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Search,
  BookOpen,
  Calendar,
  FileText,
  UploadCloud,
  Eye,
  CheckCircle2,
  XCircle,
  GraduationCap,
  ArrowUpDown,
  Filter,
  Layers,
  Sparkles,
  UserCheck,
  UserX,
  Phone,
  School,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import { cn } from "@/lib/utils";
import { StudentClassProfileDrawer } from "./studentClassProfileDrawer";
import { StudentLeaveUploadDialog } from "./studentLeaveUploadDialog";

interface ClassStudentRosterHubProps {
  classId: number;
  className?: string;
}

export function ClassStudentRosterHub({ classId, className }: ClassStudentRosterHubProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"roll" | "attendance" | "tests">("roll");
  const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string } | null>(null);
  const [leaveUploadStudent, setLeaveUploadStudent] = useState<{ id: number; name: string } | null>(null);

  const { data: rosterRes, isLoading, refetch } = useQuery({
    queryKey: ["lms-class-students-summary", classId],
    queryFn: () => lmsApi.studentRoster.summary(classId),
    enabled: !!classId,
  });

  const rosterData = (rosterRes as any)?.data;
  const stats = rosterData?.stats;
  const students = (rosterData?.students ?? []) as any[];

  // Filter & Sort
  const filteredStudents = useMemo(() => {
    let list = students.filter((s) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        String(s.roll_no || "").toLowerCase().includes(q) ||
        String(s.reg_no || "").toLowerCase().includes(q)
      );
    });

    list.sort((a, b) => {
      if (sortBy === "attendance") {
        return (b.attendance?.percentage ?? 0) - (a.attendance?.percentage ?? 0);
      }
      if (sortBy === "tests") {
        return (b.tests?.completion_rate ?? 0) - (a.tests?.completion_rate ?? 0);
      }
      // default roll number
      const rollA = parseInt(a.roll_no, 10) || 999999;
      const rollB = parseInt(b.roll_no, 10) || 999999;
      return rollA - rollB;
    });

    return list;
  }, [students, search, sortBy]);

  return (
    <div className="space-y-6">
      {/* ── KPI Highlight Header Cards ────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-primary/10 via-card to-background shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Users className="size-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Enrolled Students
              </p>
              <p className="text-2xl font-black text-foreground">
                {stats?.total_students ?? students.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-emerald-500/10 via-card to-background shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <Calendar className="size-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Class Avg. Attendance
              </p>
              <p className="text-2xl font-black text-emerald-600">
                {stats?.average_class_attendance ?? 0}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-blue-500/10 via-card to-background shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
              <BookOpen className="size-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Class Tests
              </p>
              <p className="text-2xl font-black text-blue-600">
                {stats?.total_class_tests ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-purple-500/10 via-card to-background shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
              <GraduationCap className="size-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Active Session Records
              </p>
              <p className="text-2xl font-black text-purple-600">
                Preserved
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Search & Sorting Toolbar ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search student by name, roll number, or reg. no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-background border-border/80 h-10 text-xs font-medium"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground hidden md:inline">Sort by:</span>
          <div className="flex items-center rounded-xl bg-muted/40 p-1 border border-border/60">
            <button
              type="button"
              onClick={() => setSortBy("roll")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-lg transition-colors",
                sortBy === "roll" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Roll No
            </button>
            <button
              type="button"
              onClick={() => setSortBy("attendance")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-lg transition-colors",
                sortBy === "attendance" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Attendance %
            </button>
            <button
              type="button"
              onClick={() => setSortBy("tests")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-lg transition-colors",
                sortBy === "tests" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Tests %
            </button>
          </div>
        </div>
      </div>

      {/* ── Student Roster Grid ───────────────────────────────────── */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/5">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="font-semibold text-xs">Loading classroom student 360 roster...</p>
          </div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/5 py-16 text-center">
          <Users className="size-12 text-muted-foreground/40 mb-3" />
          <h4 className="text-base font-bold text-foreground">No Enrolled Students Found</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {search ? "No students matching your search criteria." : "No students currently enrolled in this class."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredStudents.map((s: any) => {
            const atndPct = s.attendance?.percentage ?? 0;
            const testPct = s.tests?.completion_rate ?? 0;

            return (
              <div
                key={s.user_id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl border border-border/70 bg-card hover:border-primary/50 hover:shadow-md transition-all"
              >
                {/* Student Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative size-13 shrink-0 rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center shadow-sm">
                    {s.photo_url ? (
                      <img src={s.photo_url} alt={s.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-black text-sm text-primary uppercase">
                        {s.name?.slice(0, 2)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors truncate">
                        {s.name}
                      </h4>
                      {s.roll_no && (
                        <Badge variant="secondary" className="font-bold text-xs bg-primary/10 text-primary border border-primary/20">
                          Roll #{s.roll_no}
                        </Badge>
                      )}
                      {s.reg_no && (
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          (Reg: {s.reg_no})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      {s.father_name && <span>Father: {s.father_name}</span>}
                      {s.mobile && (
                        <span className="flex items-center gap-1">
                          <Phone className="size-3 text-muted-foreground" />
                          {s.mobile}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance Trackers: Attendance & Tests */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6 items-center shrink-0">
                  {/* Attendance Meter */}
                  <div className="space-y-1 min-w-[120px]">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-semibold">Attendance</span>
                      <span className="font-black text-emerald-600">{atndPct}%</span>
                    </div>
                    <Progress value={atndPct} className="h-2 rounded-full bg-muted border border-border/40" />
                    <p className="text-[10px] text-muted-foreground">
                      {s.attendance?.present ?? 0}/{s.attendance?.total_marked ?? 0} days present
                    </p>
                  </div>

                  {/* LMS Tests Meter */}
                  <div className="space-y-1 min-w-[120px]">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-semibold">LMS Tests</span>
                      <span className="font-black text-blue-600">{testPct}%</span>
                    </div>
                    <Progress value={testPct} className="h-2 rounded-full bg-muted border border-border/40" />
                    <p className="text-[10px] text-muted-foreground">
                      {s.tests?.completed ?? 0}/{s.tests?.total_assigned ?? 0} tests completed
                    </p>
                  </div>

                  {/* Physical Leaves Badge & Quick Upload */}
                  <div className="col-span-2 sm:col-span-1 flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-1.5">
                    <Badge variant="outline" className="text-xs font-bold gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30">
                      <FileText className="size-3 text-amber-600" />
                      {s.leaves?.applied_count ?? 0} Leave Slips
                    </Badge>
                    <button
                      type="button"
                      onClick={() => setLeaveUploadStudent({ id: s.user_id, name: s.name })}
                      className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <UploadCloud className="size-3" />
                      + Upload Slip
                    </button>
                  </div>
                </div>

                {/* 360 Action Button */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                  <Button
                    size="sm"
                    onClick={() => setSelectedStudent({ id: s.user_id, name: s.name })}
                    className="h-9 rounded-xl font-bold text-xs gap-1.5 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Eye className="size-4" />
                    360° Profile & Vault
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Student 360° Drawer Modal ─────────────────────────────── */}
      <StudentClassProfileDrawer
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        userId={selectedStudent?.id}
        classId={classId}
        studentName={selectedStudent?.name}
      />

      {/* ── Quick Leave Upload Modal ──────────────────────────────── */}
      {leaveUploadStudent && (
        <StudentLeaveUploadDialog
          open={!!leaveUploadStudent}
          onClose={() => setLeaveUploadStudent(null)}
          classId={classId}
          userId={leaveUploadStudent.id}
          studentName={leaveUploadStudent.name}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
