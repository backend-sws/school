import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import DataTable, { TableEmptyState, TableSkeletonLoader } from '@/components/dataTable';
import Each from '@/components/Each';
import { TableRow, TableCell } from '@/components/ui/table';
import { parsePaginatedResponse, getSerialNumber } from '@/lib/utils';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TooltipWrapper } from '@/components/shared/TooltipWrapper';
import { Banknote, History, Download } from 'lucide-react';
import { Dialog as RadixDialog, DialogContent as RadixDialogContent, DialogHeader as RadixDialogHeader, DialogTitle as RadixDialogTitle } from '@/components/ui/dialog';

export default function SalaryStructures() {
    const queryClient = useQueryClient();
    const [editingStaff, setEditingStaff] = useState<any>(null);
    const [historyStaff, setHistoryStaff] = useState<any>(null);
    const [basicSalary, setBasicSalary] = useState('');
    const [components, setComponents] = useState<any[]>([]);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const { data, isLoading } = useQuery({
        queryKey: ['salary-structures', page, perPage],
        queryFn: async () => {
            const res = await api.get('/hr/salary-structures', { params: { page, per_page: perPage } });
            return res;
        }
    });

    const { items, meta } = parsePaginatedResponse<any>(data);

    const { data: historyData, isLoading: isHistoryLoading } = useQuery({
        queryKey: ['payslips-history', historyStaff?.id],
        queryFn: async () => {
            if (!historyStaff?.id) return null;
            const res = await api.get(`/hr/payslips/staff/${historyStaff.id}`);
            return res;
        },
        enabled: !!historyStaff?.id
    });

    const historySlips = historyData?.data || [];

    const { data: payrollComponentsRes } = useQuery({
        queryKey: ['payroll-components'],
        queryFn: async () => {
            const res = await api.get('/hr/payroll-components');
            return res;
        }
    });

    const payrollComponents = payrollComponentsRes?.data || payrollComponentsRes || [];

    const mutation = useMutation({
        mutationFn: async ({ userId, basic_salary, components }: { userId: number, basic_salary: number, components: any[] }) => {
            return api.post(`/hr/salary-structures/${userId}`, { basic_salary, components });
        },
        onSuccess: () => {
            toast.success('Salary updated successfully');
            queryClient.invalidateQueries({ queryKey: ['salary-structures'] });
            setEditingStaff(null);
        },
        onError: () => {
            toast.error('Failed to update salary');
        }
    });

    const handleEdit = (staff: any) => {
        setEditingStaff(staff);
        setBasicSalary(staff.salary_structure?.basic_salary || '');
        if (staff.salary_structure?.components) {
            setComponents(staff.salary_structure.components.map((c: any) => ({
                payroll_component_id: c.payroll_component_id,
                amount: c.amount
            })));
        } else {
            setComponents([]);
        }
    };

    const handleSave = () => {
        if (!editingStaff) return;
        mutation.mutate({
            userId: editingStaff.id,
            basic_salary: Number(basicSalary),
            components: components.map(c => ({
                payroll_component_id: Number(c.payroll_component_id),
                amount: Number(c.amount)
            }))
        });
    };

    const addComponent = () => {
        setComponents([...components, { payroll_component_id: '', amount: '' }]);
    };

    const removeComponent = (index: number) => {
        const newComponents = [...components];
        newComponents.splice(index, 1);
        setComponents(newComponents);
    };

    const updateComponent = (index: number, field: string, value: any) => {
        const newComponents = [...components];
        newComponents[index][field] = value;
        setComponents(newComponents);
    };

    return (
        <TooltipProvider>
            <PageContainer maxWidth="full">
                <Head title="Salary Structures - Payroll" />
                
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <MainPageHeader
                            title="Manage Salary Structures"
                            subtitle="View and update staff basic salaries and individual payroll components."
                            icon={Banknote}
                        />
                    </div>

                    <Card>
                        <CardHeader className="pb-4 font-semibold text-lg border-b">
                            Staff Salaries
                        </CardHeader>
                        <CardContent className="pt-4">
                            <DataTable
                                columns={[
                                    { key: "sno", label: "S.No" },
                                    { key: "name", label: "Staff Name" },
                                    { key: "designation", label: "Designation" },
                                    { key: "basic_salary", label: "Basic Salary" },
                                    { key: "components", label: "Components" },
                                    { key: "net_salary", label: "Net Salary" },
                                    { key: "action", label: "Action" }
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
                            of={items}
                            isLoading={isLoading}
                            nodatafound={<TableEmptyState colSpan={7} message="No staff found." />}
                            fallback={<TableSkeletonLoader columns={7} rows={5} />}
                            keyExtractor={(r: any) => r.id}
                            render={(row: any, index: number) => (
                                <TableRow>
                                    <TableCell className="w-[60px]">
                                        {getSerialNumber(meta.current_page, meta.per_page, index)}
                                    </TableCell>
                                    <TableCell className="font-medium">{row.name}</TableCell>
                                    <TableCell className="font-medium text-primary">
                                        {row.staff_profile?.designation || row.staffProfile?.designation || 'N/A'}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        ₹{row.salary_structure?.basic_salary || row.salaryStructure?.basic_salary || '0.00'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {(row.salary_structure?.components || row.salaryStructure?.components || []).map((comp: any, idx: number) => (
                                                <span key={idx} className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                                                    (comp.payroll_component?.type || comp.payrollComponent?.type) === 'earning' 
                                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                                        : 'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                    {comp.payroll_component?.name || comp.payrollComponent?.name}: ₹{comp.amount}
                                                </span>
                                            ))}
                                            {!(row.salary_structure?.components?.length || row.salaryStructure?.components?.length) && (
                                                <span className="text-muted-foreground text-xs italic">No components</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        ₹{
                                            (Number(row.salary_structure?.basic_salary || row.salaryStructure?.basic_salary || 0) + 
                                            (row.salary_structure?.components || row.salaryStructure?.components || []).reduce((acc: number, comp: any) => {
                                                const type = comp.payroll_component?.type || comp.payrollComponent?.type;
                                                return acc + (type === 'earning' ? Number(comp.amount) : -Number(comp.amount));
                                            }, 0)).toFixed(2)
                                        }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="secondary" size="sm" onClick={() => setHistoryStaff(row)} className="gap-1.5">
                                                <History className="size-4" /> History
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(row)} className="gap-1.5">
                                                <Pencil className="size-4" /> Edit
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        />
                    </DataTable>
                </CardContent>
            </Card>

            <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Edit Salary: <span className="text-primary">{editingStaff?.name}</span></DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-2">
                        <div className="space-y-2">
                            <Label htmlFor="basic_salary" className="font-semibold text-sm">
                                Basic Salary (₹)
                            </Label>
                            <Input
                                id="basic_salary"
                                type="number"
                                placeholder="0.00"
                                value={basicSalary}
                                onChange={(e) => setBasicSalary(e.target.value)}
                                className="w-full text-lg font-medium"
                            />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b">
                                <Label className="text-base font-semibold">Additional Components</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addComponent} className="gap-1.5">
                                    <Plus className="size-4" /> Add Component
                                </Button>
                            </div>
                            
                            {components.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground text-sm bg-muted/20 rounded-lg border border-dashed">
                                    No additional components added yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {components.map((comp, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-muted/10 p-3 rounded-lg border">
                                            <div className="w-full sm:flex-1">
                                                <Select
                                                    value={comp.payroll_component_id?.toString() || ""}
                                                    onValueChange={(val) => updateComponent(index, 'payroll_component_id', val)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Component" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {payrollComponents?.map((pc: any) => (
                                                            <SelectItem key={pc.id} value={pc.id.toString()}>
                                                                {pc.name} <span className="text-xs text-muted-foreground ml-1 capitalize">({pc.type})</span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="w-full sm:w-[150px]">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                                                    <Input
                                                        type="number"
                                                        placeholder="Amount"
                                                        value={comp.amount}
                                                        onChange={(e) => updateComponent(index, 'amount', e.target.value)}
                                                        className="pl-7"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end w-full sm:w-auto mt-2 sm:mt-0">
                                                <TooltipWrapper content="Remove">
                                                    <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0" onClick={() => removeComponent(index)}>
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </TooltipWrapper>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setEditingStaff(null)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={mutation.isPending}>
                            {mutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <RadixDialog open={!!historyStaff} onOpenChange={(open) => !open && setHistoryStaff(null)}>
                <RadixDialogContent className="sm:max-w-[700px]">
                    <RadixDialogHeader>
                        <RadixDialogTitle className="text-xl">Payslip History: <span className="text-primary">{historyStaff?.name}</span></RadixDialogTitle>
                    </RadixDialogHeader>
                    <div className="py-4">
                        {isHistoryLoading ? (
                            <div className="py-10 text-center text-muted-foreground">Loading history...</div>
                        ) : historySlips.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                No payslip history found for this staff member.
                            </div>
                        ) : (
                            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
                                {historySlips.map((slip: any) => (
                                    <div key={slip.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                        <div>
                                            <h4 className="font-semibold text-lg">
                                                {new Date(slip.payroll.year, slip.payroll.month - 1).toLocaleString('default', { month: 'long' })} {slip.payroll.year}
                                            </h4>
                                            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                                                <span>Basic: ₹{Number(slip.basic_pay).toFixed(2)}</span>
                                                <span>Earnings: ₹{Number(slip.total_earnings).toFixed(2)}</span>
                                                <span>Deductions: ₹{Number(slip.total_deductions).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="font-bold text-lg text-primary">₹{Number(slip.net_pay).toFixed(2)}</span>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="gap-1.5 h-8"
                                                onClick={() => window.open(`/api/v1/hr/payslips/${slip.id}/download`, '_blank')}
                                            >
                                                <Download className="size-3.5" /> Download
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </RadixDialogContent>
            </RadixDialog>
                </div>
            </PageContainer>
        </TooltipProvider>
    );
}
