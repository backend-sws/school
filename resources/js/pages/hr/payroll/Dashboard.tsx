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
import { Eye, PlayCircle, Banknote, Trash2, AlertCircle } from 'lucide-react';
import DataTable, { TableEmptyState, TableSkeletonLoader } from '@/components/dataTable';
import Each from '@/components/Each';
import { TableRow, TableCell } from '@/components/ui/table';
import { parsePaginatedResponse, getSerialNumber } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from '@inertiajs/react';

export default function Dashboard() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [payrollToDelete, setPayrollToDelete] = useState<any>(null);
    
    const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    const { data, isLoading } = useQuery({
        queryKey: ['payrolls', page, perPage],
        queryFn: async () => {
            const res = await api.get('/hr/payrolls', { params: { page, per_page: perPage } });
            return res;
        }
    });

    const { items: payrolls, meta } = parsePaginatedResponse<any>(data);

    const generateMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/hr/payrolls/generate', {
                month: parseInt(selectedMonth),
                year: parseInt(selectedYear)
            });
            return res;
        },
        onSuccess: () => {
            toast.success("Payroll generated successfully");
            setIsGenerateModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['payrolls'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to generate payroll");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await api.delete(`/hr/payrolls/${id}`);
        },
        onSuccess: () => {
            toast.success("Draft payroll deleted successfully");
            setPayrollToDelete(null);
            queryClient.invalidateQueries({ queryKey: ['payrolls'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete payroll");
        }
    });

    return (
        <TooltipProvider>
            <PageContainer maxWidth="full">
                <Head title="Payroll Hub - HR" />
                
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <MainPageHeader
                            title="Payroll Hub"
                            subtitle="Generate monthly payrolls and view historical payroll runs."
                            icon={Banknote}
                        />
                        <div className="flex justify-end w-full sm:w-auto">
                            <Button 
                                onClick={() => setIsGenerateModalOpen(true)} 
                                className="w-full sm:w-auto gap-1.5"
                            >
                                <PlayCircle className="size-4" />
                                Generate Payroll
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="pb-2 text-sm font-medium text-muted-foreground">Total Paid This Month</CardHeader>
                            <CardContent className="text-3xl font-bold">
                                ₹{payrolls?.length > 0 ? Number(payrolls[0]?.total_amount).toFixed(2) : '0.00'}
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="pb-4 font-semibold text-lg border-b">
                            Recent Payroll Runs
                        </CardHeader>
                        <CardContent className="pt-4">
                            <DataTable
                                columns={[
                                    { key: "sno", label: "S.No" },
                                    { key: "month", label: "Month/Year" },
                                    { key: "status", label: "Status" },
                                    { key: "amount", label: "Total Amount" },
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
                                    of={payrolls}
                                    isLoading={isLoading}
                                    nodatafound={<TableEmptyState colSpan={4} message="No payroll runs found." />}
                                    fallback={<TableSkeletonLoader columns={4} rows={5} />}
                                    keyExtractor={(r: any) => r.id}
                                    render={(run: any, index: number) => (
                                        <TableRow>
                                            <TableCell className="w-[60px]">
                                                {getSerialNumber(meta.current_page, meta.per_page, index)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {new Date(run.year, run.month - 1).toLocaleString('default', { month: 'long' })} {run.year}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                                    run.status === 'completed' || run.status === 'paid' 
                                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                } capitalize`}>
                                                    {run.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                ₹{Number(run.total_amount).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/hr/payroll/${run.id}`}>
                                                        <Button variant="outline" size="sm" className="gap-1.5">
                                                            <Eye className="size-4" /> View Slips
                                                        </Button>
                                                    </Link>
                                                    {run.status === 'draft' && (
                                                        <Button 
                                                            variant="destructive" 
                                                            size="sm" 
                                                            className="gap-1.5"
                                                            onClick={() => setPayrollToDelete(run)}
                                                        >
                                                            <Trash2 className="size-4" /> Delete
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            </DataTable>
                        </CardContent>
                    </Card>
                </div>
                
                <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Generate Payroll</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Month</label>
                                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                                <SelectItem key={m} value={m.toString()}>
                                                    {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Year</label>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[...Array(5)].map((_, i) => {
                                                const year = new Date().getFullYear() - 2 + i;
                                                return (
                                                    <SelectItem key={year} value={year.toString()}>
                                                        {year}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                This will generate draft payslips for all staff members with an active salary structure. You can review and edit them before marking them as paid.
                            </p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
                                {generateMutation.isPending ? "Generating..." : "Generate Draft Payroll"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={!!payrollToDelete} onOpenChange={(open) => !open && setPayrollToDelete(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="size-5" />
                                Confirm Deletion
                            </DialogTitle>
                        </DialogHeader>
                        <div className="py-4 text-sm text-muted-foreground">
                            Are you sure you want to delete this draft payroll for {payrollToDelete ? new Date(payrollToDelete.year, payrollToDelete.month - 1).toLocaleString('default', { month: 'long' }) : ''} {payrollToDelete?.year}?
                            This action will also delete all associated draft payslips. This action cannot be undone.
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setPayrollToDelete(null)}>Cancel</Button>
                            <Button 
                                variant="destructive" 
                                onClick={() => payrollToDelete && deleteMutation.mutate(payrollToDelete.id)} 
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? "Deleting..." : "Delete Draft"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </PageContainer>
        </TooltipProvider>
    );
}
