import React from "react";
import { Users } from "lucide-react";
import { InfoGridCard } from "@/components/student/InfoGridCard";
import {
  PERSONAL_GUARDIAN_FIELDS,
  STUDENT_DASHBOARD_LABELS,
} from "@/constants/page/studentDashboard";

interface PersonalGuardianCardProps {
  personalInfo: Record<string, string | undefined>;
  isLoading?: boolean;
}

export function PersonalGuardianCard({
  personalInfo,
  isLoading = false,
}: PersonalGuardianCardProps) {
  return (
    <InfoGridCard
      icon={Users}
      title={STUDENT_DASHBOARD_LABELS.guardianCardTitle}
      data={personalInfo}
      groups={[{ fields: PERSONAL_GUARDIAN_FIELDS }]}
      isLoading={isLoading}
    />
  );
}
