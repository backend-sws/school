import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import AdmissionApi from "@/lib/api/student/admissionApi";
import { StudentProfileQueryKeys } from "@/lib/querykey/studentProfile";
import { type BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from 'react';
import type { SharedData } from "@/types";
import {
  STUDENT_DASHBOARD_BREADCRUMBS,
  GREETING_HOURS,
  GREETING_LABELS,
  getStudentDashboardConfig,
} from "@/constants/page/studentDashboard";
import { useCan } from "@/hooks/use-can";
import { LayoutGrid } from "lucide-react";

import { ProfileBanner } from "@/components/student/ProfileBanner";
import { QuickInfoStrip } from "@/components/student/QuickInfoStrip";
import { PersonalGuardianCard } from "@/components/student/PersonalGuardianCard";
import { AcademicDetailsCard } from "@/components/student/AcademicDetailsCard";
import { AddressesCard } from "@/components/student/AddressesCard";
import { VerifiedDocumentsCard } from "@/components/student/VerifiedDocumentsCard";
import { NoticeBoardCard } from "@/components/student/NoticeBoardCard";
import { useRegisterGuide } from '@/components/GuideProvider';
import { STUDENT_DASHBOARD_GUIDE } from "@/constants/guides/studentPortal";
;

const breadcrumbs: BreadcrumbItem[] = [...STUDENT_DASHBOARD_BREADCRUMBS];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < GREETING_HOURS.morningEnd) return GREETING_LABELS.morning;
  if (hour < GREETING_HOURS.afternoonEnd) return GREETING_LABELS.afternoon;
  return GREETING_LABELS.evening;
};

const formatDate = () =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/* ── Main component ────────────────────────────────────── */

const StudentDashboard = () => {
useRegisterGuide(STUDENT_DASHBOARD_GUIDE);

  const { auth } = usePage<SharedData>().props;
  const effectiveUserId = auth?.effective_user?.id ?? auth?.user?.id;

  const useSchoolConfig = useCan("use_school_student_dashboard");
  const config = useMemo(
    () => getStudentDashboardConfig(useSchoolConfig ? "school" : "college"),
    [useSchoolConfig]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: [...StudentProfileQueryKeys.profile, effectiveUserId],
    queryFn: async () => {
      const res = await AdmissionApi.studentProfile();
      return res.data?.data ?? res.data;
    },
    enabled: !!effectiveUserId,
  });

  const personal_info = data?.personal_info;
  const academic_record = data?.academic_record;
  const addresses = data?.addresses || [];
  const documents = data?.documents || [];

  return (
    <>
      <Head title="Student Dashboard" />

      <div className="flex flex-col gap-5 p-4 ">
        <MainPageHeader
          id="student-dashboard-header"
          breadcrumbs={breadcrumbs}
          icon={LayoutGrid}
          title={isLoading ? "Dashboard" : `${getGreeting()}, ${personal_info?.name?.split(" ")[0] || "Student"}`}
          subtitle={`${formatDate()} — Your academic profile and key details at a glance.`}
        />

        {/* ── Profile Banner ────────────────────── */}
        <ProfileBanner
          name={personal_info?.name}
          email={personal_info?.email}
          photo_url={personal_info?.photo_url}
          signature_url={personal_info?.signature_url}
          active_status={personal_info?.active_status}
          isLoading={isLoading}
        />

        {/* ── Quick Info Strip (mixed personal + academic; config by institution type) ── */}
        {!error && (
          <QuickInfoStrip
            items={config.quickInfoStripItems}
            university_roll_no={academic_record?.university_roll_no}
            current_semester={academic_record?.current_semester}
            session_name={academic_record?.session_name}
            roll_no={academic_record?.roll_no}
            stream_name={academic_record?.stream_name}
            category={personal_info?.category}
            dob={personal_info?.dob}
            gender={personal_info?.gender}
            mobile={personal_info?.mobile}
            isLoading={isLoading}
          />
        )}

        {/* ── Detail Grid ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-5">
            <PersonalGuardianCard
              personalInfo={personal_info ?? {}}
              isLoading={isLoading}
            />

            <AcademicDetailsCard
              academicRecord={academic_record ?? {}}
              isLoading={isLoading}
              currentFields={config.academicCurrentFields}
              idFields={config.academicIdFields}
              labels={config.labels}
            />

            <AddressesCard
              addresses={addresses}
              isLoading={isLoading}
            />
          </div>

          {/* Right column — equal height cards */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <VerifiedDocumentsCard
              documents={documents}
              isLoading={isLoading}
              className="flex-1"
            />
            <NoticeBoardCard className="flex-1" />
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
