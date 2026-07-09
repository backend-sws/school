import React, { useMemo, useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRegisterGuide } from '@/components/GuideProvider';
import { PROMOTIONS_GUIDE } from "@/constants/guides/promotions";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FilterBar } from "@/components/filter-bar";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import Each from "@/components/Each";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRow, TableCell } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { ArrowUpCircle, History, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
import { useAuth } from "@/hooks/use-can";
import { useInstitutionLabels } from "@/hooks/useInstitutionLabels";
import PromotionApi from "@/lib/api/promotionApi";
import { toast } from "sonner";
import { getSerialNumber } from "@/lib/utils";
import { ModalDialog } from "@/components/shared/Modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const PromotionsIndex = () => {
const queryClient = useQueryClient();
    const { can } = useAuth();
    const hasSemester = can('use_semester_promotions');
    const { streamLabel, semesterLabel } = useInstitutionLabels();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
    const [bulkData, setBulkData] = useState({
        to_session_id: "",
        to_semester: "",
    });
    useRegisterGuide(PROMOTIONS_GUIDE);

    const { filter, handleFilter } = useSearchFilter({
        session_id: "",
        stream_id: "",
        semester: "",
        class_id: "",
        per_page: 15,
        page: 1,
    });

    const { data: streamsRes } = useCollegeStreams();
    const streams = streamsRes?.data ?? [];

    const { data: sessionsRes } = useCollegeSessions({});
    const sessions = sessionsRes?.data ?? [];

    const { data: eligibleRes, isLoading: isEligibleLoading } = useQuery({
        queryKey: ["promotions-eligible", filter],
        queryFn: () => PromotionApi.eligible(filter as any),
        enabled: !!filter.session_id,
    });

    const { data: historyRes, isLoading: isHistoryLoading } = useQuery({
        queryKey: ["promotions-history", filter.page, filter.per_page],
        queryFn: () => PromotionApi.history({ page: filter.page, per_page: filter.per_page }),
    });

    const eligibleStudents = eligibleRes?.data ?? [];
    const historyData = historyRes?.data ?? [];
    const historyMeta = historyRes?.meta;

    const bulkPromoteMutation = useMutation({
        mutationFn: PromotionApi.bulkPromote,
        onSuccess: (res) => {
            toast.success(`Successfully promoted ${res.data.promoted} students.`);
            setIsBulkDialogOpen(false);
            setSelectedIds([]);
            queryClient.invalidateQueries({ queryKey: ["promotions-eligible"] });
            queryClient.invalidateQueries({ queryKey: ["promotions-history"] });
        },
        onError: () => {
            toast.error("Failed to process bulk promotion.");
        }
    });

    const rollbackMutation = useMutation({
        mutationFn: PromotionApi.rollback,
        onSuccess: () => {
            toast.success("Transition rolled back successfully.");
            queryClient.invalidateQueries({ queryKey: ["promotions-eligible"] });
            queryClient.invalidateQueries({ queryKey: ["promotions-history"] });
        },
        onError: () => {
            toast.error("Failed to rollback transition.");
        }
    });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(eligibleStudents.map((s: any) => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const handleBulkPromote = () => {
        if (selectedIds.length === 0) {
            toast.error("Please select at least one student.");
            return;
        }
        setIsBulkDialogOpen(true);
    };

    const confirmBulkPromote = () => {
        bulkPromoteMutation.mutate({
            from_session_id: filter.session_id,
            to_session_id: bulkData.to_session_id,
            to_semester: bulkData.to_semester ? Number(bulkData.to_semester) : undefined,
            stream_id: filter.stream_id,
            semester: filter.semester ? Number(filter.semester) : undefined,
            class_id: filter.class_id,
            exclude_ids: eligibleStudents.filter((s: any) => !selectedIds.includes(s.id)).map((s: any) => s.id),
        });
    };

    const breadcrumbs = [
        { title: "Admission Cell", href: "/admission/applications" },
        { title: "Student Promotions", href: "/admission/promotions" },
    ];

    return (
        <>
            <Head title="Student Promotions" />
            <TooltipProvider>
                <div className="space-y-6">
                    <MainPageHeader
                        id="promotions-header"
                        breadcrumbs={breadcrumbs}
                        icon={ArrowUpCircle}
                    />

                    <Card id="promotions-table">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <FilterBar values={filter} onChange={(u) => handleFilter({ ...u, page: 1 })}>
                                    <FilterBar.Renderer config={{ filters: [{ name: "session_id", type: "select", label: "Current Session", placeholder: "Select session", options: sessions.map((s: any) => ({ value: String(s.id), label: s.name })) }, ...(!showHistory ? [{ name: "stream_id", type: "select", label: streamLabel, options: streams.map((s: any) => ({ value: String(s.id), label: s.name })) }, ...(hasSemester ? [{ name: "semester", type: "select", label: semesterLabel, options: Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: `${semesterLabel} ${i + 1}` })) }] : [])] : [])] }} />
                                </FilterBar>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowHistory(!showHistory)}
                                    className="shrink-0"
                                >
                                    {showHistory ? (
                                        <><ArrowUpCircle className="size-4 mr-2" /> Active Workflow</>
                                    ) : (
                                        <><History className="size-4 mr-2" /> View History</>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {showHistory ? (
                                <DataTable
                                    columns={[
                                        { key: "serial", label: "#" },
                                        { key: "student", label: "Student" },
                                        { key: "transition", label: "From → To" },
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
                                        nodatafound={<TableEmptyState colSpan={6} message="No promotion history found" />}
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
                                                        <p>Session: {history.from_session?.name} → {history.to_session?.name}</p>
                                                        {history.from_semester && <p>Semester: {history.from_semester} → {history.to_semester}</p>}
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
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="select-all"
                                                checked={selectedIds.length === eligibleStudents.length && eligibleStudents.length > 0}
                                                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                            />
                                            <label htmlFor="select-all" className="text-sm font-medium">Select All</label>
                                            <span className="text-xs text-muted-foreground ml-2">{selectedIds.length} selected</span>
                                        </div>
                                        <Button
                                            onClick={handleBulkPromote}
                                            disabled={selectedIds.length === 0 || bulkPromoteMutation.isPending}
                                        >
                                            <ArrowUpCircle className="size-4 mr-2" />
                                            Bulk Promote
                                        </Button>
                                    </div>

                                    <DataTable
                                        columns={[
                                            { key: "select", label: "" },
                                            { key: "serial", label: "#" },
                                            { key: "student", label: "Student" },
                                            { key: "stream", label: streamLabel },
                                            ...(hasSemester ? [{ key: "semester", label: semesterLabel }] : []),
                                            { key: "class", label: "Class" },
                                        ]}
                                    >
                                        <Each
                                            of={eligibleStudents}
                                            isLoading={isEligibleLoading}
                                            nodatafound={
                                                <TableEmptyState
                                                    colSpan={6}
                                                    message={filter.session_id ? "No eligible students found" : "Select a session to view eligible students"}
                                                    description="Only students with 'active' status are eligible for promotion."
                                                />
                                            }
                                            fallback={<TableSkeletonLoader columns={6} />}
                                            render={(student: any, index: number) => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="w-10">
                                                        <Checkbox
                                                            checked={selectedIds.includes(student.id)}
                                                            onCheckedChange={(checked) => handleSelectOne(student.id, !!checked)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{student.user?.name || "N/A"}</p>
                                                            <p className="text-xs text-muted-foreground">{student.admission_no}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{student.stream?.name || "—"}</TableCell>
                                                    {hasSemester && (
                                                        <TableCell>
                                                            <Badge variant="outline">{semesterLabel} {student.current_semester || "—"}</Badge>
                                                        </TableCell>
                                                    )}
                                                    <TableCell>{student.current_class?.name || "—"}</TableCell>
                                                </TableRow>
                                            )}
                                        />
                                    </DataTable>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <ModalDialog
                    open={isBulkDialogOpen}
                    onClose={setIsBulkDialogOpen}
                    title="Confirm Bulk Promotion"
                    description={`You are about to promote ${selectedIds.length} students. Please select the target session and semester.`}
                    onPrimaryClick={confirmBulkPromote}
                    submitLabel="Confirm Promotion"
                    primaryDisabled={!bulkData.to_session_id}
                    isLoading={bulkPromoteMutation.isPending}
                >
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="to-session">Target Session</Label>
                                <Select onValueChange={(v) => setBulkData(prev => ({ ...prev, to_session_id: v }))}>
                                    <SelectTrigger id="to-session">
                                        <SelectValue placeholder="Select session" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <Each
                                            of={sessions}
                                            keyExtractor={(s: any) => String(s.id)}
                                            render={(s: any) => (
                                            <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                        )}
                                        />
                                    </SelectContent>
                                </Select>
                            </div>
                            {hasSemester && (
                                <div className="grid gap-2">
                                    <Label htmlFor="to-semester">Target {semesterLabel} (Optional)</Label>
                                    <Select onValueChange={(v) => setBulkData(prev => ({ ...prev, to_semester: v }))}>
                                        <SelectTrigger id="to-semester">
                                            <SelectValue placeholder={`Select ${semesterLabel.toLowerCase()}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 10 }, (_, i) => (
                                                <SelectItem key={i + 1} value={String(i + 1)}>{semesterLabel} {i + 1}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                </ModalDialog>
            </TooltipProvider>
        </>
    );
};

export default PromotionsIndex;
