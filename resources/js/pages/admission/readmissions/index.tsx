import React, { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterGuide } from '@/components/GuideProvider';
import { READMISSIONS_GUIDE } from "@/constants/guides/readmissions";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterBar } from "@/components/filter-bar";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import Each from "@/components/Each";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { RotateCcw, UserPlus, History, Users } from "lucide-react";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
import { useAuth } from "@/hooks/use-can";
import { useInstitutionLabels } from "@/hooks/useInstitutionLabels";
import ReadmissionApi from "@/lib/api/readmissionApi";
import { ReadmissionQueryKeys } from "@/lib/querykey/readmission";
import { toast } from "sonner";
import { getSerialNumber } from "@/lib/utils";
import { ModalDialog } from "@/components/shared/Modal";
import {
  readmissionProcessSchema,
  READMISSION_PROCESS_DEFAULTS,
  bulkReadmissionSchema,
  BULK_READMISSION_DEFAULTS,
  type ReadmissionProcessFormValues,
  type BulkReadmissionFormValues,
} from "@/lib/validations/readmission";
import {
  getReadmissionProcessFormFields,
  getBulkReadmissionFormFields,
  READMISSION_BREADCRUMBS,
} from "@/constants/page/admin/readmission";

const ReadmissionsIndex = () => {
    const queryClient = useQueryClient();
    const { can } = useAuth();
    const hasSemester = can('use_semester_promotions');
    const { streamLabel, semesterLabel } = useInstitutionLabels();
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [isReadmitDialogOpen, setIsReadmitDialogOpen] = useState(false);
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("session-transfer");
    useRegisterGuide(READMISSIONS_GUIDE);

    // ─── Individual re-admission form ─────────────────────────────
    const { control, handleSubmit, reset, formState: { isValid } } = useForm<ReadmissionProcessFormValues>({
        resolver: zodResolver(readmissionProcessSchema),
        defaultValues: READMISSION_PROCESS_DEFAULTS,
        mode: "onChange",
    });

    // ─── Bulk re-admission form ─────────────────────────────────
    const bulkForm = useForm<BulkReadmissionFormValues>({
        resolver: zodResolver(bulkReadmissionSchema),
        defaultValues: BULK_READMISSION_DEFAULTS,
        mode: "onChange",
    });

    const { filter, handleFilter } = useSearchFilter({
        search_text: "",
        per_page: 15,
        page: 1,
    });

    const { data: sessionsRes } = useCollegeSessions({});
    const sessions = sessionsRes?.data ?? [];

    const sessionOptions = useMemo(
        () => sessions.map((s: any) => ({ key: String(s.id), value: String(s.id), text: s.name })),
        [sessions]
    );

    const formFields = useMemo(
        () => getReadmissionProcessFormFields(sessionOptions, semesterLabel, hasSemester),
        [sessionOptions, semesterLabel, hasSemester]
    );

    const bulkFormFields = useMemo(
        () => getBulkReadmissionFormFields(sessionOptions, semesterLabel, hasSemester),
        [sessionOptions, semesterLabel, hasSemester]
    );

    // ─── Queries ────────────────────────────────────────────────

    // Dropout-eligible students (original flow)
    const { data: eligibleRes, isLoading: isEligibleLoading } = useQuery({
        queryKey: ReadmissionQueryKeys.eligible(),
        queryFn: () => ReadmissionApi.eligible(),
        enabled: activeTab === "dropout-readmit",
    });

    // Session-transfer eligible students (new flow)
    const { data: sessionEligibleRes, isLoading: isSessionEligibleLoading } = useQuery({
        queryKey: ReadmissionQueryKeys.sessionEligible(),
        queryFn: () => ReadmissionApi.eligible({ include_active: true }),
        enabled: activeTab === "session-transfer",
    });

    const { data: historyRes, isLoading: isHistoryLoading } = useQuery({
        queryKey: ReadmissionQueryKeys.history({ page: filter.page, per_page: filter.per_page }),
        queryFn: () => ReadmissionApi.history({ page: filter.page, per_page: filter.per_page }),
    });

    const eligibleStudents = eligibleRes?.data ?? [];
    const sessionEligibleStudents = sessionEligibleRes?.data ?? [];
    const historyData = historyRes?.data ?? [];
    const historyMeta = historyRes?.meta;

    const filteredEligible = useMemo(() => {
        if (!filter.search_text) return eligibleStudents;
        const search = filter.search_text.toLowerCase();
        return eligibleStudents.filter((s: any) =>
            s.user?.name?.toLowerCase().includes(search) ||
            s.admission_no?.toLowerCase().includes(search)
        );
    }, [eligibleStudents, filter.search_text]);

    const filteredSessionEligible = useMemo(() => {
        if (!filter.search_text) return sessionEligibleStudents;
        const search = filter.search_text.toLowerCase();
        return sessionEligibleStudents.filter((s: any) =>
            s.user?.name?.toLowerCase().includes(search) ||
            s.reg_no?.toLowerCase().includes(search)
        );
    }, [sessionEligibleStudents, filter.search_text]);

    // ─── Mutations ──────────────────────────────────────────────

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ReadmissionQueryKeys.all });
    };

    const readmitMutation = useMutation({
        mutationFn: ReadmissionApi.process,
        onSuccess: () => {
            toast.success("Student re-admitted successfully.");
            setIsReadmitDialogOpen(false);
            setSelectedStudent(null);
            reset(READMISSION_PROCESS_DEFAULTS);
            invalidateAll();
        },
        onError: () => {
            toast.error("Failed to process re-admission.");
        }
    });

    const bulkMutation = useMutation({
        mutationFn: ReadmissionApi.bulk,
        onSuccess: (res: any) => {
            const data = res?.data;
            toast.success(`Bulk re-admission: ${data?.readmitted ?? 0} re-admitted, ${data?.skipped ?? 0} skipped.`);
            setIsBulkDialogOpen(false);
            bulkForm.reset(BULK_READMISSION_DEFAULTS);
            invalidateAll();
        },
        onError: () => {
            toast.error("Bulk re-admission failed.");
        },
    });

    const rollbackMutation = useMutation({
        mutationFn: ReadmissionApi.rollback,
        onSuccess: () => {
            toast.success("Re-admission rolled back successfully.");
            invalidateAll();
        },
        onError: () => {
            toast.error("Failed to rollback re-admission.");
        }
    });

    // ─── Handlers ───────────────────────────────────────────────

    const handleOpenReadmit = (student: any) => {
        setSelectedStudent(student);
        reset({
            ...READMISSION_PROCESS_DEFAULTS,
            to_semester: student.current_semester ? String(student.current_semester) : "",
        });
        setIsReadmitDialogOpen(true);
    };

    const onSubmit = (values: ReadmissionProcessFormValues) => {
        if (!selectedStudent) return;
        readmitMutation.mutate({
            student_profile_id: selectedStudent.id,
            to_session_id: Number(values.to_session_id),
            to_semester: values.to_semester ? Number(values.to_semester) : undefined,
            to_class_id: values.to_class_id ? Number(values.to_class_id) : undefined,
            to_stream_id: values.to_stream_id ? Number(values.to_stream_id) : undefined,
            dropout_reason: values.dropout_reason,
            gap_duration_months: values.gap_duration_months ? Number(values.gap_duration_months) : undefined,
            remarks: values.remarks,
            create_application: values.create_application,
        });
    };

    const onBulkSubmit = (values: BulkReadmissionFormValues) => {
        bulkMutation.mutate({
            to_session_id: Number(values.to_session_id),
            to_semester: values.to_semester ? Number(values.to_semester) : undefined,
            to_class_id: values.to_class_id ? Number(values.to_class_id) : undefined,
            from_session_id: Number(values.from_session_id),
            stream_id: values.stream_id ? Number(values.stream_id) : undefined,
        });
    };

    // ─── Shared table renderers ─────────────────────────────────

    const renderStudentRow = (student: any, index: number) => (
        <TableRow key={student.id}>
            <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                {index + 1}
            </TableCell>
            <TableCell>
                <div>
                    <p className="font-medium">{student.user?.name || "N/A"}</p>
                    <p className="text-xs text-muted-foreground font-mono">{student.reg_no || student.admission_no}</p>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className="capitalize">{student.enrollment_status}</Badge>
            </TableCell>
            <TableCell>{student.stream?.name || "—"}</TableCell>
            <TableCell>{student.session?.name || "—"}</TableCell>
            {hasSemester && (
                <TableCell>
                    {student.current_semester ? `${semesterLabel} ${student.current_semester}` : "—"}
                </TableCell>
            )}
            <TableCell>
                <TooltipWrapper content="Re-admit Student">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => handleOpenReadmit(student)}
                        disabled={!can('create_readmissions')}
                    >
                        <UserPlus className="size-4" />
                        <span className="sr-only">Re-admit</span>
                    </Button>
                </TooltipWrapper>
            </TableCell>
        </TableRow>
    );

    const studentColumns = [
        { key: "serial", label: "#" },
        { key: "student", label: "Student" },
        { key: "status", label: "Status" },
        { key: "stream", label: streamLabel },
        { key: "session", label: "Session" },
        ...(hasSemester ? [{ key: "semester", label: semesterLabel }] : []),
        { key: "actions", label: "Actions" },
    ];

    return (
        <>
            <Head title="Re-Admissions" />
            <TooltipProvider>
                <div className="space-y-6">
                    <MainPageHeader
                        id="readmissions-header"
                        breadcrumbs={READMISSION_BREADCRUMBS}
                        icon={UserPlus}
                    />

                    <Card id="readmissions-table">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <FilterBar values={filter} onChange={(u) => handleFilter({ ...u, page: 1 })}>
                                    <FilterBar.Renderer config={{ filters: [], search: { name: "search_text", placeholder: "Search by name or reg no..." } }} />
                                </FilterBar>

                                <div className="flex gap-2 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowHistory(!showHistory)}
                                    >
                                        {showHistory ? (
                                            <><UserPlus className="size-4 mr-2" /> Active Workflow</>
                                        ) : (
                                            <><History className="size-4 mr-2" /> View History</>
                                        )}
                                    </Button>

                                    {!showHistory && activeTab === "session-transfer" && (
                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={() => setIsBulkDialogOpen(true)}
                                            disabled={!can('bulk_readmit')}
                                        >
                                            <Users className="size-4 mr-2" />
                                            Bulk Re-Admit
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {showHistory ? (
                                <DataTable
                                    columns={[
                                        { key: "serial", label: "#" },
                                        { key: "student", label: "Student" },
                                        { key: "transition", label: "Target Session" },
                                        { key: "status", label: "Status" },
                                        { key: "date", label: "Date" },
                                        { key: "actions", label: "Actions" },
                                    ]}
                                    currentPage={historyMeta?.current_page ?? 1}
                                    lastPage={historyMeta?.last_page ?? 1}
                                    pageSize={filter.per_page}
                                    totalRecords={historyMeta?.total ?? 0}
                                    handlePageChange={(page) => handleFilter({ page })}
                                    handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
                                >
                                    <Each
                                        of={historyData}
                                        isLoading={isHistoryLoading}
                                        nodatafound={<TableEmptyState colSpan={6} message="No re-admission history found" />}
                                        fallback={<TableSkeletonLoader columns={6} />}
                                        render={(history: any, index: number) => (
                                            <TableRow key={history.id}>
                                                <TableCell className="text-muted-foreground font-mono text-sm">
                                                    {getSerialNumber(historyMeta?.current_page ?? 1, filter.per_page, index)}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-medium">{history.student?.user?.name || "—"}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-xs">
                                                        <p>Session: {history.to_session?.name}</p>
                                                        {history.to_semester && <p>Semester: {history.to_semester}</p>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={history.status === 'completed' ? 'default' : 'secondary'}>
                                                        {history.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(history.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => rollbackMutation.mutate(history.id)}
                                                        disabled={history.status === 'rolled_back'}
                                                    >
                                                        <RotateCcw className="size-4 mr-1" />
                                                        Rollback
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    />
                                </DataTable>
                            ) : (
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="session-transfer">
                                            <Users className="size-4 mr-2" />
                                            Session Transfer
                                        </TabsTrigger>
                                        <TabsTrigger value="dropout-readmit">
                                            <RotateCcw className="size-4 mr-2" />
                                            Dropout Re-Admit
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="session-transfer">
                                        <DataTable columns={studentColumns}>
                                            <Each
                                                of={filteredSessionEligible}
                                                isLoading={isSessionEligibleLoading}
                                                nodatafound={
                                                    <TableEmptyState
                                                        colSpan={studentColumns.length}
                                                        message="No students available for session transfer"
                                                        description="Active and promoted students will appear here for re-admission to the next session."
                                                    />
                                                }
                                                fallback={<TableSkeletonLoader columns={studentColumns.length} />}
                                                render={renderStudentRow}
                                            />
                                        </DataTable>
                                    </TabsContent>

                                    <TabsContent value="dropout-readmit">
                                        <DataTable
                                            columns={[
                                                { key: "serial", label: "#" },
                                                { key: "student", label: "Student" },
                                                { key: "status", label: "Current Status" },
                                                { key: "stream", label: `Last ${streamLabel}` },
                                                ...(hasSemester ? [{ key: "semester", label: `Last ${semesterLabel}` }] : []),
                                                { key: "actions", label: "Actions" },
                                            ]}
                                        >
                                            <Each
                                                of={filteredEligible}
                                                isLoading={isEligibleLoading}
                                                nodatafound={
                                                    <TableEmptyState
                                                        colSpan={6}
                                                        message="No eligible students for re-admission"
                                                        description="Students with 'dropped', 'alumni', or 'transferred' status are listed here."
                                                    />
                                                }
                                                fallback={<TableSkeletonLoader columns={6} />}
                                                render={(student: any, index: number) => (
                                                    <TableRow key={student.id}>
                                                        <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium">{student.user?.name || "N/A"}</p>
                                                                <p className="text-xs text-muted-foreground font-mono">{student.admission_no}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="capitalize">{student.enrollment_status}</Badge>
                                                        </TableCell>
                                                        <TableCell>{student.stream?.name || "—"}</TableCell>
                                                        {hasSemester && (
                                                            <TableCell>
                                                                {student.current_semester ? `${semesterLabel} ${student.current_semester}` : "—"}
                                                            </TableCell>
                                                        )}
                                                        <TableCell>
                                                            <TooltipWrapper content="Re-admit Student">
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="size-8 text-primary hover:text-primary hover:bg-primary/10"
                                                                    onClick={() => handleOpenReadmit(student)}
                                                                    disabled={!can('create_readmissions')}
                                                                >
                                                                    <UserPlus className="size-4" />
                                                                    <span className="sr-only">Re-admit</span>
                                                                </Button>
                                                            </TooltipWrapper>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            />
                                        </DataTable>
                                    </TabsContent>
                                </Tabs>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ─── Individual Re-Admission Dialog ─────────────────── */}
                <ModalDialog
                    open={isReadmitDialogOpen}
                    onClose={setIsReadmitDialogOpen}
                    title="Re-Admit Student"
                    description={`Processing re-admission for ${selectedStudent?.user?.name ?? ''}.`}
                    className="max-w-md"
                    onPrimaryClick={handleSubmit(onSubmit)}
                    submitLabel="Confirm Re-Admission"
                    primaryDisabled={!isValid}
                    isLoading={readmitMutation.isPending}
                >
                    <div className="grid gap-4">
                        <Each
                            of={formFields}
                            keyExtractor={(field: any) => field.name}
                            render={(field: any) => (
                                <ControlledFormComponent
                                    key={field.name}
                                    control={control}
                                    name={field.name}
                                    type={field.type}
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    options={field.options}
                                />
                            )}
                        />
                    </div>
                </ModalDialog>

                {/* ─── Bulk Re-Admission Dialog ────────────────────────── */}
                <ModalDialog
                    open={isBulkDialogOpen}
                    onClose={setIsBulkDialogOpen}
                    title="Bulk Re-Admission"
                    description="Re-admit all eligible students from one session to the next."
                    className="max-w-md"
                    onPrimaryClick={bulkForm.handleSubmit(onBulkSubmit)}
                    submitLabel="Start Bulk Re-Admission"
                    primaryDisabled={!bulkForm.formState.isValid}
                    isLoading={bulkMutation.isPending}
                >
                    <div className="grid gap-4">
                        <Each
                            of={bulkFormFields}
                            keyExtractor={(field: any) => field.name}
                            render={(field: any) => (
                                <ControlledFormComponent
                                    key={field.name}
                                    control={bulkForm.control}
                                    name={field.name}
                                    type={field.type}
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    options={field.options}
                                />
                            )}
                        />
                    </div>
                </ModalDialog>
            </TooltipProvider>
        </>
    );
};

export default ReadmissionsIndex;

