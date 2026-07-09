import { Head, Link, router } from "@inertiajs/react";
import { EXAM_BASE_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { Award, Eye, Megaphone, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ExamResultsListProps {
  exams: (Record<string, unknown> & {
    id: number;
    name: string;
    start_date?: string;
    end_date?: string;
    is_published: boolean;
    term?: { name: string };
  })[];
}

function formatExamDate(value?: string) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ExamResultsList({ exams }: ExamResultsListProps) {
  const handleTogglePublish = (examId: number, isPublished: boolean) => {
    router.patch(`/examination/exams/${examId}/publish`, {}, {
      preserveScroll: true,
      onSuccess: () => toast.success(isPublished ? "Results unpublished" : "Results published"),
      onError: () => toast.error("Failed to update publish status"),
    });
  };

  return (
    <>
      <Head title="Exam Results" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[...EXAM_BASE_BREADCRUMBS, { title: "Results", href: "#" }]}
          icon={Award}
          title="EXAM RESULTS"
          subtitle="Select an exam to view and print student marksheets"
        />
        
        <Card className="border-muted">
          <CardContent className="py-4 text-sm text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">How to generate student results</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create an exam and add schedules (class + subject) under <strong>Examination → Exams</strong>.</li>
              <li>Open each schedule and use <strong>Enter Marks</strong> to save student marks.</li>
              <li>Click <strong>View Results</strong> here to review calculated grades and print marksheets.</li>
              <li>Click <strong>Publish Results</strong> so students can view marksheets in their portal.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Available Exams</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No exams found.
                    </TableCell>
                  </TableRow>
                ) : (
                  exams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium text-base">{exam.name}</TableCell>
                      <TableCell>{exam.term?.name ?? "—"}</TableCell>
                      <TableCell>{formatExamDate(exam.start_date)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${exam.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {exam.is_published ? 'Published' : 'Draft'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant={exam.is_published ? "outline" : "secondary"}
                            size="sm"
                            onClick={() => handleTogglePublish(exam.id, exam.is_published)}
                          >
                            {exam.is_published ? (
                              <>
                                <EyeOff className="size-4 mr-1" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Megaphone className="size-4 mr-1" />
                                Publish
                              </>
                            )}
                          </Button>
                          <Link href={`/examination/exams/${exam.id}/results`}>
                            <Button variant="default" size="sm">
                              <Eye className="size-4 mr-2" />
                              View Results
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
