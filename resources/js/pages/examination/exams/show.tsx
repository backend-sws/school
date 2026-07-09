import { Head, Link, router } from "@inertiajs/react";
import { EXAM_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { BookOpen, Calendar, Edit, Plus, Pencil, Trash, Megaphone, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ExamShowProps {
  exam: Record<string, unknown> & {
    id: number;
    name: string;
    is_published?: boolean;
    schedules?: (Record<string, unknown> & {
      id: number;
      lms_class?: { name: string };
      subject?: { name: string };
      exam_date?: string;
      full_marks: number;
      pass_marks: number;
    })[];
  };
}

export default function ExamShow({ exam }: ExamShowProps) {
  const isPublished = Boolean(exam.is_published);

  const handleTogglePublish = () => {
    router.patch(`/examination/exams/${exam.id}/publish`, {}, {
      preserveScroll: true,
      onSuccess: () => toast.success(isPublished ? "Results unpublished" : "Results published"),
      onError: () => toast.error("Failed to update publish status"),
    });
  };

  return (
    <>
      <Head title={`Exam: ${exam.name}`} />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...EXAM_LIST_BREADCRUMBS,
            { title: exam.name, href: "#" }
          ]}
          icon={BookOpen}
          title={exam.name.toUpperCase()}
          subtitle="Exam details and schedules. After entering marks for all subjects, open View Results — results are computed automatically."
        />
        <div className="flex justify-end gap-2">
          <Link href={`/examination/schedules/create?exam_id=${exam.id}`}>
            <Button variant="default">
              <Plus className="size-4 mr-2" />
              Add Schedule
            </Button>
          </Link>
          <Link href={`/examination/exams/${exam.id}/results`}>
            <Button variant="outline">
              View Results
            </Button>
          </Link>
          <Button
            variant={isPublished ? "secondary" : "default"}
            onClick={handleTogglePublish}
          >
            {isPublished ? (
              <>
                <EyeOff className="size-4 mr-2" />
                Unpublish Results
              </>
            ) : (
              <>
                <Megaphone className="size-4 mr-2" />
                Publish Results
              </>
            )}
          </Button>
          <Link href={`/examination/exams/${exam.id}/edit`}>
            <Button variant="outline">
              <Edit className="size-4 mr-2" />
              Edit Exam
            </Button>
          </Link>
        </div>

        {!isPublished && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="py-4 text-sm text-amber-900">
              <strong>How to finalize results:</strong> Enter marks for each schedule below, then open{" "}
              <Link href={`/examination/exams/${exam.id}/results`} className="underline font-semibold">View Results</Link>
              {" "}to review totals, and click <strong>Publish Results</strong> when ready for students to see marksheets.
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Schedules</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Full / Pass Marks</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!exam.schedules || exam.schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No schedules found for this exam.
                    </TableCell>
                  </TableRow>
                ) : (
                  exam.schedules.map((schedule: Record<string, unknown> & { id: number; lms_class?: { name: string }; subject?: { name: string }; exam_date?: string; full_marks: number; pass_marks: number }) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.lms_class?.name ?? "—"}</TableCell>
                      <TableCell>{schedule.subject?.name ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          {schedule.exam_date ?? "—"}
                        </div>
                      </TableCell>
                      <TableCell>{schedule.full_marks} / {schedule.pass_marks}</TableCell>
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
