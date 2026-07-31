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
    fa1?: number | string;
    fa2?: number | string;
    sa1?: number | string;
    fa3?: number | string;
    fa4?: number | string;
    sa2?: number | string;
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
      fa1: d.fa1,
      fa2: d.fa2,
      sa1: d.sa1,
      fa3: d.fa3,
      fa4: d.fa4,
      sa2: d.sa2,
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
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-2 py-2 text-xs font-semibold whitespace-nowrap">Admission No</TableHead>
                      <TableHead className="px-2 py-2 text-xs font-semibold whitespace-nowrap">Student Name</TableHead>
                      <TableHead className="px-2 py-2 text-xs font-semibold text-center w-12">Absent?</TableHead>
                      <TableHead className="px-2 py-2 text-xs font-semibold text-center w-14">FA 1</TableHead>
                      <TableHead className="px-2 py-2 text-xs font-semibold text-center w-14">FA 2</TableHead>
                      <TableHead className="px-2 py-2 text-xs font-semibold text-center w-14">SA 1</TableHead>
                      <TableHead className="px-2 py-2 text-xs font-semibold text-center w-14">FA 3</TableHead>
                      <TableHead className="px-2 py-2 text-xs font-semibold text-center w-14">FA 4</TableHead>
                      <TableHead className="px-2 py-2 text-xs font-semibold text-center w-14">SA 2</TableHead>
                      <TableHead className="px-2 py-2 text-xs font-semibold text-center w-16">Total</TableHead>
                      <TableHead className="px-2 py-2 text-xs font-semibold">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {gridData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                        No students enrolled in this class.
                      </TableCell>
                    </TableRow>
                  ) : (
                    gridData.map((student, index) => (
                      <TableRow key={student.student_profile_id}>
                        <TableCell className="px-2 py-1.5 text-xs font-medium whitespace-nowrap">{student.admission_no}</TableCell>
                        <TableCell className="px-2 py-1.5 text-xs whitespace-nowrap">{student.name}</TableCell>
                        <TableCell className="px-2 py-1.5 text-center">
                          <div className="flex items-center justify-center">
                            <Checkbox 
                              id={`absent-${index}`} 
                              checked={data.marks[index].is_absent}
                              onCheckedChange={(c) => updateMark(index, 'is_absent', !!c)}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={data.marks[index].is_absent}
                            value={data.marks[index].fa1 ?? ""}
                            onChange={(e) => updateMark(index, 'fa1', e.target.value)}
                            placeholder="FA1"
                            className="w-14 h-8 text-xs px-2 text-center font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </TableCell>
                        <TableCell className="px-2 py-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={data.marks[index].is_absent}
                            value={data.marks[index].fa2 ?? ""}
                            onChange={(e) => updateMark(index, 'fa2', e.target.value)}
                            placeholder="FA2"
                            className="w-14 h-8 text-xs px-2 text-center font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </TableCell>
                        <TableCell className="px-2 py-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={data.marks[index].is_absent}
                            value={data.marks[index].sa1 ?? ""}
                            onChange={(e) => updateMark(index, 'sa1', e.target.value)}
                            placeholder="SA1"
                            className="w-14 h-8 text-xs px-2 text-center font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </TableCell>
                        <TableCell className="px-2 py-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={data.marks[index].is_absent}
                            value={data.marks[index].fa3 ?? ""}
                            onChange={(e) => updateMark(index, 'fa3', e.target.value)}
                            placeholder="FA3"
                            className="w-14 h-8 text-xs px-2 text-center font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </TableCell>
                        <TableCell className="px-2 py-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={data.marks[index].is_absent}
                            value={data.marks[index].fa4 ?? ""}
                            onChange={(e) => updateMark(index, 'fa4', e.target.value)}
                            placeholder="FA4"
                            className="w-14 h-8 text-xs px-2 text-center font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </TableCell>
                        <TableCell className="px-2 py-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={data.marks[index].is_absent}
                            value={data.marks[index].sa2 ?? ""}
                            onChange={(e) => updateMark(index, 'sa2', e.target.value)}
                            placeholder="SA2"
                            className="w-14 h-8 text-xs px-2 text-center font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </TableCell>
                        <TableCell className="px-2 py-1.5">
                          <Input
                            type="number"
                            min="0"
                            max={schedule.full_marks}
                            step="0.01"
                            disabled={data.marks[index].is_absent}
                            value={data.marks[index].marks_obtained ?? ""}
                            onChange={(e) => updateMark(index, 'marks_obtained', e.target.value)}
                            placeholder="Total"
                            className="w-16 h-8 text-xs px-2 text-center font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </TableCell>
                        <TableCell className="px-2 py-1.5">
                          <Input
                            value={data.marks[index].remarks}
                            onChange={(e) => updateMark(index, 'remarks', e.target.value)}
                            placeholder="Remarks..."
                            className="h-8 text-xs px-2 w-32 md:w-40"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  );
}
