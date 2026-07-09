import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TooltipWrapper } from '@/components/shared/TooltipWrapper';
import { Banknote } from 'lucide-react';
import DataTable, { TableEmptyState, TableSkeletonLoader } from '@/components/dataTable';
import Each from '@/components/Each';
import { TableRow, TableCell } from '@/components/ui/table';
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";

export default function PayrollComponents() {
    const queryClient = useQueryClient();
    const formDisclosure = useDisclosure<any>();
    const deleteDisclosure = useDisclosure<any>();
    
    const [formData, setFormData] = useState({ name: '', type: 'earning' });

    const { data: componentsRes, isLoading } = useQuery({
        queryKey: ['payroll-components'],
        queryFn: async () => {
            const res = await api.get('/hr/payroll-components');
            return res; 
        }
    });

    const items = componentsRes?.data || componentsRes || [];

    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            if (formDisclosure.data?.id) {
                return api.put(`/hr/payroll-components/${formDisclosure.data.id}`, data);
            }
            return api.post('/hr/payroll-components', data);
        },
        onSuccess: () => {
            toast.success(formDisclosure.data?.id ? 'Component updated' : 'Component created');
            queryClient.invalidateQueries({ queryKey: ['payroll-components'] });
            formDisclosure.onClose();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to save component');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return api.delete(`/hr/payroll-components/${id}`);
        },
        onSuccess: () => {
            toast.success('Component deleted');
            queryClient.invalidateQueries({ queryKey: ['payroll-components'] });
            deleteDisclosure.onClose();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to delete component');
        }
    });

    const handleOpenForm = (comp?: any) => {
        if (comp) {
            setFormData({ name: comp.name, type: comp.type });
        } else {
            setFormData({ name: '', type: 'earning' });
        }
        formDisclosure.onOpen(comp || null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const columns = [
        { key: "name", label: "Component Name" },
        { key: "type", label: "Type" },
        { key: "actions", label: "Action" }
    ];

    return (
        <TooltipProvider>
            <PageContainer maxWidth="full">
                <Head title="Payroll Components" />
                
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <MainPageHeader
                            title="Manage Payroll Components"
                            subtitle="Create and manage basic salary, earnings, and deductions components for staff payroll."
                            icon={Banknote}
                        />
                        <div className="flex justify-end w-full sm:w-auto">
                            <Button onClick={() => handleOpenForm()} className="w-full sm:w-auto gap-1.5">
                                <Plus className="size-4" /> Add Component
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader className="pb-4 font-semibold text-lg border-b">
                            Components List
                        </CardHeader>
                        <CardContent className="pt-4">
                    <DataTable
                        columns={columns}
                        isPaginated={false}
                    >
                        <Each
                            of={items}
                            isLoading={isLoading}
                            nodatafound={<TableEmptyState colSpan={3} message="No components found" />}
                            fallback={<TableSkeletonLoader columns={3} rows={3} />}
                            keyExtractor={(r: any) => r.id}
                            render={(row: any) => (
                                <TableRow>
                                    <TableCell className="font-medium">{row.name}</TableCell>
                                    <TableCell className="capitalize">
                                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${row.type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {row.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <TooltipWrapper content="Edit">
                                                <Button variant="ghost" size="icon-sm" onClick={() => handleOpenForm(row)}>
                                                    <Pencil className="size-4" />
                                                </Button>
                                            </TooltipWrapper>
                                            <TooltipWrapper content="Delete">
                                                <Button variant="ghost" size="icon-sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteDisclosure.onOpen(row)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TooltipWrapper>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        />
                    </DataTable>
                </CardContent>
            </Card>

            <Dialog open={formDisclosure.isOpen} onOpenChange={(open) => !open && formDisclosure.onClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{formDisclosure.data?.id ? 'Edit Component' : 'Add Component'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Component Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="e.g. HRA, PF, Transport Allowance"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Component Type</Label>
                                <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="earning">Earning</SelectItem>
                                        <SelectItem value="deduction">Deduction</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={formDisclosure.onClose}>Cancel</Button>
                            <Button type="submit" disabled={saveMutation.isPending}>
                                {saveMutation.isPending ? 'Saving...' : 'Save Component'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteDisclosure.isOpen}
                onOpenChange={(open) => !open && deleteDisclosure.onClose()}
                onConfirm={() => deleteDisclosure.data?.id && deleteMutation.mutate(deleteDisclosure.data.id)}
                title="Delete Component"
                description={`Are you sure you want to delete ${deleteDisclosure.data?.name}?`}
                confirmText="Delete"
                isLoading={deleteMutation.isPending}
            />
                </div>
            </PageContainer>
        </TooltipProvider>
    );
}
