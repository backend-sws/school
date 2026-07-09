import { Head, useForm } from "@inertiajs/react";
import { EXAM_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { FormEventHandler } from "react";

interface ExamEditProps {
  exam: Record<string, unknown> & { id: number; name: string; session_id: number; start_date?: string; end_date?: string; description?: string };
}

export default function ExamEdit({ exam }: ExamEditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: exam.name,
    session_id: exam.session_id,
    start_date: exam.start_date ?? "",
    end_date: exam.end_date ?? "",
    description: exam.description ?? "",
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    put(`/examination/exams/${exam.id}`);
  };

  return (
    <>
      <Head title={`Edit Exam: ${exam.name}`} />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...EXAM_LIST_BREADCRUMBS,
            { title: "Edit", href: "#" }
          ]}
          icon={BookOpen}
          title="EDIT EXAM"
        />
        <Card className="max-w-2xl">
          <CardHeader>
            <h3 className="text-lg font-medium">Exam Details</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Exam Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={data.start_date}
                    onChange={(e) => setData("start_date", e.target.value)}
                  />
                  {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={data.end_date}
                    onChange={(e) => setData("end_date", e.target.value)}
                  />
                  {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                <Button type="submit" disabled={processing}>Update Exam</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
