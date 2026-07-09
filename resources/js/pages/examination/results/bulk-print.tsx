import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";

interface BulkPrintProps {
  exam: Record<string, unknown> & { name: string; term?: { name: string } };
  marksheets: {
    student: Record<string, unknown> & { admission_no: string; user?: { name: string } };
    subjects: {
      subject_name: string;
      full_marks: number;
      pass_marks: number;
      is_absent: boolean;
      marks_obtained?: number;
      grade?: string;
      is_pass: boolean;
    }[];
    result_status: string;
    total_full_marks: number;
    total_obtained: number;
    overall_percentage: number;
    overall_grade: string;
  }[];
}

export default function BulkPrint({ exam, marksheets }: BulkPrintProps) {
  useEffect(() => {
    // Automatically trigger print dialog when loaded
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head title={`Bulk Print: ${exam.name}`} />
      
      {/* 
        Add custom print styles to ensure:
        1. Backgrounds print correctly
        2. Page breaks occur between marksheets 
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          .page-break { page-break-after: always; }
          .page-break:last-child { page-break-after: auto; }
          /* Hide non-essential layout elements if they sneak in */
          #theme-root > div:last-child { display: none !important; }
        }
      `}} />

      <div className="bg-white min-h-screen text-black print:bg-transparent">
        {marksheets.map((marksheet, index) => (
          <div key={marksheet.student.id} className="page-break p-8 max-w-4xl mx-auto border-b print:border-none mb-8 print:mb-0">
            {/* Marksheet Header */}
            <div className="text-center border-b pb-6 mb-6">
              <h2 className="text-2xl font-bold">{exam.name}</h2>
              <p className="text-gray-600">STUDENT REPORT CARD</p>
              <p className="text-sm text-gray-500 mt-1">Term: {exam.term?.name ?? "No Term"}</p>
              
              <div className="flex justify-between mt-6 text-sm text-left px-4">
                <div>
                  <p><strong>Name:</strong> {marksheet.student.user?.name}</p>
                  <p><strong>Admission No:</strong> {marksheet.student.admission_no}</p>
                </div>
                <div className="text-right">
                  <p><strong>Status:</strong> <span className={marksheet.result_status === "PASS" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{marksheet.result_status}</span></p>
                </div>
              </div>
            </div>

            {/* Subjects Table */}
            <Table className="mb-6">
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100">
                  <TableHead className="text-black font-bold">Subject</TableHead>
                  <TableHead className="text-center text-black font-bold">Full Marks</TableHead>
                  <TableHead className="text-center text-black font-bold">Passing Marks</TableHead>
                  <TableHead className="text-center text-black font-bold">Marks Obtained</TableHead>
                  <TableHead className="text-center text-black font-bold">Grade</TableHead>
                  <TableHead className="text-right text-black font-bold">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marksheet.subjects.map((sub, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{sub.subject_name}</TableCell>
                    <TableCell className="text-center">{sub.full_marks}</TableCell>
                    <TableCell className="text-center">{sub.pass_marks}</TableCell>
                    <TableCell className="text-center font-semibold">
                      {sub.is_absent ? (
                        <span className="text-red-600 font-bold">ABSENT</span>
                      ) : (
                        sub.marks_obtained ?? "—"
                      )}
                    </TableCell>
                    <TableCell className="text-center font-bold">{sub.grade ?? "—"}</TableCell>
                    <TableCell className="text-right text-gray-600 text-sm">
                      {sub.is_pass ? "Pass" : "Requires Improvement"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Summary Box */}
            <div className="border rounded-lg bg-gray-50 p-6 flex flex-col sm:flex-row justify-between items-center mb-12">
              <div className="space-y-2 text-sm">
                <p className="text-lg">Total Score: <strong className="text-xl">{marksheet.total_obtained} / {marksheet.total_full_marks}</strong></p>
              </div>
              <div className="space-y-2 text-sm text-right mt-4 sm:mt-0">
                <p className="text-lg">Percentage: <strong className="text-xl">{marksheet.overall_percentage?.toFixed(2)}%</strong></p>
                <p className="text-lg">Overall Grade: <strong className="text-3xl text-black">{marksheet.overall_grade ?? "—"}</strong></p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="mt-16 flex justify-between pt-8 px-8">
              <div className="text-center">
                <div className="border-b border-black w-48 mb-2"></div>
                <p className="text-sm font-semibold">Class Teacher</p>
              </div>
              <div className="text-center">
                <div className="border-b border-black w-48 mb-2"></div>
                <p className="text-sm font-semibold">Principal</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Override the layout so it doesn't wrap in the standard sidebar/header layout
BulkPrint.layout = (page: React.ReactNode) => <>{page}</>;
