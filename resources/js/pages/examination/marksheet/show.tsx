import { Head } from "@inertiajs/react";
import { EXAM_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { Download, Award } from "lucide-react";

interface MarksheetShowProps {
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

export default function MarksheetShow({ marksheet, exam, student }: MarksheetShowProps) {
  return (
    <>
      <Head title={`Marksheet: ${student.user?.name} - ${exam.name}`} />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...EXAM_LIST_BREADCRUMBS,
            { title: exam.name, href: `/examination/exams/${exam.id}` },
            { title: "Marksheet", href: "#" }
          ]}
          icon={Award}
          title={`${student.user?.name}'s Marksheet`}
          subtitle={`${exam.name} - ${exam.term?.name ?? "No Term"}`}
        />
        <div className="flex justify-end gap-2">
          {/* Note: PDF Export function would be triggered here */}
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="size-4 mr-2" />
            Download PDF
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto printable-marksheet">
          <CardHeader className="text-center border-b">
            <h2 className="text-2xl font-bold">{exam.name}</h2>
            <p className="text-muted-foreground">STUDENT REPORT CARD</p>
            <div className="flex justify-between mt-6 text-sm text-left">
              <div>
                <p><strong>Student Name:</strong> {student.user?.name}</p>
                <p><strong>Admission No:</strong> {student.admission_no}</p>
              </div>
              <div className="text-right">
                <p><strong>Status:</strong> <span className={marksheet.result_status === "PASS" ? "text-green-600 font-bold" : "text-destructive font-bold"}>{marksheet.result_status}</span></p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Full Marks</TableHead>
                  <TableHead className="text-center">Pass Marks</TableHead>
                  <TableHead className="text-center">Marks Obtained</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marksheet.subjects.map((sub: Record<string, unknown> & { subject_name: string; full_marks: number; pass_marks: number; is_absent: boolean; marks_obtained?: number; grade?: string; is_pass: boolean }, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{sub.subject_name}</TableCell>
                    <TableCell className="text-center">{sub.full_marks}</TableCell>
                    <TableCell className="text-center">{sub.pass_marks}</TableCell>
                    <TableCell className="text-center">
                      {sub.is_absent ? (
                        <span className="text-destructive font-semibold">ABSENT</span>
                      ) : (
                        sub.marks_obtained ?? "—"
                      )}
                    </TableCell>
                    <TableCell className="text-center font-bold">{sub.grade ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      {sub.is_pass ? (
                        <span className="text-green-600">PASS</span>
                      ) : (
                        <span className="text-destructive">FAIL</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-8 border-t pt-4 flex justify-between items-center bg-muted/20 p-4 rounded-lg">
              <div className="space-y-1 text-sm">
                <p><strong>Total Marks:</strong> {marksheet.total_full_marks}</p>
                <p><strong>Obtained Marks:</strong> {marksheet.total_obtained}</p>
              </div>
              <div className="space-y-1 text-sm text-right">
                <p><strong>Percentage:</strong> {marksheet.overall_percentage?.toFixed(2)}%</p>
                <p><strong>Overall Grade:</strong> <span className="text-lg font-bold">{marksheet.overall_grade ?? "—"}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
