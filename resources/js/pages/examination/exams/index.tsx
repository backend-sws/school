import { Head, Link } from "@inertiajs/react";
import { EXAM_BASE_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { BookOpen, Plus, Eye, Pencil } from "lucide-react";
import { format } from "date-fns";

interface ExamIndexProps {
  exams: (Record<string, unknown> & {
    id: number;
    name: string;
    start_date?: string;
    end_date?: string;
    is_published: boolean;
  })[];
}

export default function ExamIndex({ exams }: ExamIndexProps) {
  return (
    <>
      <Head title="Exams" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[...EXAM_BASE_BREADCRUMBS, { title: "Exams", href: "#" }]}
          icon={BookOpen}
          title="EXAMS"
          subtitle="Manage examinations"
        />
        <div className="flex justify-end gap-2">
          <Link href="/examination/grading-scales">
            <Button variant="outline">Grading Scales</Button>
          </Link>
          <Link href="/examination/exams/create">
            <Button>
              <Plus className="size-4 mr-2" />
              Add Exam
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">All Exams</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No exams found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  exams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{exam.start_date ? format(new Date(exam.start_date), "PPP p") : "—"}</TableCell>
                      <TableCell>{exam.end_date ? format(new Date(exam.end_date), "PPP p") : "—"}</TableCell>
                      <TableCell>{exam.is_published ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/examination/exams/${exam.id}`}>
                            <Button size="icon-sm" variant="ghost"><Eye className="size-4" /></Button>
                          </Link>
                          <Link href={`/examination/exams/${exam.id}/edit`}>
                            <Button size="icon-sm" variant="ghost"><Pencil className="size-4" /></Button>
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
