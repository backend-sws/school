import { Head, Link, useForm } from "@inertiajs/react";
import { SCHEDULE_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Exam {
  id: number;
  name: string;
}

interface Schedule {
  id: number;
  exam_id: number;
  lms_class_id: number;
  subject_id: number;
  exam_date: string;
  start_time: string | null;
  end_time: string | null;
  full_marks: number;
  pass_marks: number;
  type: string;
  lms_class?: { name: string };
  subject?: { name: string };
}

interface EditScheduleProps {
  exam: Exam;
  schedule: Schedule;
}

export default function EditSchedule({ exam, schedule }: EditScheduleProps) {
  const { data, setData, put, processing, errors } = useForm({
    exam_date: schedule.exam_date || "",
    start_time: schedule.start_time || "",
    end_time: schedule.end_time || "",
    full_marks: schedule.full_marks || 100,
    pass_marks: schedule.pass_marks || 33,
    type: schedule.type || "theory",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/examination/schedules/${schedule.id}`, {
      onSuccess: () => {
        toast.success("Schedule updated successfully.");
      }
    });
  };

  return (
    <>
      <Head title={`Edit Schedule - ${exam.name}`} />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...SCHEDULE_LIST_BREADCRUMBS,
            { title: "Edit Schedule", href: "#" }
          ]}
          icon={BookOpen}
          title="EDIT SCHEDULE"
          subtitle={`${exam.name} - ${schedule.lms_class?.name || "Class"} - ${schedule.subject?.name || "Subject"}`}
        />

        <Card className="max-w-xl">
          <CardHeader>
            <h3 className="text-lg font-medium">Schedule Details</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Class</Label>
                  <Input value={schedule.lms_class?.name || ""} disabled />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input value={schedule.subject?.name || ""} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Exam Date <span className="text-destructive">*</span></Label>
                  <Input 
                    type="date" 
                    value={data.exam_date}
                    onChange={e => setData("exam_date", e.target.value)}
                    className="mt-1"
                  />
                  {errors.exam_date && <p className="text-sm text-destructive mt-1">{errors.exam_date}</p>}
                </div>
                <div>
                  <Label>Type</Label>
                  <Select 
                    value={data.type} 
                    onValueChange={val => setData("type", val)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theory">Theory</SelectItem>
                      <SelectItem value="practical">Practical</SelectItem>
                      <SelectItem value="viva">Viva</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-destructive mt-1">{errors.type}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input 
                    type="time" 
                    value={data.start_time}
                    onChange={e => setData("start_time", e.target.value)}
                    className="mt-1"
                  />
                  {errors.start_time && <p className="text-sm text-destructive mt-1">{errors.start_time}</p>}
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input 
                    type="time" 
                    value={data.end_time}
                    onChange={e => setData("end_time", e.target.value)}
                    className="mt-1"
                  />
                  {errors.end_time && <p className="text-sm text-destructive mt-1">{errors.end_time}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Full Marks <span className="text-destructive">*</span></Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={data.full_marks}
                    onChange={e => setData("full_marks", parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                  {errors.full_marks && <p className="text-sm text-destructive mt-1">{errors.full_marks}</p>}
                </div>
                <div>
                  <Label>Pass Marks <span className="text-destructive">*</span></Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={data.pass_marks}
                    onChange={e => setData("pass_marks", parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                  {errors.pass_marks && <p className="text-sm text-destructive mt-1">{errors.pass_marks}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Link href={`/examination/schedules?exam_id=${exam.id}`}>
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={processing}>Update Schedule</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
