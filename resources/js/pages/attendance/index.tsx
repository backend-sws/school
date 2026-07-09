import React, { useState, useMemo } from 'react';
import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card } from "@/components/ui/card";
import Each from "@/components/Each";
import {
  ATTENDANCE_BREADCRUMBS,
  ATTENDANCE_GUIDELINES,
} from "@/constants/page/admin/attendance";
import {
  CalendarCheck,
  CalendarIcon,
  ClipboardCheck,
  ArrowRight,
  FileText,
  BarChart3,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { AttendanceSheet } from "@/components/admin/attendanceSheet";
import { PermissionGate } from "@/components/PermissionGate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import attendanceApi from "@/lib/api/attendanceApi";
import { useRegisterGuide } from '@/components/GuideProvider';
import { ATTENDANCE_DASHBOARD_GUIDE } from "@/constants/guides/attendance";

export default function AttendanceIndex() {
  const [sheetOpen, setSheetOpen] = useState(false);
  useRegisterGuide(ATTENDANCE_DASHBOARD_GUIDE);
  const [sheetMode, setSheetMode] = useState<"marking" | "reporting">("marking");

  // Class & Subject selection state (lives on this page now)
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>();
  const [selectedAllocationId, setSelectedAllocationId] = useState<number | undefined>();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Fetch classes
  const { data: classesRes, isLoading: classesLoading } = useQuery({
    queryKey: ["attendance-classes"],
    queryFn: () => attendanceApi.classes({ all: true }),
  });

  const classes = useMemo(() => {
    const raw = (classesRes as { data?: unknown[] } | undefined)?.data;
    if (Array.isArray(raw)) return raw as { id: number; name: string }[];
    if (Array.isArray(classesRes)) return classesRes as unknown as { id: number; name: string }[];
    return [];
  }, [classesRes]);

  // Fetch allocations for selected class
  const { data: allocationsRes, isLoading: allocationsLoading } = useQuery({
    queryKey: ["attendance-allocations", selectedClassId],
    queryFn: () => attendanceApi.allocationsForClass(selectedClassId!),
    enabled: !!selectedClassId,
  });

  const allocations = useMemo(() => {
    const raw = (allocationsRes as { data?: unknown[] } | undefined)?.data;
    if (Array.isArray(raw)) return raw as { id: number; subject: { name: string } | null }[];
    if (Array.isArray(allocationsRes)) return allocationsRes as unknown as { id: number; subject: { name: string } | null }[];
    return [];
  }, [allocationsRes]);

  const openSheet = (mode: "marking" | "reporting") => {
    if (!selectedClassId) return;
    setSheetMode(mode);
    setSheetOpen(true);
  };

  return (
    <>
      <Head title="Attendance Management" />
      <MainPageHeader
        id="attendance-header"
        breadcrumbs={ATTENDANCE_BREADCRUMBS}
        icon={CalendarCheck}
        title="Attendance Center"
        subtitle="Precision tracking and reporting for institutional attendance"
        guidance={ATTENDANCE_GUIDELINES}
      />

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Class & Subject Selection */}
        <Card className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1 space-y-1.5" id="class-selector">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</label>
              <Select
                value={selectedClassId?.toString()}
                onValueChange={(v) => {
                  setSelectedClassId(parseInt(v));
                  setSelectedAllocationId(undefined);
                }}
              >
                <SelectTrigger className="h-10 rounded-xl border-border bg-background font-medium">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {classesLoading ? (
                    <div className="flex items-center justify-center p-4 gap-2">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Loading...</span>
                    </div>
                  ) : (
                    <Each
                      of={classes}
                      render={(c: { id: number; name: string }) => (
                        <SelectItem key={c.id} value={c.id.toString()} className="font-medium">
                          {c.name}
                        </SelectItem>
                      )}
                    />
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
              <Select
                value={selectedAllocationId?.toString() || "class"}
                onValueChange={(v) => setSelectedAllocationId(v === "class" ? undefined : parseInt(v))}
                disabled={!selectedClassId}
              >
                <SelectTrigger className="h-10 rounded-xl border-border bg-background font-medium">
                  <SelectValue placeholder="General (Class Level)" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="class" className="font-semibold text-xs">
                    General (Class Level)
                  </SelectItem>
                  <Separator className="my-1" />
                  {allocationsLoading ? (
                    <div className="flex items-center justify-center p-4 gap-2">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Loading...</span>
                    </div>
                  ) : (
                    <Each
                      of={allocations}
                      render={(a: { id: number; subject: { name: string } | null }) => (
                        <SelectItem key={a.id} value={a.id.toString()} className="font-medium">
                          {a.subject?.name || "Unknown"}
                        </SelectItem>
                      )}
                    />
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  className="flex h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2 text-sm font-medium text-foreground focus-visible:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <PermissionGate can="mark_attendance">
                <Button
                  id="mark-attendance-btn"
                  className="h-10 rounded-xl bg-primary text-primary-foreground font-semibold px-5"
                  onClick={() => openSheet("marking")}
                  disabled={!selectedClassId}
                >
                  <ClipboardCheck className="size-4 mr-2" />
                  Mark Attendance
                </Button>
              </PermissionGate>
              <PermissionGate can="view_attendance">
                <Button
                  variant="outline"
                  className="h-10 rounded-xl font-semibold px-5 border-border"
                  onClick={() => openSheet("reporting")}
                  disabled={!selectedClassId}
                >
                  <FileText className="size-4 mr-2" />
                  View Register
                </Button>
              </PermissionGate>
            </div>
          </div>
        </Card>

        {/* Report Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportLinkCard
            title="Daily Register"
            description="Examine detailed daily logs across classes"
            onClick={() => { if (selectedClassId) openSheet("reporting"); }}
            icon={FileText}
          />
          <ReportLinkCard
            title="Analytics & Compliance"
            description="Monitor 75% threshold and eligibility trends"
            href="/attendance/reports/summary"
            icon={BarChart3}
          />
        </div>
      </div>

      <AttendanceSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        initialClassId={selectedClassId}
        initialAllocationId={selectedAllocationId}
        initialDate={selectedDate}
        mode={sheetMode}
      />
    </>
  );
}

function ReportLinkCard({ title, description, href, onClick, icon: Icon }: { title: string; description: string; href?: string; onClick?: () => void; icon: React.ElementType }) {
  const content = (
    <Card className="h-full border border-border hover:border-primary/20 bg-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex flex-col h-full justify-between gap-6">
        <div className="space-y-4">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="flex items-center text-sm font-bold text-primary/50 group-hover:text-primary transition-colors">
          Explore <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Card>
  );

  if (onClick) {
    return (
      <Button variant="ghost" onClick={onClick} className="block group w-full p-0 h-auto hover:bg-transparent border-none">
        {content}
      </Button>
    );
  }

  return (
    <Button asChild variant="ghost" className="block group w-full p-0 h-auto hover:bg-transparent border-none">
      <Link href={href || "#"}>
        {content}
      </Link>
    </Button>
  );
}
