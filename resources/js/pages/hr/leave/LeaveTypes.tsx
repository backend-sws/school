import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Pencil, Trash, ClipboardList } from 'lucide-react';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import DataTable, { TableEmptyState, TableSkeletonLoader } from '@/components/dataTable';
import Each from '@/components/Each';
import {
    TableCell,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function LeaveTypes() {
    const [types, setTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        days_allowed: 0,
        is_paid_leave: true
    });

    const fetchTypes = async () => {
        try {
            const res = await axios.get('/api/v1/hr/leave-types');
            setTypes(res.data.data || []);
        } catch (e) {
            toast.error("Failed to fetch leave types");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await axios.put(`/api/v1/hr/leave-types/${editingId}`, formData);
                toast.success("Leave type updated");
            } else {
                await axios.post('/api/v1/hr/leave-types', formData);
                toast.success("Leave type created");
            }
            setDialogOpen(false);
            fetchTypes();
        } catch (e) {
            toast.error("Failed to save leave type");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this leave type?")) return;
        try {
            await axios.delete(`/api/v1/hr/leave-types/${id}`);
            toast.success("Leave type deleted");
            fetchTypes();
        } catch (e) {
            toast.error("Failed to delete leave type");
        }
    };

    const openCreateDialog = () => {
        setEditingId(null);
        setFormData({ name: '', days_allowed: 0, is_paid_leave: true });
        setDialogOpen(true);
    };

    const openEditDialog = (type: any) => {
        setEditingId(type.id);
        setFormData({
            name: type.name,
            days_allowed: type.days_allowed,
            is_paid_leave: type.is_paid_leave
        });
        setDialogOpen(true);
    };

    return (
        <PageContainer maxWidth="full">
            <Head title="Leave Types" />
            
            <div className="space-y-6">
                <MainPageHeader 
                    title="Leave Types" 
                    subtitle="Manage leave policies and yearly allowances."
                    icon={ClipboardList}
                    breadcrumbs={[{ title: 'HR & Payroll', href: '/hr/payroll' }, { title: 'Leave Types', href: '/hr/leave/types' }]}
                />

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button onClick={openCreateDialog}><Plus className="mr-2 h-4 w-4" /> Add Leave Type</Button>
                </div>

                <DataTable
                    columns={[
                        { key: "name", label: "Name" },
                        { key: "allowance", label: "Yearly Allowance (Days)" },
                        { key: "type", label: "Type" },
                        { key: "actions", label: "Actions", align: "right" }
                    ]}
                    isPaginated={false}
                    currentPage={1}
                    lastPage={1}
                    totalRecords={types.length}
                    pageSize={100}
                    handlePageChange={() => {}}
                    handlePageSizeChange={() => {}}
                >
                    <Each
                        of={types}
                        isLoading={loading}
                        nodatafound={
                            <TableEmptyState
                                colSpan={4}
                                icon={Plus}
                                message="No leave types found."
                                description="Create your first leave policy to get started."
                            />
                        }
                        fallback={<TableSkeletonLoader columns={4} />}
                        render={(type: any, idx: number) => (
                            <TableRow key={type.id}>
                                <TableCell className="font-medium">{type.name}</TableCell>
                                <TableCell>{type.days_allowed} days</TableCell>
                                <TableCell>{type.is_paid_leave ? <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded border border-green-200 text-xs">Paid</span> : <span className="text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200 text-xs">Unpaid (LWP)</span>}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(type)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(type.id)}>
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    />
                </DataTable>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Leave Type" : "Create Leave Type"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Leave Name</Label>
                            <Input 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                placeholder="e.g. Casual Leave, Sick Leave, LWP" 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Days Allowed (Yearly)</Label>
                            <Input 
                                type="number" 
                                value={formData.days_allowed} 
                                onChange={e => setFormData({...formData, days_allowed: parseInt(e.target.value) || 0})} 
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="space-y-0.5">
                                <Label>Is Paid Leave?</Label>
                                <p className="text-xs text-muted-foreground">Unpaid leaves will deduct salary during payroll generation.</p>
                            </div>
                            <Switch 
                                checked={formData.is_paid_leave}
                                onCheckedChange={checked => setFormData({...formData, is_paid_leave: checked})}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </PageContainer>
    );
}
