import { Head } from "@inertiajs/react";
import { useEffect, Fragment } from "react";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";

interface PrintBroadsheetProps {
  exam: Record<string, unknown> & { name: string; term?: { name: string } };
  subjects: {
    name: string;
    full_marks: number;
    pass_marks: number;
  }[];
  marksheets: {
    student: Record<string, unknown> & { admission_no: string; user?: { name: string } };
    primary_class: string;
    subjects: Record<string, {
      full_marks: number;
      pass_marks: number;
      is_absent: boolean;
      marks_obtained?: number;
      grade?: string;
      is_pass: boolean;
    }>;
    total_obtained: number;
    total_full_marks: number;
    overall_percentage: number;
    overall_grade: string;
    result_status: string;
  }[];
}

export default function PrintBroadsheet({ exam, subjects, marksheets }: PrintBroadsheetProps) {
  useEffect(() => {
    // Automatically trigger print dialog when loaded
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head title={`Broadsheet: ${exam.name}`} />
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          #theme-root > div:last-child { display: none !important; }
        }
      `}} />

      <div className="bg-white min-h-screen text-black print:bg-transparent p-4 lg:p-8 max-w-[100%] mx-auto overflow-x-auto">
        <div className="text-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold">{exam.name}</h2>
          <p className="text-gray-600">TABULATION BROADSHEET</p>
          <p className="text-sm text-gray-500 mt-1">Term: {exam.term?.name ?? "No Term"}</p>
        </div>

        <Table className="mb-6 border text-xs sm:text-sm">
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100">
              <TableHead className="text-black font-bold border-r align-bottom" rowSpan={2}>SN</TableHead>
              <TableHead className="text-black font-bold border-r align-bottom" rowSpan={2}>Adm No</TableHead>
              <TableHead className="text-black font-bold border-r align-bottom min-w-[150px]" rowSpan={2}>Student Name</TableHead>
              {subjects.map(subject => (
                <TableHead key={subject.name} className="text-center text-black font-bold border-r p-1" colSpan={2}>
                  {subject.name}<br/>
                  <span className="text-[10px] font-normal">({subject.full_marks})</span>
                </TableHead>
              ))}
              <TableHead className="text-center text-black font-bold border-r align-bottom" rowSpan={2}>Total<br/>Marks</TableHead>
              <TableHead className="text-center text-black font-bold border-r align-bottom" rowSpan={2}>%</TableHead>
              <TableHead className="text-center text-black font-bold border-r align-bottom" rowSpan={2}>Grade</TableHead>
              <TableHead className="text-center text-black font-bold align-bottom" rowSpan={2}>Status</TableHead>
            </TableRow>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              {subjects.map(subject => (
                <Fragment key={`sub-headers-${subject.name}`}>
                  <TableHead className="text-center text-black border-r border-t p-1 text-[10px]">MO</TableHead>
                  <TableHead className="text-center text-black border-r border-t p-1 text-[10px]">GR</TableHead>
                </Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {marksheets.map((marksheet, idx) => (
              <TableRow key={marksheet.student.id}>
                <TableCell className="border-r py-1">{idx + 1}</TableCell>
                <TableCell className="border-r py-1">{marksheet.student.admission_no}</TableCell>
                <TableCell className="font-medium border-r py-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]" title={marksheet.student.user?.name}>
                  {marksheet.student.user?.name}
                </TableCell>
                
                {subjects.map(subject => {
                  const studentSub = marksheet.subjects[subject.name];
                  if (!studentSub) {
                    return (
                      <Fragment key={`sub-cells-empty-${subject.name}`}>
                        <TableCell className="text-center border-r py-1 text-gray-400">—</TableCell>
                        <TableCell className="text-center border-r py-1 text-gray-400">—</TableCell>
                      </Fragment>
                    );
                  }
                  
                  return (
                    <Fragment key={`sub-cells-${subject.name}`}>
                      <TableCell className={`text-center border-r py-1 font-semibold ${!studentSub.is_pass ? 'text-red-600' : ''}`}>
                        {studentSub.is_absent ? "AB" : studentSub.marks_obtained}
                      </TableCell>
                      <TableCell className="text-center border-r py-1 text-gray-600">
                        {studentSub.grade ?? "—"}
                      </TableCell>
                    </Fragment>
                  );
                })}
                
                <TableCell className="text-center border-r py-1 font-bold">
                  {marksheet.total_obtained}
                </TableCell>
                <TableCell className="text-center border-r py-1">
                  {marksheet.overall_percentage?.toFixed(2)}
                </TableCell>
                <TableCell className="text-center border-r py-1 font-bold">
                  {marksheet.overall_grade ?? "—"}
                </TableCell>
                <TableCell className="text-center py-1 font-bold">
                  <span className={marksheet.result_status === 'PASS' ? 'text-green-600' : 'text-red-600'}>
                    {marksheet.result_status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {marksheets.length === 0 && (
              <TableRow>
                <TableCell colSpan={8 + subjects.length * 2} className="text-center py-8 text-gray-500">
                  No data available for broadsheet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-12 flex justify-between pt-8 px-8">
          <div className="text-center">
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="text-sm font-semibold">Class Teacher</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="text-sm font-semibold">Controller of Examinations</p>
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
PrintBroadsheet.layout = (page: React.ReactNode) => <>{page}</>;
