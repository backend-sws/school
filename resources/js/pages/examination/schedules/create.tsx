import { useState, useMemo, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { SCHEDULE_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { SmartDateTimePicker } from "@/components/ui/smart-datetime-picker";
import { format, parse } from "date-fns";

interface Subject {
  id: number;
  name: string;
}

interface LmsClass {
  id: number;
  name: string;
  stream_id: number;
}

interface Exam {
  id: number;
  name: string;
}

type ScheduleData = {
  lms_class_id: number;
  subject_id: number;
  exam_date: string;
  start_time: string;
  end_time: string;
  full_marks: number;
  pass_marks: number;
  type: string;
};

interface CreateScheduleProps {
  exam: Exam | null;
  exams: Exam[];
  classes: LmsClass[];
  subjectsByStream: Record<string, Subject[]>;
}

export default function CreateSchedule({ exam, exams, classes, subjectsByStream }: CreateScheduleProps) {
  const [selectedExamId, setSelectedExamId] = useState<string>(exam?.id.toString() || "");
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const selectedClass = useMemo(() => {
    return classes.find(c => c.id.toString() === selectedClassId);
  }, [classes, selectedClassId]);

  const subjects = useMemo(() => {
    if (!selectedClass || !selectedClass.stream_id) return [];
    return subjectsByStream[selectedClass.stream_id.toString()] || [];
  }, [selectedClass, subjectsByStream]);

  const { data, setData, processing, errors } = useForm({
    exam_id: selectedExamId,
    schedules: [] as ScheduleData[]
  });

  console.log('Props received:', { exam, exams, classes, subjectsByStream });

  // Handle Exam Selection Change
  const handleExamChange = (value: string) => {
    setSelectedExamId(value);
    setData("exam_id", value);
    router.get(
      "/examination/schedules/create",
      { exam_id: value },
      { preserveState: true }
    );
  };

  // Reset schedules when class or subjects change
  useEffect(() => {
    if (subjects.length > 0 && selectedClass) {
      setData("schedules", subjects.map(sub => ({
        lms_class_id: selectedClass.id,
        subject_id: sub.id,
        exam_date: "",
        start_time: "",
        end_time: "",
        full_marks: 100,
        pass_marks: 33,
        type: "theory",
      })));
    } else {
      setData("schedules", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects, selectedClass]);

  const handleScheduleChange = (index: number, field: keyof ScheduleData, value: string | number) => {
    const newSchedules = [...data.schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setData("schedules", newSchedules);
  };

  const queryClient = useQueryClient();
  const scheduleMutation = useMutation({
    mutationFn: (payload: { exam_id: string; schedules: ScheduleData[] }) =>
      axios.post('/examination/schedules', payload),
    onSuccess: () => {
      toast.success('Schedules created successfully.');
      queryClient.invalidateQueries({ queryKey: ['schedules', data.exam_id] });
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.exam_id) {
      toast.error('Please select an exam.');
      return;
    }

    // Filter out rows that have no exam date set
    const validSchedules = data.schedules.filter(s => s.exam_date !== '');

    if (validSchedules.length === 0) {
      toast.error('Please provide an exam date for at least one subject.');
      return;
    }

    router.post('/examination/schedules', { exam_id: data.exam_id, schedules: validSchedules }, {
      onSuccess: () => toast.success('Schedules created successfully.'),
    });
  };

  return (
    <>
      <Head title="Add Schedules" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...SCHEDULE_LIST_BREADCRUMBS,
            { title: "Add Schedules", href: "#" }
          ]}
          icon={BookOpen}
          title="ADD SCHEDULES"
          subtitle={exam ? `Create schedules for ${exam.name}` : "Create new exam schedules"}
        />

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Setup Schedule</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Exam</Label>
                <Select value={selectedExamId} onValueChange={handleExamChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select an exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map(e => (
                      <SelectItem key={e.id} value={e.id ? e.id.toString() : `exam-${e.name}`}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.exam_id && <p className="text-sm text-destructive mt-1">{errors.exam_id}</p>}
              </div>

              {exam && (
                <div>
                  <Label>Class</Label>
                  <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(c => (
                        <SelectItem key={c.id} value={c.id ? c.id.toString() : `class-${c.name}`}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {exam && selectedClassId && subjects.length === 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-amber-600">No Subjects Allocated</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The selected class does not have any subjects allocated to its stream. You must assign subjects to this class's stream before you can create a schedule.
              </p>
              <Button disabled variant="secondary">Save Schedules</Button>
            </CardContent>
          </Card>
        )}

        {exam && selectedClassId && subjects.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Class Subjects</h3>
              <p className="text-sm text-muted-foreground">
                Set the exam dates and marks for the subjects. Leave date blank to skip a subject.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Exam Date</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Full Marks</TableHead>
                      <TableHead>Pass Marks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject, index) => {
                      const schedule = data.schedules[index];
                      if (!schedule) return null;

                      return (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">
                            {subject.name}
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={schedule.type} 
                              onValueChange={val => handleScheduleChange(index, "type", val)}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="theory">Theory</SelectItem>
                                <SelectItem value="practical">Practical</SelectItem>
                                <SelectItem value="viva">Viva</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <DatePicker
                              date={schedule.exam_date ? new Date(schedule.exam_date) : undefined}
                              setDate={(d) => handleScheduleChange(index, "exam_date", d ? format(d, 'yyyy-MM-dd') : "")}
                              placeholder="Select date"
                            />
                            {errors[`schedules.${index}.exam_date`] && (
                              <p className="text-sm text-destructive mt-1">{errors[`schedules.${index}.exam_date`]}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <SmartDateTimePicker
                              mode="time"
                              value={schedule.start_time ? parse(schedule.start_time, 'HH:mm', new Date()) : undefined}
                              onChange={(d) => handleScheduleChange(index, "start_time", d ? format(d, 'HH:mm') : "")}
                              placeholder="Select time"
                            />
                            {errors[`schedules.${index}.start_time`] && (
                              <p className="text-sm text-destructive mt-1">{errors[`schedules.${index}.start_time`]}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <SmartDateTimePicker
                              mode="time"
                              value={schedule.end_time ? parse(schedule.end_time, 'HH:mm', new Date()) : undefined}
                              onChange={(d) => handleScheduleChange(index, "end_time", d ? format(d, 'HH:mm') : "")}
                              placeholder="Select time"
                            />
                            {errors[`schedules.${index}.end_time`] && (
                              <p className="text-sm text-destructive mt-1">{errors[`schedules.${index}.end_time`]}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={schedule.full_marks}
                              onChange={e => handleScheduleChange(index, "full_marks", e.target.value)}
                              className="w-24"
                            />
                            {errors[`schedules.${index}.full_marks`] && (
                              <p className="text-sm text-destructive mt-1">{errors[`schedules.${index}.full_marks`]}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={schedule.pass_marks}
                              onChange={e => handleScheduleChange(index, "pass_marks", e.target.value)}
                              className="w-24"
                            />
                            {errors[`schedules.${index}.pass_marks`] && (
                              <p className="text-sm text-destructive mt-1">{errors[`schedules.${index}.pass_marks`]}</p>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <div className="flex justify-end gap-2 mt-6">
                  <Link href={`/examination/schedules${data.exam_id ? `?exam_id=${data.exam_id}` : ''}`}>
                    <Button type="button" variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={processing}>Save Schedules</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
