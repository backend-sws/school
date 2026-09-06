import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { toast } from 'sonner';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FileText, Download, Mail, CheckCircle2, Pencil, Plus, Trash2, RotateCcw } from 'lucide-react';
import DataTable, { TableEmptyState, TableSkeletonLoader } from '@/components/dataTable';
import Each from '@/components/Each';
import { TableRow, TableCell } from '@/components/ui/table';
import { parsePaginatedResponse, getSerialNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RunDetails({ payrollId }: { payrollId: string | number }) {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const { data: slipsData, isLoading } = useQuery({
        queryKey: ['payslips', payrollId, page, perPage],
        queryFn: async () => {
            const res = await api.get(`/hr/payrolls/${payrollId}/slips`, { params: { page, per_page: perPage } });
            return res;
        }
    });

    const { items: slips, meta } = parsePaginatedResponse<any>(slipsData);

    const emailMutation = useMutation({
        mutationFn: async (slipId: number) => {
            return await api.post(`/hr/payslips/${slipId}/email`);
        },
        onSuccess: () => {
            toast.success("Payslip emailed successfully to the staff member");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to send email");
        }
    });

    const recalculateSlipMutation = useMutation({
        mutationFn: async (slipId: number) => {
            return await api.post(`/hr/payslips/${slipId}/recalculate`);
        },
        onSuccess: () => {
            toast.success("Payslip recalculated from attendance & salary structure");
            queryClient.invalidateQueries({ queryKey: ['payslips', payrollId] });
            queryClient.invalidateQueries({ queryKey: ['payrolls'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to recalculate payslip");
        }
    });

    const handleExportBankSheet = () => {
        window.open(`/api/v1/hr/payrolls/${payrollId}/export-bank-sheet`, '_blank');
    };


    const [slipToEdit, setSlipToEdit] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        basic_pay: 0,
        total_earnings: 0,
        total_deductions: 0,
        component_breakdown: [] as any[]
    });

    const updateSlipMutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = {
                ...data,
                net_pay: Number(data.basic_pay) + Number(data.total_earnings) - Number(data.total_deductions)
            };
            return await api.put(`/hr/payslips/${slipToEdit.id}`, payload);
        },
        onSuccess: () => {
            toast.success("Payslip updated successfully");
            setSlipToEdit(null);
            queryClient.invalidateQueries({ queryKey: ['payslips', payrollId] });
            queryClient.invalidateQueries({ queryKey: ['payrolls'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update payslip");
        }
    });

    const openEditModal = (slip: any) => {
        setSlipToEdit(slip);
        setEditForm({
            basic_pay: slip.basic_pay,
            total_earnings: slip.total_earnings,
            total_deductions: slip.total_deductions,
            component_breakdown: slip.component_breakdown || []
        });
    };

    const handleBreakdownChange = (index: number, field: string, value: string | number) => {
        const newBreakdown = [...editForm.component_breakdown];
        newBreakdown[index] = { ...newBreakdown[index], [field]: value };

        // Recalculate earnings/deductions based on breakdown
        let earnings = 0;
        let deductions = 0;
        newBreakdown.forEach(item => {
            if (item.type === 'earning') earnings += Number(item.amount) || 0;
            if (item.type === 'deduction') deductions += Number(item.amount) || 0;
        });

        setEditForm(prev => ({
            ...prev,
            component_breakdown: newBreakdown,
            total_earnings: earnings,
            total_deductions: deductions
        }));
    };

    const addBreakdownItem = (type: 'earning' | 'deduction') => {
        setEditForm(prev => ({
            ...prev,
            component_breakdown: [
                ...prev.component_breakdown,
                { name: `New ${type}`, type, amount: 0 }
            ]
        }));
    };

    const removeBreakdownItem = (index: number) => {
        const newBreakdown = editForm.component_breakdown.filter((_, i) => i !== index);

        let earnings = 0;
        let deductions = 0;
        newBreakdown.forEach(item => {
            if (item.type === 'earning') earnings += Number(item.amount) || 0;
            if (item.type === 'deduction') deductions += Number(item.amount) || 0;
        });

        setEditForm(prev => ({
            ...prev,
            component_breakdown: newBreakdown,
            total_earnings: earnings,
            total_deductions: deductions
        }));
    };

    const queryClient = useQueryClient();

    const markPaidMutation = useMutation({
        mutationFn: async () => {
            return await api.post(`/hr/payrolls/${payrollId}/mark-paid`);
        },
        onSuccess: () => {
            toast.success("Payroll marked as paid");
            queryClient.invalidateQueries({ queryKey: ['payrolls'] });
            queryClient.invalidateQueries({ queryKey: ['payslips', payrollId] });
            // Let's also trigger an Inertia reload or just rely on query cache
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to mark as paid");
        }
    });

    const handleDownload = (slipId: number) => {
        window.open(`/api/v1/hr/payslips/${slipId}/download`, '_blank');
    };

    return (
        <TooltipProvider>
            <PageContainer maxWidth="full">
                <Head title="Payroll Run Details - HR" />

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <MainPageHeader
                                title="Payroll Run Details"
                                subtitle={`Viewing payslips for this specific payroll generation run.`}
                                icon={FileText}
                            />
                            {slips && slips.length > 0 && (
                                <Badge variant={slips[0].status === 'paid' ? 'default' : 'secondary'} className="mt-1 capitalize">
                                    {slips[0].status}
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center justify-end w-full sm:w-auto gap-2.5">
                            <Button
                                variant="outline"
                                onClick={handleExportBankSheet}
                                className="gap-1.5"
                                title="Download Excel sheet for bank salary transfer"
                            >
                                <Download className="size-4" />
                                Export Bank Sheet
                            </Button>

                            {slips && slips.length > 0 && slips[0].status !== 'paid' && (
                                <Button
                                    variant="default"
                                    onClick={() => markPaidMutation.mutate()}
                                    disabled={markPaidMutation.isPending}
                                    className="gap-1.5"
                                >
                                    <CheckCircle2 className="size-4" />
                                    {markPaidMutation.isPending ? "Marking..." : "Mark Run as Paid"}
                                </Button>
                            )}
                        </div>
                    </div>

                    <Card>
                        <CardHeader className="pb-4 font-semibold text-lg border-b">
                            Generated Payslips
                        </CardHeader>
                        <CardContent className="pt-4">
                            <DataTable
                                columns={[
                                    { key: "sno", label: "S.No" },
                                    { key: "employee_id", label: "Emp ID" },
                                    { key: "name", label: "Staff Name" },
                                    { key: "designation", label: "Designation" },
                                    { key: "basic", label: "Basic Pay" },
                                    { key: "days", label: "Worked Days" },
                                    { key: "net", label: "Net Payable" },
                                    { key: "actions", label: "Actions" }
                                ]}
                                isPaginated={meta.last_page > 1}
                                currentPage={meta.current_page}
                                lastPage={meta.last_page}
                                totalRecords={meta.total}
                                pageSize={meta.per_page}
                                handlePageChange={(p) => setPage(p)}
                                handlePageSizeChange={(pp) => { setPerPage(pp); setPage(1); }}
                            >
                                <Each
                                    of={slips}
                                    isLoading={isLoading}
                                    nodatafound={<TableEmptyState colSpan={8} message="No payslips found for this run." />}
                                    fallback={<TableSkeletonLoader columns={8} rows={5} />}
                                    keyExtractor={(r: any) => r.id}
                                    render={(slip: any, index: number) => {
                                        const empId = slip.user?.staff_profile?.employee_id || slip.user?.staffProfile?.employee_id || `EMP-${String(slip.user_id).padStart(3, '0')}`;
                                        return (
                                            <TableRow key={slip.id}>
                                                <TableCell className="w-[50px]">
                                                    {getSerialNumber(meta.current_page, meta.per_page, index)}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                        {empId}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-medium text-primary">
                                                    {slip.user?.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs font-normal">
                                                        {slip.user?.staff_profile?.designation || slip.user?.staffProfile?.designation || 'Staff'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                                                    ₹{Number(slip.basic_pay).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                        {slip.worked_days ?? 'N/A'} Days
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    ₹{Number(slip.net_pay).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        {slip.status !== 'paid' && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 gap-1 text-xs"
                                                                    onClick={() => openEditModal(slip)}
                                                                    title="Edit & Adjust Payslip"
                                                                >
                                                                    <Pencil className="size-3.5" /> Edit
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 gap-1 text-xs text-slate-600 hover:text-primary"
                                                                    onClick={() => recalculateSlipMutation.mutate(slip.id)}
                                                                    disabled={recalculateSlipMutation.isPending && recalculateSlipMutation.variables === slip.id}
                                                                    title="Recalculate from attendance & salary structure"
                                                                >
                                                                    <RotateCcw className={`size-3.5 ${recalculateSlipMutation.isPending && recalculateSlipMutation.variables === slip.id ? 'animate-spin' : ''}`} />
                                                                    Recalc
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="h-8 gap-1 text-xs"
                                                            onClick={() => handleDownload(slip.id)}
                                                        >
                                                            <Download className="size-3.5" /> PDF
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 gap-1 text-xs"
                                                            disabled={emailMutation.isPending && emailMutation.variables === slip.id}
                                                            onClick={() => emailMutation.mutate(slip.id)}
                                                        >
                                                            <Mail className="size-3.5" />
                                                            {emailMutation.isPending && emailMutation.variables === slip.id ? "..." : "Email"}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }}
                                />
                            </DataTable>
                        </CardContent>
                    </Card>
                </div>

                <Dialog open={!!slipToEdit} onOpenChange={(open) => !open && setSlipToEdit(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <span>Edit Payslip: {slipToEdit?.user?.name}</span>
                                <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    {slipToEdit?.user?.staff_profile?.employee_id || slipToEdit?.user?.staffProfile?.employee_id || `EMP-${String(slipToEdit?.user_id).padStart(3, '0')}`}
                                </span>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Basic Pay (₹)</Label>
                                    <Input
                                        type="number"
                                        value={editForm.basic_pay}
                                        onChange={(e) => setEditForm({ ...editForm, basic_pay: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Total Earnings (₹)</Label>
                                    <Input type="number" value={editForm.total_earnings} readOnly className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Total Deductions (₹)</Label>
                                    <Input type="number" value={editForm.total_deductions} readOnly className="bg-muted" />
                                </div>
                            </div>

                            <div className="rounded-md border p-4 bg-muted/30">
                                <h4 className="text-sm font-semibold mb-1 text-primary">Net Payable</h4>
                                <p className="text-2xl font-bold text-primary">
                                    ₹{(Number(editForm.basic_pay) + Number(editForm.total_earnings) - Number(editForm.total_deductions)).toFixed(2)}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">Salary Components Breakdown</Label>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => addBreakdownItem('earning')} className="h-7 text-xs">
                                            <Plus className="size-3 mr-1" /> Add Earning
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => addBreakdownItem('deduction')} className="h-7 text-xs">
                                            <Plus className="size-3 mr-1" /> Add Deduction
                                        </Button>
                                    </div>
                                </div>

                                {editForm.component_breakdown.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4 border rounded-md">No components added.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {editForm.component_breakdown.map((item, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <Input
                                                        value={item.name}
                                                        onChange={(e) => handleBreakdownChange(index, 'name', e.target.value)}
                                                        placeholder="Component Name"
                                                    />
                                                </div>
                                                <div className="w-[120px]">
                                                    <Badge variant={item.type === 'earning' ? 'default' : item.type === 'deduction' ? 'destructive' : 'secondary'} className="w-full justify-center capitalize">
                                                        {item.type}
                                                    </Badge>
                                                </div>
                                                <div className="w-[150px]">
                                                    <Input
                                                        type="number"
                                                        value={item.amount}
                                                        onChange={(e) => handleBreakdownChange(index, 'amount', Number(e.target.value))}
                                                    />
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => removeBreakdownItem(index)} className="text-destructive">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSlipToEdit(null)}>Cancel</Button>
                            <Button
                                onClick={() => updateSlipMutation.mutate(editForm)}
                                disabled={updateSlipMutation.isPending}
                            >
                                {updateSlipMutation.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </PageContainer>
        </TooltipProvider>
    );
}
