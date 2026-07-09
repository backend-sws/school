import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";

interface PrintSummaryProps {
  exam: Record<string, unknown> & { name: string; term?: { name: string } };
  results: {
    student_id: number;
    name: string;
    admission_no: string;
    class_name: string;
    total_obtained: number;
    total_full_marks: number;
    overall_percentage: number;
    overall_grade: string;
    result_status: string;
  }[];
}

export default function PrintSummary({ exam, results }: PrintSummaryProps) {
  useEffect(() => {
    // Automatically trigger print dialog when loaded
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head title={`Result Summary: ${exam.name}`} />
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          #theme-root > div:last-child { display: none !important; }
        }
      `}} />

      <div className="bg-white min-h-screen text-black print:bg-transparent p-8 max-w-5xl mx-auto">
        <div className="text-center border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold">{exam.name}</h2>
          <p className="text-gray-600">RESULT SUMMARY REPORT</p>
          <p className="text-sm text-gray-500 mt-1">Term: {exam.term?.name ?? "No Term"}</p>
        </div>

        <Table className="mb-6">
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100">
              <TableHead className="text-black font-bold">SN</TableHead>
              <TableHead className="text-black font-bold">Admission No</TableHead>
              <TableHead className="text-black font-bold">Student Name</TableHead>
              <TableHead className="text-black font-bold">Class</TableHead>
              <TableHead className="text-center text-black font-bold">Total Marks</TableHead>
              <TableHead className="text-center text-black font-bold">Percentage</TableHead>
              <TableHead className="text-center text-black font-bold">Grade</TableHead>
              <TableHead className="text-center text-black font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, idx) => (
              <TableRow key={result.student_id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{result.admission_no}</TableCell>
                <TableCell className="font-medium">{result.name}</TableCell>
                <TableCell>{result.class_name}</TableCell>
                <TableCell className="text-center">
                  {result.total_obtained} / {result.total_full_marks}
                </TableCell>
                <TableCell className="text-center">
                  {result.overall_percentage?.toFixed(2)}%
                </TableCell>
                <TableCell className="text-center font-bold">
                  {result.overall_grade ?? "—"}
                </TableCell>
                <TableCell className="text-center font-bold">
                  <span className={result.result_status === 'PASS' ? 'text-green-600' : 'text-red-600'}>
                    {result.result_status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {results.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">No results available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-16 flex justify-between pt-8 px-8">
          <div className="text-center">
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="text-sm font-semibold">Prepared By</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="text-sm font-semibold">Principal</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Override the layout
PrintSummary.layout = (page: React.ReactNode) => <>{page}</>;
