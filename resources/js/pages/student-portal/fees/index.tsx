import React from 'react';
import { Head } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Receipt } from "lucide-react";
import { useRegisterGuide } from '@/components/GuideProvider';
import { STUDENT_FEES_GUIDE } from "@/constants/guides/studentPortal";
import StudentLedgerDetail from "@/pages/accounts/fee-hub/components/StudentLedgerDetail";

const AVAILABLE_FEES_BREADCRUMBS = [
  { title: "My Portal", href: "/student-portal/dashboard" },
  { title: "Financial Ledger", href: "/student-portal/fees" },
];

const AvailableFeesIndex = () => {
  useRegisterGuide(STUDENT_FEES_GUIDE);

  return (
    <>
      <Head title="Financial Ledger" />
      <div className="p-4 sm:p-6 space-y-6">
        <MainPageHeader
          id="student-fees-header"
          breadcrumbs={AVAILABLE_FEES_BREADCRUMBS}
          icon={Receipt}
          title="My Financial Ledger"
          subtitle="View your complete fee matrix, dues, and payment history in one place."
        />

        <StudentLedgerDetail isStudentPortal={true} />
      </div>
    </>
  );
};

export default AvailableFeesIndex;
