import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import { GurukulReportCard } from "@/components/examination/GurukulReportCard";

interface BulkPrintProps {
  exam: any;
  marksheets: {
    marksheet: any;
    student: any;
    institution?: any;
  }[];
}

export default function BulkPrint({ exam, marksheets }: BulkPrintProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head title={`Bulk Print: ${exam.name}`} />
      
      <style dangerouslySetInnerHTML={{__html: `
        @page {
          size: A4 portrait;
          margin: 4mm 6mm;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body { background: white !important; }
          .page-break { page-break-after: always; break-after: page; page-break-inside: avoid; break-inside: avoid; }
          .page-break:last-child { page-break-after: auto; break-after: auto; }
          #theme-root > div:last-child { display: none !important; }
          .printable-marksheet {
            border: 1px solid #000 !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 10px !important;
            margin: 0 auto !important;
          }
        }
      `}} />

      <div className="bg-white min-h-screen text-black print:bg-transparent p-4">
        {marksheets.map((item, index) => (
          <div key={item.student.id || index} className="page-break max-w-5xl mx-auto mb-10 print:mb-0">
            <GurukulReportCard
              institution={item.reportCardInstitution || item.institution}
              student={item.student}
              exam={exam}
              marksheet={item.marksheet}
            />
          </div>
        ))}
      </div>
    </>
  );
}

BulkPrint.layout = (page: React.ReactNode) => <>{page}</>;
