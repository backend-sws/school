import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import { GurukulAdmitCard, AdmitCardScheduleItem } from "@/components/examination/GurukulAdmitCard";

interface AdmitCardPrintProps {
  exam: any;
  lmsClass: any;
  admitCards: {
    student: any;
    schedules: AdmitCardScheduleItem[];
    institution?: any;
  }[];
}

export default function AdmitCardsPrint({ exam, lmsClass, admitCards }: AdmitCardPrintProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head title={`Admit Cards - ${lmsClass?.name} (${exam?.name})`} />

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
            border: 2px solid #000 !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 10px !important;
            margin: 0 auto !important;
          }
        }
      `}} />

      <div className="bg-white min-h-screen text-black print:bg-transparent p-4">
        {admitCards.map((item, index) => (
          <div key={item.student?.id || index} className="page-break max-w-4xl mx-auto mb-10 print:mb-0">
            <GurukulAdmitCard
              institution={item.institution}
              student={item.student}
              exam={exam}
              schedules={item.schedules}
            />
          </div>
        ))}
      </div>
    </>
  );
}

AdmitCardsPrint.layout = (page: React.ReactNode) => <>{page}</>;
