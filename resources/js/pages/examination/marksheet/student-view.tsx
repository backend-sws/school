import { Head } from "@inertiajs/react";
import { STUDENT_PORTAL_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Download, Award } from "lucide-react";
import { GurukulReportCard } from "@/components/examination/GurukulReportCard";

interface StudentMarksheetViewProps {
  marksheet: any;
  exam: any;
  student: any;
  reportCardInstitution?: any;
  institution?: any;
}

export default function StudentMarksheetView({ marksheet, exam, student, reportCardInstitution, institution }: StudentMarksheetViewProps) {
  const studentName = student?.name || student?.user?.name || "RAJVEER KUMAR GUPTA";
  const inst = reportCardInstitution || institution;

  return (
    <>
      <Head title={`Annual Report Card: ${exam?.name || 'Exam'}`} />
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          aside, nav, header, button, [data-sidebar], .no-print, .MainPageHeader {
            display: none !important;
          }
          html, body, #theme-root, #app, main, .space-y-6 {
            background: white !important;
            color: black !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .printable-marksheet-wrapper {
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}} />

      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...STUDENT_PORTAL_BREADCRUMBS,
            { title: "Annual Report Card", href: "#" }
          ]}
          icon={Award}
          title={exam?.name || "Exam"}
          subtitle={`Annual Evaluation Report Card`}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="size-4 mr-2" />
            Print / Download Report Card
          </Button>
        </div>

        <div className="printable-marksheet-wrapper flex justify-center w-full">
          <div className="max-w-5xl w-full mx-auto">
            <GurukulReportCard
              institution={inst}
              student={student}
              exam={exam}
              marksheet={marksheet}
            />
          </div>
        </div>
      </div>
    </>
  );
}
