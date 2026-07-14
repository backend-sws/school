import { Head } from "@inertiajs/react";
import { EXAM_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { Printer, Award } from "lucide-react";

interface MarksheetShowProps {
  marksheet: Record<string, any> & {
    subjects: (Record<string, any> & {
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
  exam: Record<string, any> & { name: string; term?: { name: string } };
  student: Record<string, any> & { admission_no: string; roll_no?: string; reg_no?: string; user?: { name: string } };
}

export default function MarksheetShow({ marksheet, exam, student }: MarksheetShowProps) {
  return (
    <>
      <Head title={`Marksheet: ${student.user?.name} - ${exam.name}`} />
      
      {/* Inject professional print styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide UI/nav layout components only, do NOT hide parent containers */
          aside, nav, header, button, [data-sidebar], .no-print, .MainPageHeader {
            display: none !important;
          }
          
          /* Reset parent containers so they flow naturally during print */
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
          
          .printable-marksheet {
            border: 2px solid #000 !important;
            box-shadow: none !important;
            padding: 24px !important;
            background: white !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          
          .bg-muted\\/20 {
            background-color: rgba(0, 0, 0, 0.03) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .text-green-600 {
            color: #16a34a !important;
          }
          .text-destructive {
            color: #dc2626 !important;
          }
        }
      `}} />

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
          <Button variant="outline" onClick={() => window.print()} className="h-10">
            <Printer className="size-4 mr-2" />
            Print Marksheet
          </Button>
        </div>

        <div className="printable-marksheet-wrapper flex justify-center w-full">
          <Card className="max-w-4xl w-full mx-auto printable-marksheet border-2 border-primary/20 shadow-lg relative overflow-hidden bg-card transition-all duration-300">
            {/* Elegant double-border frame */}
            <div className="absolute inset-1.5 border border-dashed border-primary/10 pointer-events-none" />
            
            <CardHeader className="text-center pt-8 pb-6 border-b border-border/80 relative">
              {/* Decorative Accent Ribbon */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mt-2">
                ACADEMIC REPORT CARD
              </h1>
              <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase mt-1">
                {exam.term?.name ?? "Term Evaluation"}
              </p>

              {/* Student Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-left mt-8 p-4 bg-muted/30 border border-border/60 rounded-xl">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Student Name</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{student.user?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Admission Number</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{student.admission_no}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Roll Number</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{student.roll_no || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Examination</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{exam.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Registration Number</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{student.reg_no || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status / Result</p>
                  <span className={`inline-flex items-center text-sm font-black mt-0.5 ${
                    marksheet.result_status === "PASS" ? "text-green-600" : "text-destructive"
                  }`}>
                    {marksheet.result_status}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 px-6 sm:px-8">
              <Table className="border border-border/80">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="font-bold text-foreground">Subject</TableHead>
                    <TableHead className="text-center font-bold text-foreground w-32">Full Marks</TableHead>
                    <TableHead className="text-center font-bold text-foreground w-32">Pass Marks</TableHead>
                    <TableHead className="text-center font-bold text-foreground w-32">Marks Obtained</TableHead>
                    <TableHead className="text-center font-bold text-foreground w-24">Grade</TableHead>
                    <TableHead className="text-right font-bold text-foreground w-28">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marksheet.subjects.map((sub: any, idx: number) => (
                    <TableRow key={idx} className="hover:bg-muted/10">
                      <TableCell className="font-bold text-foreground">{sub.subject_name}</TableCell>
                      <TableCell className="text-center font-medium">{sub.full_marks}</TableCell>
                      <TableCell className="text-center font-medium">{sub.pass_marks}</TableCell>
                      <TableCell className="text-center font-bold">
                        {sub.is_absent ? (
                          <span className="text-destructive font-bold text-xs uppercase tracking-wide">ABSENT</span>
                        ) : (
                          sub.marks_obtained ?? "—"
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary">{sub.grade ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        {sub.is_pass ? (
                          <span className="text-green-600 font-bold text-xs">PASS</span>
                        ) : (
                          <span className="text-destructive font-bold text-xs">FAIL</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Summary and Stats Card */}
              <div className="mt-8 border border-border bg-muted/20 p-5 rounded-xl grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground flex justify-between max-w-[240px]">
                    <span>Total Max Marks:</span> 
                    <strong className="text-foreground">{marksheet.total_full_marks}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground flex justify-between max-w-[240px]">
                    <span>Total Marks Obtained:</span> 
                    <strong className="text-foreground">{marksheet.total_obtained}</strong>
                  </p>
                </div>
                <div className="space-y-1.5 text-right border-l border-border/80 pl-6">
                  <p className="text-xs text-muted-foreground flex justify-between ml-auto max-w-[240px]">
                    <span>Aggregate Percentage:</span> 
                    <strong className="text-foreground">{marksheet.overall_percentage?.toFixed(2)}%</strong>
                  </p>
                  <p className="text-xs text-muted-foreground flex justify-between ml-auto max-w-[240px]">
                    <span>Overall Grade:</span> 
                    <strong className="text-primary text-base leading-none">{marksheet.overall_grade ?? "—"}</strong>
                  </p>
                </div>
              </div>

              {/* Professional Signature Blocks */}
              <div className="mt-16 pt-8 border-t border-dashed border-border/80 grid grid-cols-3 gap-6 text-center text-xs">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-8 border-b border-border/80" />
                  <span className="font-semibold text-muted-foreground mt-2 uppercase tracking-wider">Class Teacher</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-8 border-b border-border/80" />
                  <span className="font-semibold text-muted-foreground mt-2 uppercase tracking-wider">Exam Controller</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-8 border-b border-border/80" />
                  <span className="font-semibold text-muted-foreground mt-2 uppercase tracking-wider">Principal / Director</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
