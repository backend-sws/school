import { Head } from "@inertiajs/react";
import { EXAM_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Printer, Award } from "lucide-react";
import { GurukulReportCard } from "@/components/examination/GurukulReportCard";

interface MarksheetShowProps {
  marksheet: any;
  exam: any;
  student: any;
  reportCardInstitution?: any;
  institution?: any;
}

export default function MarksheetShow({ marksheet, exam, student, reportCardInstitution, institution }: MarksheetShowProps) {
  const studentName = student?.name || student?.user?.name || "RAJVEER KUMAR GUPTA";
  const inst = reportCardInstitution || institution;

  return (
    <>
      <Head title={`Report Card: ${studentName} - ${exam?.name || 'Exam'}`} />
      
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
            ...EXAM_LIST_BREADCRUMBS,
            { title: exam?.name || "Exam", href: `/examination/exams/${exam?.id || ''}` },
            { title: "Report Card", href: "#" }
          ]}
          icon={Award}
          title={`${studentName}'s Annual Report Card`}
          subtitle={`${exam?.name || 'Exam'} - ${exam?.term?.name ?? "Academic Session"}`}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => window.print()} className="h-10">
            <Printer className="size-4 mr-2" />
            Print Report Card
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
