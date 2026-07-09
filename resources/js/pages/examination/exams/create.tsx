import { Head, useForm } from "@inertiajs/react";
import { EXAM_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { FormEventHandler } from "react";

export default function ExamCreate() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    session_id: "1", // Hardcode for now, should come from props ideally
    start_date: "",
    end_date: "",
    description: "",
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/examination/exams');
  };

  return (
    <>
      <Head title="Create Exam" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...EXAM_LIST_BREADCRUMBS,
            { title: "Create", href: "#" }
          ]}
          icon={BookOpen}
          title="CREATE EXAM"
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
                  placeholder="e.g. Mid Term Exam 2026"
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
                <Button type="submit" disabled={processing}>Save Exam</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
