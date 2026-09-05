import React, { useState, useMemo, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { PageHeader } from "@/components/shared/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AsyncSelectField } from "@/components/shared/AsyncSelectField";
import StudentApi from "@/lib/api/studentApi";
import lmsApi from "@/lib/api/lmsApi";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, Users, School, Search, CheckCheck, XCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PREMIUM_INPUT_CLASSES, PREMIUM_LABEL_CLASSES } from "@/components/shared/form/types";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const YEARS = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());

export default function AdHocCharges({ auth }: any) {
  const institutionId = auth.current_institution_id || auth.user?.institution_id;
  const queryClient = useQueryClient();

  // Target Mode: 'all' (All Classes / Entire School) or 'class' (Specific Class)
  const [targetScope, setTargetScope] = useState<"all" | "class">("all");
  const [classId, setClassId] = useState<string>("");
  const [studentSearch, setStudentSearch] = useState("");
  const shouldAutoSelectAll = useRef(true);

  const [chargeName, setChargeName] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [remarks, setRemarks] = useState("");
  
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());

  const classAsyncConfig = useMemo(() => ({
    queryFn: async (params: any) => {
      const res = await lmsApi.classes.index({ ...params, institution_id: institutionId, per_page: 500 });
      return { data: res.data?.data || res.data || [] }; 
    },
    queryKey: ["lms-classes", institutionId],
    labelKey: "name",
    valueKey: "id",
    searchKey: "search",
  }), [institutionId]);

  // Fetch students based on targetScope
  const { data: rawStudents, isLoading } = useQuery({
    queryKey: ["students-list", institutionId, targetScope, targetScope === "class" ? classId : "all"],
    queryFn: async () => {
      if (targetScope === "class" && !classId) return [];
      const params: Record<string, any> = { 
        institution_id: institutionId, 
        status: 1, 
        per_page: 5000 
      };
      if (targetScope === "class" && classId) {
        params.lms_class_id = classId;
      }
      const res = await StudentApi.getStudentList(params);
      return res.data || [];
    },
    enabled: !!institutionId && (targetScope === "all" || !!classId),
  });

  const students = Array.isArray(rawStudents) ? rawStudents : [];

  // Auto-select students when switching to "all" or when class changes
  useEffect(() => {
    if (shouldAutoSelectAll.current && students.length > 0) {
      setSelectedStudents(new Set(students.map((s: any) => s.id)));
      shouldAutoSelectAll.current = false;
    }
  }, [students]);

  const handleTargetScopeChange = (newScope: "all" | "class") => {
    if (newScope === targetScope) return;
    setTargetScope(newScope);
    setStudentSearch("");
    if (newScope === "all") {
      shouldAutoSelectAll.current = true;
    } else {
      setSelectedStudents(new Set());
      shouldAutoSelectAll.current = true;
    }
  };

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!students || students.length === 0) return [];
    if (!studentSearch.trim()) return students;
    const q = studentSearch.toLowerCase().trim();
    return students.filter((s: any) => {
      const name = (s.name || "").toLowerCase();
      const regNo = (s.student_profile?.reg_no || "").toLowerCase();
      const rollNo = (s.student_profile?.roll_no || "").toLowerCase();
      const streamName = (s.student_profile?.stream?.name || "").toLowerCase();
      return name.includes(q) || regNo.includes(q) || rollNo.includes(q) || streamName.includes(q);
    });
  }, [students, studentSearch]);

  const allFilteredSelected = filteredStudents.length > 0 && filteredStudents.every((s: any) => selectedStudents.has(s.id));
  const someFilteredSelected = filteredStudents.some((s: any) => selectedStudents.has(s.id)) && !allFilteredSelected;

  const toggleStudent = (id: number) => {
    const newSet = new Set(selectedStudents);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedStudents(newSet);
  };

  const toggleAllVisible = () => {
    if (allFilteredSelected) {
      const newSet = new Set(selectedStudents);
      filteredStudents.forEach((s: any) => newSet.delete(s.id));
      setSelectedStudents(newSet);
    } else {
      const newSet = new Set(selectedStudents);
      filteredStudents.forEach((s: any) => newSet.add(s.id));
      setSelectedStudents(newSet);
    }
  };

  const selectAllStudents = () => {
    if (students && students.length > 0) {
      setSelectedStudents(new Set(students.map((s: any) => s.id)));
    }
  };

  const deselectAllStudents = () => {
    setSelectedStudents(new Set());
  };

  // Logs Tab States
  const [logsPage, setLogsPage] = useState(1);
  const [logsSearch, setLogsSearch] = useState("");
  const [logsClassId, setLogsClassId] = useState<string>("");
  const [logsMonth, setLogsMonth] = useState<string>("");
  const [logsYear, setLogsYear] = useState<string>("");

  const { data: logsData, isLoading: loadingLogs } = useQuery({
    queryKey: ["ad-hoc-logs", institutionId, logsPage, logsSearch, logsClassId, logsMonth, logsYear],
    queryFn: async () => {
      const params: any = { institution_id: institutionId, page: logsPage, per_page: 20 };
      if (logsSearch) params.search = logsSearch;
      if (logsClassId) params.lms_class_id = logsClassId;
      if (logsMonth && logsYear) params.for_month = `${logsYear}-${logsMonth}`;
      
      const res = await axios.get("/api/v1/fees/ad-hoc-charges", { params });
      return res.data;
    },
    enabled: !!institutionId,
  });

  const logs = logsData?.data || [];
  const logsPagination = logsData || {};

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/v1/fees/ad-hoc-charges/${id}`);
    },
    onSuccess: () => {
      toast.success("Charge deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["ad-hoc-logs", institutionId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete.");
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        institution_id: institutionId,
        target_type: targetScope,
        user_ids: Array.from(selectedStudents),
        name: chargeName,
        amount: Number(chargeAmount),
        for_month: `${selectedYear}-${selectedMonth}`,
        remarks,
      };
      const { data } = await axios.post("/api/v1/fees/ad-hoc-charges", payload);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Charges assigned successfully.");
      setChargeName("");
      setChargeAmount("");
      setRemarks("");
      if (targetScope === "all" && students.length > 0) {
        setSelectedStudents(new Set(students.map((s: any) => s.id)));
      } else {
        setSelectedStudents(new Set());
      }
      queryClient.invalidateQueries({ queryKey: ["ad-hoc-logs", institutionId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to assign charges.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudents.size === 0) {
      toast.error("Please select at least one student.");
      return;
    }
    submitMutation.mutate();
  };

  return (
    <>
      <Head title="Ad-Hoc Charges" />
      <div className="p-6 space-y-6 w-full">
        <PageHeader 
          title="Ad-Hoc Charges (Bulk Assignment)" 
          description="Assign events, functions, or penalty charges to students across all classes or a specific class. These will appear directly in their ledger."
        />

        <Tabs defaultValue="assign" className="space-y-6">
          <TabsList className="w-full sm:w-auto h-auto p-1 bg-muted/50 border border-border/50 rounded-xl inline-flex flex-wrap md:flex-nowrap">
            <TabsTrigger value="assign" className="flex-1 md:flex-none">Assign Charges</TabsTrigger>
            <TabsTrigger value="logs" className="flex-1 md:flex-none">Assignment Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="assign" className="m-0 border-none p-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Charge Details Card */}
              <Card className="md:col-span-4 lg:col-span-3 h-fit">
                <CardHeader>
                  <CardTitle>Charge Details</CardTitle>
                  <CardDescription>Specify the amount and month</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Active Target Banner */}
                    <div className={cn(
                      "p-3 rounded-xl border flex items-center justify-between text-xs transition-colors",
                      targetScope === "all"
                        ? "bg-primary/5 border-primary/20 text-primary"
                        : "bg-muted/50 border-border/60 text-muted-foreground"
                    )}>
                      <div className="flex items-center gap-2 font-medium">
                        {targetScope === "all" ? (
                          <>
                            <Users className="size-4 text-primary" />
                            <span>All Classes</span>
                          </>
                        ) : (
                          <>
                            <School className="size-4 text-muted-foreground" />
                            <span>Specific Class</span>
                          </>
                        )}
                      </div>
                      <Badge variant={selectedStudents.size > 0 ? "default" : "secondary"} className="text-xs font-bold">
                        {selectedStudents.size} selected
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className={PREMIUM_LABEL_CLASSES}>Charge Name</Label>
                      <Input 
                        value={chargeName} 
                        onChange={e => setChargeName(e.target.value)} 
                        placeholder="e.g. Annual Function Fee" 
                        autoComplete="off"
                        required 
                        className={PREMIUM_INPUT_CLASSES}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={PREMIUM_LABEL_CLASSES}>Amount (Rs)</Label>
                      <Input 
                        type="number" 
                        value={chargeAmount} 
                        onChange={e => setChargeAmount(e.target.value)} 
                        placeholder="0.00" 
                        required 
                        min="1"
                        className={PREMIUM_INPUT_CLASSES}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={PREMIUM_LABEL_CLASSES}>For Month</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={selectedMonth} onValueChange={setSelectedMonth} required>
                          <SelectTrigger className={PREMIUM_INPUT_CLASSES}>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {MONTHS.map(m => (
                              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={selectedYear} onValueChange={setSelectedYear} required>
                          <SelectTrigger className={PREMIUM_INPUT_CLASSES}>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {YEARS.map(y => (
                              <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className={PREMIUM_LABEL_CLASSES}>Remarks (Optional)</Label>
                      <Input 
                        value={remarks} 
                        onChange={e => setRemarks(e.target.value)} 
                        placeholder="Reason or notes..." 
                        autoComplete="off"
                        className={PREMIUM_INPUT_CLASSES}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20" 
                      disabled={submitMutation.isPending || selectedStudents.size === 0}
                    >
                      {submitMutation.isPending ? (
                        "Assigning..."
                      ) : targetScope === "all" ? (
                        `Assign to All ${selectedStudents.size} Students`
                      ) : (
                        `Assign to ${selectedStudents.size} Students`
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Student Selection Card */}
              <Card className="md:col-span-8 lg:col-span-9">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Select Students</CardTitle>
                      <CardDescription>
                        {targetScope === "all" 
                          ? "Charge will be applied to students across all classes" 
                          : "Filter by class and select target students"}
                      </CardDescription>
                    </div>

                    {/* Target Scope Switcher (All Classes vs Specific Class) */}
                    <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleTargetScopeChange("all")}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                          targetScope === "all"
                            ? "bg-background text-foreground shadow-sm border border-border/40 font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Users className="size-3.5 text-primary" />
                        <span>All Classes (Entire School)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTargetScopeChange("class")}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                          targetScope === "class"
                            ? "bg-background text-foreground shadow-sm border border-border/40 font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <School className="size-3.5" />
                        <span>Specific Class</span>
                      </button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Scope Specific Header / Filters */}
                  {targetScope === "class" ? (
                    <div className="max-w-sm space-y-2">
                      <Label className={PREMIUM_LABEL_CLASSES}>Class</Label>
                      <AsyncSelectField
                        asyncConfig={classAsyncConfig}
                        value={classId}
                        onChange={(val: any) => {
                          setClassId(val || "");
                          shouldAutoSelectAll.current = true;
                          setSelectedStudents(new Set());
                        }}
                        placeholder="Select Class..."
                        menuPortalTarget={document.body}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Sparkles className="size-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground">All Classes Selected</div>
                          <div className="text-xs text-muted-foreground">
                            {isLoading ? "Loading students..." : `Total ${students.length} active students found across all classes.`}
                          </div>
                        </div>
                      </div>
                      
                      {students.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={selectAllStudents}
                            className="h-8 text-xs font-bold bg-background shadow-xs hover:bg-muted"
                          >
                            <CheckCheck className="size-3.5 mr-1 text-primary" />
                            Select All ({students.length})
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={deselectAllStudents}
                            className="h-8 text-xs font-medium text-muted-foreground hover:text-destructive"
                          >
                            <XCircle className="size-3.5 mr-1" />
                            Deselect All
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Search and Action Bar when students are available */}
                  {students && students.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      <div className="relative w-full sm:w-80">
                        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <Input
                          placeholder="Search by name, class, reg or roll no..."
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          className={cn(PREMIUM_INPUT_CLASSES, "pl-9 h-9 text-xs")}
                        />
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 text-xs text-muted-foreground">
                        <span className="font-medium">
                          Showing <strong className="text-foreground">{filteredStudents.length}</strong> of <strong className="text-foreground">{students.length}</strong> students
                        </span>
                        {targetScope === "class" && (
                          <div className="flex items-center gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={selectAllStudents}
                              className="h-7 text-[11px] font-semibold"
                            >
                              Select All
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={deselectAllStudents}
                              className="h-7 text-[11px] font-semibold text-muted-foreground hover:text-destructive"
                            >
                              Deselect All
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Student Table */}
                  {isLoading ? (
                    <div className="py-12 text-center text-muted-foreground border rounded-xl bg-muted/10">
                      Loading students...
                    </div>
                  ) : filteredStudents.length > 0 ? (
                    <div className="border rounded-xl overflow-hidden bg-background max-h-[460px] overflow-y-auto">
                      <Table>
                        <TableHeader className="bg-muted/60 sticky top-0 z-10 backdrop-blur-xs">
                          <TableRow>
                            <TableHead className="w-12 text-center">
                              <Checkbox 
                                checked={allFilteredSelected || (someFilteredSelected ? "indeterminate" : false)}
                                onCheckedChange={toggleAllVisible}
                                aria-label="Select all visible"
                              />
                            </TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Class / Stream</TableHead>
                            <TableHead>Registration No.</TableHead>
                            <TableHead>Roll No.</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStudents.map((student: any) => (
                            <TableRow key={student.id} className="hover:bg-muted/30">
                              <TableCell className="text-center">
                                <Checkbox 
                                  checked={selectedStudents.has(student.id)}
                                  onCheckedChange={() => toggleStudent(student.id)}
                                  aria-label={`Select ${student.name}`}
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="text-foreground font-semibold text-xs">{student.name}</div>
                                {student.email && (
                                  <div className="text-[11px] text-muted-foreground">{student.email}</div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs font-normal bg-muted/40">
                                  {student.student_profile?.stream?.name || "—"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {student.student_profile?.reg_no || "—"}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground font-mono">
                                {student.student_profile?.roll_no || "—"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground border rounded-xl bg-muted/10 border-dashed">
                      {targetScope === "class" && !classId
                        ? "Select a class to view students."
                        : studentSearch
                        ? `No students matching "${studentSearch}".`
                        : "No students found."}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="m-0 border-none p-0 outline-none">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Logs</CardTitle>
                <CardDescription>History of ad-hoc charges assigned to students.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="space-y-2 flex-1">
                    <Label className={PREMIUM_LABEL_CLASSES}>Search</Label>
                    <Input 
                      placeholder="Search by student, reg no or charge name..." 
                      value={logsSearch}
                      onChange={(e) => { setLogsSearch(e.target.value); setLogsPage(1); }}
                      className={PREMIUM_INPUT_CLASSES}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label className={PREMIUM_LABEL_CLASSES}>Filter by Class</Label>
                    <AsyncSelectField
                      asyncConfig={classAsyncConfig}
                      value={logsClassId}
                      onChange={(val: any) => { setLogsClassId(val || ""); setLogsPage(1); }}
                      placeholder="All Classes..."
                      menuPortalTarget={document.body}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={PREMIUM_LABEL_CLASSES}>For Month</Label>
                    <div className="flex gap-2">
                      <Select value={logsMonth} onValueChange={(val) => { setLogsMonth(val === "all" ? "" : val); setLogsPage(1); }}>
                        <SelectTrigger className={cn(PREMIUM_INPUT_CLASSES, "w-[120px]")}>
                          <SelectValue placeholder="All Months" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Months</SelectItem>
                          {MONTHS.map(m => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={logsYear} onValueChange={(val) => { setLogsYear(val === "all" ? "" : val); setLogsPage(1); }}>
                        <SelectTrigger className={cn(PREMIUM_INPUT_CLASSES, "w-[100px]")}>
                          <SelectValue placeholder="All Years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Years</SelectItem>
                          {YEARS.map(y => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {loadingLogs ? (
                  <div className="py-12 text-center text-muted-foreground border rounded-md bg-muted/10">Loading logs...</div>
                ) : logs && logs.length > 0 ? (
                  <div className="space-y-4">
                    <div className="border rounded-md overflow-hidden bg-background">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>Date Assigned</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Charge Name</TableHead>
                            <TableHead>For Month</TableHead>
                            <TableHead className="text-right">Amount (₹)</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {logs.map((log: any) => (
                            <TableRow key={log.id} className="hover:bg-muted/30">
                              <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
                                {format(new Date(log.created_at), "dd MMM yyyy, p")}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-sm">{log.user?.name}</div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                  {log.user?.student_profile?.stream?.name && (
                                    <span className="font-medium text-foreground/80">{log.user.student_profile.stream.name} •</span>
                                  )}
                                  <span>{log.user?.student_profile?.reg_no || "—"}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-sm text-primary">{log.name}</div>
                                {log.remarks && <div className="text-xs text-muted-foreground">{log.remarks}</div>}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs bg-muted/50">{format(new Date(`${log.for_month}-01`), "MMM yyyy")}</Badge>
                              </TableCell>
                              <TableCell className="text-right font-bold tabular-nums">
                                {Number(log.amount).toLocaleString('en-IN')}
                              </TableCell>
                              <TableCell className="text-center">
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                    onClick={() => {
                                      if(confirm("Are you sure you want to delete this charge? It will be removed from their ledger immediately.")) {
                                        deleteMutation.mutate(log.id);
                                      }
                                    }}
                                    disabled={deleteMutation.isPending}
                                  >
                                    <Trash2 className="size-4" />
                                 </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground font-medium">
                        Showing {logsPagination.from || 0} to {logsPagination.to || 0} of {logsPagination.total || 0} entries
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setLogsPage(p => Math.max(1, p - 1))}
                          disabled={!logsPagination.prev_page_url}
                          className="font-bold shadow-sm"
                        >
                          Previous
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setLogsPage(p => p + 1)}
                          disabled={!logsPagination.next_page_url}
                          className="font-bold shadow-sm"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground border rounded-md bg-muted/10 border-dashed">
                    No assignment logs found matching your filters.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
