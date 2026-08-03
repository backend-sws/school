import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { ADMIT_CARDS_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IdCard, Printer, Eye } from "lucide-react";
import { toast } from "sonner";
import { GurukulAdmitCard, AdmitCardScheduleItem } from "@/components/examination/GurukulAdmitCard";

interface ExamItem {
  id: number;
  name: string;
  term?: { name: string };
  session?: { name: string };
}

interface ClassItem {
  id: number;
  name: string;
  section?: string;
}

interface StudentItem {
  id: number;
  user_id: number;
  name: string;
  father_name: string;
  mother_name: string;
  roll_no: string;
  reg_no: string;
  admission_no: string;
  class_name: string;
  section: string;
  photo_url?: string;
}

interface AdmitCardsIndexProps {
  exams: ExamItem[];
  classes: ClassItem[];
  selectedExamId?: number | null;
  selectedClassId?: number | null;
  selectedExam?: ExamItem | null;
  selectedClass?: ClassItem | null;
  schedules: AdmitCardScheduleItem[];
  students: StudentItem[];
}

export default function AdmitCardsIndex({
  exams,
  classes,
  selectedExamId,
  selectedClassId,
  selectedExam,
  selectedClass,
  schedules,
  students,
}: AdmitCardsIndexProps) {
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [previewStudent, setPreviewStudent] = useState<StudentItem | null>(null);
  const [printStudents, setPrintStudents] = useState<StudentItem[]>([]);

  const handleExamChange = (examIdStr: string) => {
    const examId = examIdStr ? parseInt(examIdStr, 10) : "";
    router.get(
      "/examination/admit-cards",
      { exam_id: examId, lms_class_id: selectedClassId || "" },
      { preserveState: true }
    );
  };

  const handleClassChange = (classIdStr: string) => {
    const classId = classIdStr ? parseInt(classIdStr, 10) : "";
    router.get(
      "/examination/admit-cards",
      { exam_id: selectedExamId || "", lms_class_id: classId },
      { preserveState: true }
    );
  };

  const toggleAllStudents = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s.id));
    }
  };

  const toggleStudent = (id: number) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((item) => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  // Direct In-Page Print (No new tab opened!)
  const handleDirectPrint = (studentsToPrint: StudentItem[]) => {
    if (!selectedExamId || !selectedClassId) {
      toast.error("Please select an Exam and a Class first.");
      return;
    }

    if (studentsToPrint.length === 0) {
      toast.error("Please select at least one student to print admit cards.");
      return;
    }

    setPrintStudents(studentsToPrint);

    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <>
      <Head title="Admit Cards" />

      {/* Print Styles for Direct Same-Page Printing */}
      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: A4 portrait;
          margin: 4mm 6mm;
        }
        @media print {
          body * {
            visibility: hidden !important;
          }
          #admit-card-print-area, #admit-card-print-area * {
            visibility: visible !important;
          }
          #admit-card-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            display: block !important;
          }
          .admit-card-page-break {
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .admit-card-page-break:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      ` }} />

      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={ADMIT_CARDS_BREADCRUMBS}
          icon={IdCard}
          title="ADMIT CARDS"
          subtitle="Generate and print examination hall tickets for students"
        />

        {/* Selection Filters Card */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Select Exam & Class</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Exam</label>
              <select
                className="w-full h-10 px-3 border rounded-md text-sm bg-background"
                value={selectedExamId || ""}
                onChange={(e) => handleExamChange(e.target.value)}
              >
                <option value="">-- Select Exam --</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} {exam.term ? `(${exam.term.name})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select
                className="w-full h-10 px-3 border rounded-md text-sm bg-background"
                value={selectedClassId || ""}
                onChange={(e) => handleClassChange(e.target.value)}
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* If Exam & Class Selected */}
        {selectedExamId && selectedClassId ? (
          <>
            {/* Exam Schedule Preview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    Schedule: {selectedExam?.name} - {selectedClass?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Session: {selectedExam?.session?.name || "2026-27"}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {schedules.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No exam schedules found for this class in selected exam. Please create schedules under <strong>Examination → Schedules</strong>.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Sitting</TableHead>
                        <TableHead>Exam Date</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead>Timing</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules.map((sched, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-semibold">{sched.subject_name}</TableCell>
                          <TableCell>{sched.sitting}</TableCell>
                          <TableCell>{sched.exam_date}</TableCell>
                          <TableCell>{sched.day}</TableCell>
                          <TableCell>{sched.timing}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Students List Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-medium">
                  Enrolled Students ({students.length})
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    disabled={selectedStudentIds.length === 0}
                    onClick={() =>
                      handleDirectPrint(
                        students.filter((s) => selectedStudentIds.includes(s.id))
                      )
                    }
                  >
                    <Printer className="size-4 mr-2" />
                    Print Selected Admit Cards ({selectedStudentIds.length})
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No active students enrolled in this class.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedStudentIds.length === students.length && students.length > 0}
                            onCheckedChange={toggleAllStudents}
                          />
                        </TableHead>
                        <TableHead>Roll No</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Father's Name</TableHead>
                        <TableHead>Reg / Adm No</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedStudentIds.includes(student.id)}
                              onCheckedChange={() => toggleStudent(student.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{student.roll_no}</TableCell>
                          <TableCell className="font-semibold">{student.name}</TableCell>
                          <TableCell>{student.father_name}</TableCell>
                          <TableCell>{student.reg_no}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPreviewStudent(student)}
                              >
                                <Eye className="size-4 mr-1" />
                                View Admit Card
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDirectPrint([student])}
                              >
                                <Printer className="size-4 mr-1" />
                                Print
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground space-y-2">
              <IdCard className="size-12 mx-auto text-muted-foreground/60 mb-2" />
              <h4 className="text-base font-semibold text-foreground">No Exam or Class Selected</h4>
              <p className="text-sm">Please select an <strong>Exam</strong> and a <strong>Class</strong> above to view available exam schedules and print admit cards.</p>
            </CardContent>
          </Card>
        )}

        {/* Modal Preview for Single Student Admit Card */}
        <Dialog open={Boolean(previewStudent)} onOpenChange={(open) => !open && setPreviewStudent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>Admit Card Preview: {previewStudent?.name}</DialogTitle>
              {previewStudent && (
                <Button
                  size="sm"
                  onClick={() => handleDirectPrint([previewStudent])}
                  className="mr-6"
                >
                  <Printer className="size-4 mr-1" /> Print
                </Button>
              )}
            </DialogHeader>
            {previewStudent && (
              <div className="p-2 border rounded-md bg-gray-100">
                <GurukulAdmitCard
                  student={previewStudent}
                  exam={selectedExam || {}}
                  schedules={schedules}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Hidden Print Container for In-Page Printing (Zero New Tabs!) */}
        <div id="admit-card-print-area" className="hidden print:block text-black bg-white">
          {printStudents.map((studentItem) => (
            <div key={studentItem.id} className="admit-card-page-break mb-10 print:mb-0">
              <GurukulAdmitCard
                student={studentItem}
                exam={selectedExam || {}}
                schedules={schedules}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
