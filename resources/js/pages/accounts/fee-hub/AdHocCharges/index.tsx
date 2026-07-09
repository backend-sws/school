import React, { useState, useMemo } from "react";
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
import { Trash2 } from "lucide-react";
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
  const [classId, setClassId] = useState<string>("");
  const [chargeName, setChargeName] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [remarks, setRemarks] = useState("");
  
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());

  const classAsyncConfig = useMemo(() => ({
    queryFn: async (params: any) => {
      const res = await lmsApi.classes.index({ ...params, institution_id: institutionId, per_page: 500 });
      // Depending on API response shape, extract array
      return { data: res.data?.data || res.data || [] }; 
    },
    queryKey: ["lms-classes", institutionId],
    labelKey: "name",
    valueKey: "id",
    searchKey: "search",
  }), [institutionId]);

  // Fetch students based on class
  const { data: students, isLoading } = useQuery({
    queryKey: ["students-list", institutionId, classId],
    queryFn: async () => {
      if (!classId) return [];
      const res = await StudentApi.getStudentList({ institution_id: institutionId, lms_class_id: classId, status: 1 });
      return res.data;
    },
    enabled: !!classId,
  });

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

  const toggleStudent = (id: number) => {
    const newSet = new Set(selectedStudents);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedStudents(newSet);
  };

  const toggleAll = () => {
    if (!students) return;
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map((s: any) => s.id)));
    }
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        institution_id: institutionId,
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
      setSelectedStudents(new Set());
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
          description="Assign events, functions, or penalty charges to specific students. These will appear in their ledger."
        />

        <Tabs defaultValue="assign" className="space-y-6">
          <TabsList className="w-full sm:w-auto h-auto p-1 bg-muted/50 border border-border/50 rounded-xl inline-flex flex-wrap md:flex-nowrap">
            <TabsTrigger value="assign" className="flex-1 md:flex-none">Assign Charges</TabsTrigger>
            <TabsTrigger value="logs" className="flex-1 md:flex-none">Assignment Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="assign" className="m-0 border-none p-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <Card className="md:col-span-4 lg:col-span-3 h-fit">
                <CardHeader>
                  <CardTitle>Charge Details</CardTitle>
                  <CardDescription>Specify the amount and month</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                      {submitMutation.isPending ? "Assigning..." : `Assign to ${selectedStudents.size} Students`}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="md:col-span-8 lg:col-span-9">
                <CardHeader>
                  <CardTitle>Select Students</CardTitle>
                  <CardDescription>Filter by class and select target students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-w-sm space-y-2">
                    <Label className={PREMIUM_LABEL_CLASSES}>Class</Label>
                    <AsyncSelectField
                      asyncConfig={classAsyncConfig}
                      value={classId}
                      onChange={(val: any) => {
                        setClassId(val || "");
                        setSelectedStudents(new Set());
                      }}
                      placeholder="Select Class..."
                      menuPortalTarget={document.body}
                    />
                  </div>

                  {isLoading ? (
                    <div className="py-12 text-center text-muted-foreground border rounded-md bg-muted/10">Loading students...</div>
                  ) : students && students.length > 0 ? (
                    <div className="border rounded-md overflow-hidden bg-background">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="w-12 text-center">
                              <Checkbox 
                                checked={selectedStudents.size === students.length && students.length > 0}
                                onCheckedChange={toggleAll}
                                aria-label="Select all"
                              />
                            </TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Registration No.</TableHead>
                            <TableHead>Roll No.</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student: any) => (
                            <TableRow key={student.id} className="hover:bg-muted/30">
                              <TableCell className="text-center">
                                <Checkbox 
                                  checked={selectedStudents.has(student.id)}
                                  onCheckedChange={() => toggleStudent(student.id)}
                                  aria-label={`Select ${student.name}`}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.student_profile?.reg_no || "—"}</TableCell>
                              <TableCell>{student.student_profile?.roll_no || "—"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground border rounded-md bg-muted/10 border-dashed">
                      {classId ? "No students found in this class." : "Select a class to view students."}
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
                                <div className="text-xs text-muted-foreground">{log.user?.student_profile?.reg_no}</div>
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
