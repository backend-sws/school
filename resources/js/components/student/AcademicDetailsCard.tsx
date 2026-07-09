import React from "react";
import { GraduationCap, History } from "lucide-react";
import Each from "@/components/Each";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoGridCard } from "@/components/student/InfoGridCard";
import {
  ACADEMIC_CURRENT_FIELDS,
  ACADEMIC_ID_FIELDS,
  PREVIOUS_EDUCATION_META,
  STUDENT_DASHBOARD_LABELS,
} from "@/constants/page/studentDashboard";
import type { AcademicFieldItem, StudentDashboardLabels } from "@/constants/page/studentDashboard";

interface LastAcademic {
  id: number;
  institute_name: string;
  session: string;
  class: string;
  section: string;
  roll_number: string;
}

interface AcademicRecord {
  university_roll_no?: string;
  roll_no?: string;
  reg_no?: string;
  app_no?: string;
  stream_name?: string;
  subject_name?: string;
  session_name?: string;
  current_semester?: number;
  college_name?: string;
  admission_date?: string;
  last_academic?: LastAcademic[];
}

interface AcademicDetailsCardProps {
  academicRecord: AcademicRecord;
  isLoading?: boolean;
  /** When provided (e.g. from getStudentDashboardConfig), use these instead of default fields. */
  currentFields?: readonly AcademicFieldItem[];
  idFields?: readonly AcademicFieldItem[];
  labels?: Partial<StudentDashboardLabels>;
}

const PreviousEducationLoader = () => (
  <div className="space-y-2.5">
    {[1, 2].map((i) => (
      <div key={i} className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    ))}
  </div>
);

export function AcademicDetailsCard({
  academicRecord,
  isLoading = false,
  currentFields,
  idFields,
  labels: labelsOverride,
}: AcademicDetailsCardProps) {
  const lastAcademic = academicRecord.last_academic ?? [];
  const labels = { ...STUDENT_DASHBOARD_LABELS, ...labelsOverride };
  const currentFieldsToUse = currentFields ?? ACADEMIC_CURRENT_FIELDS;
  const idFieldsToUse = idFields ?? ACADEMIC_ID_FIELDS;

  return (
    <InfoGridCard
      icon={GraduationCap}
      title={labels.academicCardTitle}
      data={academicRecord as Record<string, unknown>}
      groups={[
        { fields: currentFieldsToUse },
        { fields: idFieldsToUse, bg: "bg-muted/20", mono: true },
      ]}
      isLoading={isLoading}
    >
      {lastAcademic.length > 0 && (
        <div className="border-t border-border px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <History size={13} className="text-muted-foreground" />
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              {labels.academicPreviousEducationTitle}
            </p>
          </div>
          <div className="space-y-2.5">
            <Each
              of={lastAcademic}
              keyExtractor={(item) => String(item.id)}
              isLoading={isLoading}
              fallback={<PreviousEducationLoader />}
              nodatafound={null}
              render={(record: LastAcademic) => (
                <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">
                    {record.institute_name}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <Each
                      of={[...PREVIOUS_EDUCATION_META]}
                      keyExtractor={(item) => item.key}
                      fallback={null}
                      render={({ label, key }) => (
                        <span className="inline-flex items-center gap-1 rounded-md bg-background border border-border/60 px-2 py-0.5 text-xs">
                          <span className="text-muted-foreground">
                            {label}:
                          </span>
                          <span className="font-medium">
                            {record[key as keyof LastAcademic]}
                          </span>
                        </span>
                      )}
                    />
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )}
    </InfoGridCard>
  );
}
