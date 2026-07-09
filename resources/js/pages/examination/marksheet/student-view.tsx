import { Head } from "@inertiajs/react";
import { STUDENT_PORTAL_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { Download, Award } from "lucide-react";

interface StudentMarksheetViewProps {
  marksheet: Record<string, unknown> & {
    subjects: (Record<string, unknown> & {
      subject_name: string;
      full_marks: number;
      pass_marks: number;
      is_absent: boolean;
      marks_obtained?: number;
      grade?: string;
      is_pass: boolean;
    })[];
    result_status: string;
    total_full_marks: number;
    total_obtained: number;
    overall_percentage: number;
    overall_grade: string;
  };
  exam: Record<string, unknown> & { name: string; term?: { name: string } };
  student: Record<string, unknown> & { admission_no: string; user?: { name: string } };
}

export default function StudentMarksheetView({ marksheet, exam, student }: StudentMarksheetViewProps) {
  return (
    <>
      <Head title={`Report Card: ${exam.name}`} />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...STUDENT_PORTAL_BREADCRUMBS,
            { title: "Report Card", href: "#" }
          ]}
          icon={Award}
          title={exam.name}
          subtitle={`Term: ${exam.term?.name ?? "No Term"}`}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="size-4 mr-2" />
            Download Report Card
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto printable-marksheet">
          <CardHeader className="text-center border-b pb-6">
            <h2 className="text-2xl font-bold">{exam.name}</h2>
            <p className="text-muted-foreground">STUDENT REPORT CARD</p>
            <div className="flex justify-between mt-6 text-sm text-left">
              <div>
                <p><strong>Name:</strong> {student.user?.name}</p>
                <p><strong>Admission Number:</strong> {student.admission_no}</p>
              </div>
              <div className="text-right">
                <p><strong>Result Status:</strong> <span className={marksheet.result_status === "PASS" ? "text-green-600 font-bold" : "text-destructive font-bold"}>{marksheet.result_status}</span></p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Full Marks</TableHead>
                  <TableHead className="text-center">Passing Marks</TableHead>
                  <TableHead className="text-center">Marks Obtained</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-right">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marksheet.subjects.map((sub: Record<string, unknown> & { subject_name: string; full_marks: number; pass_marks: number; is_absent: boolean; marks_obtained?: number; grade?: string; is_pass: boolean }, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{sub.subject_name}</TableCell>
                    <TableCell className="text-center">{sub.full_marks}</TableCell>
                    <TableCell className="text-center">{sub.pass_marks}</TableCell>
                    <TableCell className="text-center font-semibold">
                      {sub.is_absent ? (
                        <span className="text-destructive font-bold">ABSENT</span>
                      ) : (
                        sub.marks_obtained ?? "—"
                      )}
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary">{sub.grade ?? "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {sub.is_pass ? "Pass" : "Requires Improvement"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-8 border-t pt-4 flex flex-col sm:flex-row justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-lg">
              <div className="space-y-2 text-sm text-center sm:text-left">
                <p className="text-lg">Total Score: <strong className="text-xl">{marksheet.total_obtained} / {marksheet.total_full_marks}</strong></p>
              </div>
              <div className="space-y-2 text-sm text-center sm:text-right mt-4 sm:mt-0">
                <p className="text-lg">Percentage: <strong className="text-xl">{marksheet.overall_percentage?.toFixed(2)}%</strong></p>
                <p className="text-lg">Overall Grade: <strong className="text-3xl text-primary">{marksheet.overall_grade ?? "—"}</strong></p>
              </div>
            </div>

            <div className="mt-16 flex justify-between border-t pt-8">
              <div className="text-center px-8">
                <div className="border-b border-black w-48 mb-2"></div>
                <p className="text-sm font-semibold">Class Teacher</p>
              </div>
              <div className="text-center px-8">
                <div className="border-b border-black w-48 mb-2"></div>
                <p className="text-sm font-semibold">Principal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
