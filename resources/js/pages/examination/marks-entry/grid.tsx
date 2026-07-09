import { Head, useForm, Link } from "@inertiajs/react";
import { EXAM_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FileEdit, Award } from "lucide-react";
import { FormEventHandler } from "react";
import { toast } from "sonner";

interface MarksEntryGridProps {
  schedule: Record<string, unknown> & { id: number; full_marks: number; pass_marks: number; subject?: { name: string }; lms_class?: { name: string }; exam?: { name: string }; exam_id: number };
  gridData: (Record<string, unknown> & {
    student_profile_id: number;
    user_id: number;
    admission_no: string;
    name: string;
    marks_obtained?: number | string;
    is_absent: boolean;
    remarks?: string;
  })[];
}

export default function MarksEntryGrid({ schedule, gridData }: MarksEntryGridProps) {
  const { data, setData, post, processing } = useForm({
    marks: gridData.map(d => ({
      student_profile_id: d.student_profile_id,
      user_id: d.user_id,
      marks_obtained: d.marks_obtained,
      is_absent: d.is_absent,
      remarks: d.remarks ?? "",
    }))
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(`/examination/schedules/${schedule.id}/marks`, {
      onSuccess: () => toast.success('Marks saved successfully.')
    });
  };

  const updateMark = (index: number, field: string, value: string | boolean | number) => {
    const newMarks = [...data.marks];
    newMarks[index] = { ...newMarks[index], [field]: value };
    setData("marks", newMarks);
  };

  return (
    <>
      <Head title={`Marks Entry: ${schedule.subject?.name}`} />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...EXAM_LIST_BREADCRUMBS,
            { title: schedule.exam?.name ?? "Exam", href: `/examination/exams/${schedule.exam_id}` },
            { title: "Marks Entry", href: "#" }
          ]}
          icon={FileEdit}
          title={`MARKS ENTRY - ${schedule.subject?.name}`}
          subtitle={`Class: ${schedule.lms_class?.name} | Full Marks: ${schedule.full_marks} | Pass Marks: ${schedule.pass_marks}. Results are generated automatically after you save marks.`}
        />

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-medium">Student List</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/examination/exams/${schedule.exam_id}/results`}>
                    <Award className="size-4 mr-2" />
                    View Class Results
                  </Link>
                </Button>
                <Button type="submit" disabled={processing}>Save Marks</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admission No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="w-32">Absent?</TableHead>
                    <TableHead className="w-32">Marks Obtained</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gridData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No students enrolled in this class.
                      </TableCell>
                    </TableRow>
                  ) : (
                    gridData.map((student, index) => (
                      <TableRow key={student.student_profile_id}>
                        <TableCell className="font-medium">{student.admission_no}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`absent-${index}`} 
                              checked={data.marks[index].is_absent}
                              onCheckedChange={(c) => updateMark(index, 'is_absent', !!c)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max={schedule.full_marks}
                            step="0.01"
                            disabled={data.marks[index].is_absent}
                            value={data.marks[index].marks_obtained}
                            onChange={(e) => updateMark(index, 'marks_obtained', e.target.value)}
                            placeholder="Score"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={data.marks[index].remarks}
                            onChange={(e) => updateMark(index, 'remarks', e.target.value)}
                            placeholder="Optional remarks..."
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  );
}
