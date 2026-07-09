import { Head, Link, router } from "@inertiajs/react";
import { SCHEDULE_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Pencil, Trash } from "lucide-react";

interface Schedule {
  id: number;
  exam_id: number;
  lms_class?: { name: string };
  subject?: { name: string };
  exam_date?: string;
  start_time?: string;
  end_time?: string;
  full_marks: number;
  pass_marks: number;
  type: string;
}

interface Exam {
  id: number;
  name: string;
}

interface SchedulesIndexProps {
  schedules: Schedule[];
  exams: Exam[];
  selectedExamId?: string;
}

export default function SchedulesIndex({ schedules, exams, selectedExamId }: SchedulesIndexProps) {
  const handleExamChange = (value: string) => {
    const examId = value === "all" ? "" : value;
    router.get(
      "/examination/schedules",
      { exam_id: examId },
      { preserveState: true }
    );
  };

  return (
    <>
      <Head title="Schedules" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={SCHEDULE_LIST_BREADCRUMBS}
          icon={Calendar}
          title="SCHEDULES"
          subtitle="Manage all examination schedules"
        />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="w-1/3">
              <Select value={selectedExamId || "all"} onValueChange={handleExamChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id ? exam.id.toString() : `exam-${exam.name}`}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Link href={`/examination/schedules/create${selectedExamId ? `?exam_id=${selectedExamId}` : ''}`}>
                <Button variant="default">
                  <Plus className="size-4 mr-2" />
                  Add Schedule
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Marks (F/P)</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No schedules found. Select an exam or add a new schedule.
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.lms_class?.name ?? "—"}</TableCell>
                      <TableCell>{schedule.subject?.name ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3 text-muted-foreground" />
                            {schedule.exam_date ?? "—"}
                          </span>
                          {(schedule.start_time || schedule.end_time) && (
                            <span className="text-xs text-muted-foreground mt-0.5">
                              {schedule.start_time ?? "—"} to {schedule.end_time ?? "—"}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{schedule.full_marks} / {schedule.pass_marks}</TableCell>
                      <TableCell className="capitalize">{schedule.type || 'theory'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <Link href={`/examination/schedules/${schedule.id}/marks`}>
                            <Button size="sm" variant="outline">Enter Marks</Button>
                          </Link>
                          <Link href={`/examination/schedules/${schedule.id}/edit`}>
                            <Button size="icon-sm" variant="ghost">
                              <Pencil className="size-4" />
                            </Button>
                          </Link>
                          <Link 
                            href={`/examination/schedules/${schedule.id}`} 
                            method="delete" 
                            as="button"
                          >
                            <Button size="icon-sm" variant="ghost" className="text-destructive">
                              <Trash className="size-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
