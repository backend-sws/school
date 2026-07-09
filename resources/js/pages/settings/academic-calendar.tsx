import React, { useEffect, useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import SettingsLayout from "@/layouts/settings/layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import academicCalendarApi, {
  type AcademicCalendarSettings,
} from "@/lib/api/academicCalendarApi";
import { AcademicCalendarQueryKeys } from "@/lib/querykey/academicCalendar";
import { useRegisterGuide } from "@/components/GuideProvider";
import { ACADEMIC_CALENDAR_GUIDE } from "@/constants/guides/settings";
import { useAuth } from "@/hooks/use-can";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const breadcrumbs = [
  { title: "Settings", href: "/settings/profile" },
  { title: "Academic Calendar", href: "/settings/academic-calendar" },
];

const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function AcademicCalendarSettingsPage() {
  useRegisterGuide(ACADEMIC_CALENDAR_GUIDE);
  const queryClient = useQueryClient();
  const { can } = useAuth();
  const canUpdate = can("update_academic_calendar_settings");

  const [sessionStartMonth, setSessionStartMonth] = useState(4);
  const [syncCurrentSession, setSyncCurrentSession] = useState(false);

  const { data: res, isLoading } = useQuery({
    queryKey: AcademicCalendarQueryKeys.settings(1),
    queryFn: () => academicCalendarApi.getSettings({ duration_years: 1 }),
  });

  const settings = (res as { data?: AcademicCalendarSettings })?.data ?? res?.data;

  useEffect(() => {
    if (settings?.session_start_month) {
      setSessionStartMonth(settings.session_start_month);
    }
  }, [settings]);

  const previewSession = useMemo(() => {
    const now = new Date();
    const month = sessionStartMonth;
    const startYear = now.getMonth() + 1 < month ? now.getFullYear() - 1 : now.getFullYear();
    return `${startYear}-${startYear + 1}`;
  }, [sessionStartMonth]);

  const updateMutation = useMutation({
    mutationFn: () =>
      academicCalendarApi.updateSettings({
        session_start_month: sessionStartMonth,
        sync_current_session: syncCurrentSession,
        duration_years: 1,
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: AcademicCalendarQueryKeys.all });
      setSyncCurrentSession(false);
      toast.success(data?.message ?? "Academic calendar settings saved.");
    },
    onError: () => toast.error("Failed to save academic calendar settings."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpdate) return;
    updateMutation.mutate();
  };

  if (isLoading) {
    return (
      <SettingsLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
        </div>
      </SettingsLayout>
    );
  }

  return (
    <>
      <Head title="Academic Calendar" />
      <SettingsLayout>
        <PageContainer maxWidth="full">
          <MainPageHeader
            id="academic-calendar-header"
            breadcrumbs={breadcrumbs}
            icon={Calendar}
            title="Academic Calendar"
            subtitle="Set when your institution's academic year begins."
            tip="This setting drives automatic current-session detection and default values when creating new sessions."
          />

          <form
            id="academic-calendar-form"
            onSubmit={handleSubmit}
            className="space-y-8 pb-10 max-w-2xl"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 border-b pb-1.5">
                Session start month
              </h3>
              <p className="text-sm text-muted-foreground">
                If today is before the start month, the previous calendar year is treated as the active session start.
              </p>

              <div className="space-y-2">
                <Label htmlFor="session_start_month">Academic year begins in</Label>
                <Select
                  value={String(sessionStartMonth)}
                  onValueChange={(v) => setSessionStartMonth(Number(v))}
                  disabled={!canUpdate}
                >
                  <SelectTrigger id="session_start_month">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_OPTIONS.map((month) => (
                      <SelectItem key={month.value} value={String(month.value)}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Live preview</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>
                  Today → expected session:{" "}
                  <span className="font-semibold text-foreground">{previewSession}</span>
                </p>
                {settings?.expected_session?.name &&
                  settings.expected_session.name !== previewSession && (
                    <p className="text-xs">
                      Saved setting currently resolves to: {settings.expected_session.name}
                    </p>
                  )}
              </CardContent>
            </Card>

            {canUpdate && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sync_current_session"
                  checked={syncCurrentSession}
                  onCheckedChange={(checked) => setSyncCurrentSession(checked === true)}
                />
                <Label htmlFor="sync_current_session" className="font-normal cursor-pointer">
                  Set matching session as current after saving
                </Label>
              </div>
            )}

            {canUpdate && (
              <div className="flex justify-end">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="size-4 mr-2" />
                  )}
                  Save settings
                </Button>
              </div>
            )}
          </form>
        </PageContainer>
      </SettingsLayout>
    </>
  );
}
