import { Head, Link, router } from "@inertiajs/react";
import { SCHEDULE_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Pencil, Trash, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

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
  search?: string;
}

export default function SchedulesIndex({ schedules, exams, selectedExamId, search }: SchedulesIndexProps) {
  const [searchTerm, setSearchTerm] = useState(search || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (search || "")) {
        router.get(
          "/examination/schedules",
          { exam_id: selectedExamId || "", search: searchTerm },
          { preserveState: true, replace: true }
        );
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleExamChange = (value: string) => {
    const examId = value === "all" ? "" : value;
    router.get(
      "/examination/schedules",
      { exam_id: examId, search: searchTerm },
      { preserveState: true }
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "—";
    try {
      const parts = timeStr.split(':');
      if (parts.length < 2) return timeStr;
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
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
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto flex-1 max-w-xl">
              {/* Filter Dropdown */}
              <div className="w-full sm:w-48">
                <Select value={selectedExamId || "all"} onValueChange={handleExamChange}>
                  <SelectTrigger className="h-10">
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

              {/* Search Box */}
              <div className="relative w-full flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search class or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10 w-full bg-background"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="w-full sm:w-auto flex justify-end">
              <Link href={`/examination/schedules/create${selectedExamId ? `?exam_id=${selectedExamId}` : ''}`}>
                <Button variant="default" className="h-10">
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
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="size-3 text-muted-foreground" />
                            {formatDate(schedule.exam_date)}
                          </span>
                          {(schedule.start_time || schedule.end_time) && (
                            <span className="text-xs text-muted-foreground mt-0.5">
                              {formatTime(schedule.start_time)} to {formatTime(schedule.end_time)}
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
