import { Head, Link, router } from "@inertiajs/react";
import { EXAM_LIST_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Printer, Eye, Award, ChevronDown, FileText, Grid, Megaphone, EyeOff } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

interface ExamResultsIndexProps {
  exam: Record<string, unknown> & {
    id: number;
    name: string;
    is_published?: boolean;
  };
  results: {
    student_id: number;
    name: string;
    admission_no: string;
    class_name: string;
    total_obtained: number;
    total_full_marks: number;
    overall_percentage: number;
    overall_grade: string;
    result_status: string;
    all_passed: boolean;
  }[];
}

export default function ExamResultsIndex({ exam, results }: ExamResultsIndexProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const isPublished = Boolean(exam.is_published);

  const handleTogglePublish = () => {
    router.patch(`/examination/exams/${exam.id}/publish`, {}, {
      preserveScroll: true,
      onSuccess: () => toast.success(isPublished ? "Results unpublished" : "Results published"),
      onError: () => toast.error("Failed to update publish status"),
    });
  };

  const toggleAll = () => {
    if (selectedIds.length === results.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(results.map(r => r.student_id));
    }
  };

  const toggleOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handlePrint = (type: 'marksheets' | 'summary' | 'broadsheet') => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one student to print.");
      return;
    }

    // We create a temporary form to POST to the bulk-print route in a new tab
    const form = document.createElement("form");
    form.method = "POST";
    
    if (type === 'summary') {
      form.action = `/examination/exams/${exam.id}/results/print-summary`;
    } else if (type === 'broadsheet') {
      form.action = `/examination/exams/${exam.id}/results/print-broadsheet`;
    } else {
      form.action = `/examination/exams/${exam.id}/marksheets/bulk-print`;
    }
    
    form.target = "_blank"; // Open in new tab
    
    // Add CSRF token
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      const csrfInput = document.createElement("input");
      csrfInput.type = "hidden";
      csrfInput.name = "_token";
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);
    }

    // Add selected student IDs
    selectedIds.forEach((id) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "student_ids[]";
      input.value = id.toString();
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    toast.success(`Preparing ${type} print view...`);
  };

  return (
    <>
      <Head title={`Results: ${exam.name}`} />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...EXAM_LIST_BREADCRUMBS,
            { title: exam.name, href: `/examination/exams/${exam.id}` },
            { title: "Results", href: "#" }
          ]}
          icon={Award}
          title={`${exam.name} Results`}
          subtitle="Results are generated automatically after marks are saved. Publish to make them visible to students."
        />
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {results.length} students found
            {exam.is_published ? " · Published" : " · Draft"}
          </p>
          <div className="flex gap-2">
            <Button
              variant={isPublished ? "outline" : "default"}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="default" 
                  disabled={selectedIds.length === 0}
                >
                  <Printer className="size-4 mr-2" />
                  Print Selected ({selectedIds.length})
                  <ChevronDown className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handlePrint('marksheets')}>
                  <Printer className="size-4 mr-2" />
                  Individual Marksheets
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePrint('summary')}>
                  <FileText className="size-4 mr-2" />
                  Result Summary (List)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePrint('broadsheet')}>
                  <Grid className="size-4 mr-2" />
                  Tabulation Broadsheet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardHeader className="py-4">
            <h3 className="text-lg font-medium">Student Results</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">
                    <Checkbox 
                      checked={selectedIds.length === results.length && results.length > 0}
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-center">Total Marks</TableHead>
                  <TableHead className="text-center">Percentage</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No results found. Ensure schedules and enrollments exist.
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((result) => (
                    <TableRow key={result.student_id}>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={selectedIds.includes(result.student_id)}
                          onCheckedChange={() => toggleOne(result.student_id)}
                          aria-label={`Select ${result.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-xs text-muted-foreground">{result.admission_no}</div>
                      </TableCell>
                      <TableCell>{result.class_name}</TableCell>
                      <TableCell className="text-center font-medium">
                        {result.total_obtained} / {result.total_full_marks}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.overall_percentage.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {result.overall_grade ?? "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          result.result_status === 'PASS' 
                            ? 'bg-green-100 text-green-700' 
                            : (result.result_status === 'FAIL' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700')
                        }`}>
                          {result.result_status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/examination/exams/${exam.id}/marksheet/${result.student_id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="size-4 mr-2" />
                            View
                          </Button>
                        </Link>
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
